import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "./_generated/dataModel";
import {
  isPlanId,
  storageLimitBytes,
  verificationLimit,
  VERIFICATION_PERIOD_MS,
  type PlanId,
} from "./plans";

/**
 * Subscription / plan state (Phase 5). This file runs in the default Convex (V8)
 * runtime — it intentionally does NOT use the Stripe SDK or "use node". The
 * Stripe-touching code lives in convex/billing.ts (Node action) and the webhook
 * in convex/http.ts; both call the internal functions here to persist state.
 */

const ACTIVE_STATUSES = new Set([
  "active",
  "trialing",
  "past_due", // keep access during dunning
]);

// ---------------------------------------------------------------------------
// Shared helpers (plain functions — callable from any query/mutation in V8)
// ---------------------------------------------------------------------------

export async function getSubscriptionDoc(
  ctx: QueryCtx,
  userId: Id<"users">
): Promise<Doc<"subscriptions"> | null> {
  // Use first() rather than unique() so a rare duplicate row (e.g. from two
  // concurrent checkouts) degrades gracefully instead of throwing on every read.
  return await ctx.db
    .query("subscriptions")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
}

/**
 * The plan to enforce against. Falls back to "free" when there is no row or the
 * Stripe status is no longer active (e.g. canceled / unpaid).
 */
export async function getEffectivePlan(
  ctx: QueryCtx,
  userId: Id<"users">
): Promise<{ plan: PlanId; seats: number }> {
  const sub = await getSubscriptionDoc(ctx, userId);
  if (!sub) return { plan: "free", seats: 1 };
  const active = sub.status === undefined || ACTIVE_STATUSES.has(sub.status);
  return {
    plan: active ? sub.plan : "free",
    seats: sub.seats ?? 1,
  };
}

/**
 * Enforces the monthly verification quota and records one usage. Creates a
 * lazy free-plan row when needed. Throws a clear, user-facing error when the
 * limit is hit. Call this from the verification mutation BEFORE committing the
 * verify so the count and the action stay consistent in one transaction.
 */
export async function recordVerificationOrThrow(
  ctx: MutationCtx,
  userId: Id<"users">
): Promise<void> {
  const sub = await getSubscriptionDoc(ctx, userId);
  const now = Date.now();
  const { plan } = await getEffectivePlan(ctx, userId);
  const limit = verificationLimit(plan);

  // Determine current usage within the rolling 30-day window.
  let used = 0;
  let periodStart = now;
  if (sub?.verificationPeriodStart !== undefined) {
    if (now - sub.verificationPeriodStart < VERIFICATION_PERIOD_MS) {
      used = sub.verificationsUsed ?? 0;
      periodStart = sub.verificationPeriodStart;
    }
    // else: window elapsed -> reset (used stays 0, periodStart = now)
  }

  if (limit !== null && used >= limit) {
    throw new Error(
      `Monthly verification limit reached (${limit} on the ${plan} plan). ` +
        `Upgrade your plan to verify more documents.`
    );
  }

  if (sub) {
    await ctx.db.patch(sub._id, {
      verificationsUsed: used + 1,
      verificationPeriodStart: periodStart,
    });
  } else {
    await ctx.db.insert("subscriptions", {
      userId,
      plan: "free",
      verificationsUsed: 1,
      verificationPeriodStart: periodStart,
    });
  }
}

// ---------------------------------------------------------------------------
// Public query (for settings / paywall UI)
// ---------------------------------------------------------------------------

export const getMySubscription = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const sub = await getSubscriptionDoc(ctx, userId);
    const { plan, seats } = await getEffectivePlan(ctx, userId);
    const now = Date.now();
    let verificationsUsed = 0;
    if (
      sub?.verificationPeriodStart !== undefined &&
      now - sub.verificationPeriodStart < VERIFICATION_PERIOD_MS
    ) {
      verificationsUsed = sub.verificationsUsed ?? 0;
    }
    return {
      plan,
      seats,
      status: sub?.status ?? null,
      interval: sub?.interval ?? null,
      currentPeriodEnd: sub?.currentPeriodEnd ?? null,
      hasStripeCustomer: Boolean(sub?.stripeCustomerId),
      storageLimitBytes: storageLimitBytes(plan, seats),
      verificationLimit: verificationLimit(plan),
      verificationsUsed,
    };
  },
});

// ---------------------------------------------------------------------------
// Internal functions called by billing.ts (action) and http.ts (webhook)
// ---------------------------------------------------------------------------

export const getByUserId = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await getSubscriptionDoc(ctx, args.userId);
  },
});

/**
 * Persist (or create) the Stripe customer id for a user. Returns the row id.
 */
export const setStripeCustomerId = internalMutation({
  args: { userId: v.id("users"), stripeCustomerId: v.string() },
  handler: async (ctx, args): Promise<Id<"subscriptions">> => {
    const existing = await getSubscriptionDoc(ctx, args.userId);
    if (existing) {
      await ctx.db.patch(existing._id, {
        stripeCustomerId: args.stripeCustomerId,
      });
      return existing._id;
    }
    return await ctx.db.insert("subscriptions", {
      userId: args.userId,
      plan: "free",
      stripeCustomerId: args.stripeCustomerId,
    });
  },
});

/**
 * Apply a Stripe subscription state change (from a webhook event) keyed by the
 * Stripe customer id. No-op if we can't find the matching row (shouldn't happen
 * because we create the row when we create the customer).
 */
export const applyStripeSubscriptionUpdate = internalMutation({
  args: {
    stripeCustomerId: v.string(),
    plan: v.string(),
    status: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
    interval: v.optional(v.union(v.literal("monthly"), v.literal("annual"))),
    seats: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("subscriptions")
      .withIndex("by_stripe_customer", (q) =>
        q.eq("stripeCustomerId", args.stripeCustomerId)
      )
      .unique();

    const plan: PlanId = isPlanId(args.plan) ? args.plan : "free";

    if (!row) {
      // We always create a subscriptions row (with userId) when we create the
      // Stripe customer in createCheckoutSession, so a missing row here means
      // the event is for a customer we don't recognise. Nothing safe to do
      // without a userId — log and ignore rather than insert an orphan.
      console.warn(
        `[billing] no subscription row for Stripe customer ${args.stripeCustomerId}; ignoring update`
      );
      return;
    }

    await ctx.db.patch(row._id, {
      plan,
      status: args.status,
      stripeSubscriptionId: args.stripeSubscriptionId ?? row.stripeSubscriptionId,
      interval: args.interval ?? row.interval,
      seats: args.seats ?? row.seats,
      currentPeriodEnd: args.currentPeriodEnd ?? row.currentPeriodEnd,
    });
  },
});

/**
 * Downgrade to free on subscription deletion/cancellation.
 */
export const markSubscriptionCanceled = internalMutation({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("subscriptions")
      .withIndex("by_stripe_customer", (q) =>
        q.eq("stripeCustomerId", args.stripeCustomerId)
      )
      .unique();
    if (!row) return;
    await ctx.db.patch(row._id, {
      plan: "free",
      status: "canceled",
      stripeSubscriptionId: undefined,
      currentPeriodEnd: undefined,
    });
  },
});
