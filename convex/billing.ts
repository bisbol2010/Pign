"use node";

import { v } from "convex/values";
import Stripe from "stripe";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc } from "./_generated/dataModel";
import { PLAN_LIMITS, type BillingInterval, type CheckoutPlanId } from "./plans";

/**
 * Stripe checkout + billing portal (Phase 5). Runs in the Node runtime so it can
 * use the Stripe SDK for outbound API calls. Webhook handling lives in
 * convex/http.ts (V8 runtime, SubtleCrypto signature verification); state is
 * persisted via the internal functions in convex/subscriptions.ts.
 *
 * Degrades gracefully: if STRIPE_SECRET_KEY is unset, the actions throw a clear
 * error but the rest of the app (incl. free-plan enforcement) keeps working.
 */

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "Billing is not configured: STRIPE_SECRET_KEY is missing. See docs/BILLING-SETUP.md."
    );
  }
  // apiVersion is intentionally omitted so the SDK uses the account default.
  return new Stripe(key);
}

function getSiteUrl(): string {
  const url = process.env.SITE_URL;
  if (!url) {
    throw new Error(
      "SITE_URL is not set in the Convex deployment environment; cannot build redirect URLs."
    );
  }
  return url.replace(/\/$/, "");
}

// Maps (plan, interval) -> the env var that holds its Stripe Price id.
const PRICE_ENV_VARS: Record<CheckoutPlanId, Record<BillingInterval, string>> = {
  personal: {
    monthly: "STRIPE_PRICE_PERSONAL_MONTHLY",
    annual: "STRIPE_PRICE_PERSONAL_ANNUAL",
  },
  teams: {
    monthly: "STRIPE_PRICE_TEAMS_MONTHLY",
    annual: "STRIPE_PRICE_TEAMS_ANNUAL",
  },
};

function resolvePriceId(plan: CheckoutPlanId, interval: BillingInterval): string {
  const envVar = PRICE_ENV_VARS[plan][interval];
  const priceId = process.env[envVar];
  if (!priceId) {
    throw new Error(
      `Missing Stripe price id: set ${envVar} in the Convex environment. See docs/BILLING-SETUP.md.`
    );
  }
  return priceId;
}

/**
 * createCheckoutSession — called by the pricing page. Requires an authenticated
 * user. Creates/reuses a Stripe Customer for the user and returns a Checkout
 * Session url for the selected plan + interval.
 */
export const createCheckoutSession = action({
  args: {
    planId: v.union(v.literal("personal"), v.literal("teams")),
    interval: v.union(v.literal("monthly"), v.literal("annual")),
  },
  handler: async (ctx, args): Promise<{ url: string }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email ?? undefined;

    const stripe = getStripe();
    const siteUrl = getSiteUrl();
    const priceId = resolvePriceId(args.planId, args.interval);

    // Reuse an existing Stripe customer if we already have one for this user.
    const existing: Doc<"subscriptions"> | null = await ctx.runQuery(
      internal.subscriptions.getByUserId,
      { userId }
    );

    let customerId = existing?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { convexUserId: userId },
      });
      customerId = customer.id;
      await ctx.runMutation(internal.subscriptions.setStripeCustomerId, {
        userId,
        stripeCustomerId: customerId,
      });
    }

    const isTeams = args.planId === "teams";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: userId,
      line_items: [
        {
          price: priceId,
          quantity: isTeams ? PLAN_LIMITS.teams.minSeats : 1,
          ...(isTeams
            ? {
                adjustable_quantity: {
                  enabled: true,
                  minimum: PLAN_LIMITS.teams.minSeats,
                  maximum: 200,
                },
              }
            : {}),
        },
      ],
      // Persisted onto the resulting subscription so the webhook can map
      // price -> plan/interval even before we read line items.
      subscription_data: {
        metadata: {
          convexUserId: userId,
          plan: args.planId,
          interval: args.interval,
        },
      },
      metadata: {
        convexUserId: userId,
        plan: args.planId,
        interval: args.interval,
      },
      allow_promotion_codes: true,
      success_url: `${siteUrl}/settings?billing=success`,
      cancel_url: `${siteUrl}/pricing?billing=cancelled`,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }
    return { url: session.url };
  },
});

/**
 * createPortalSession — opens the Stripe Billing Portal for managing or
 * cancelling an existing subscription.
 */
export const createPortalSession = action({
  args: {},
  handler: async (ctx): Promise<{ url: string }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const stripe = getStripe();
    const siteUrl = getSiteUrl();

    const existing: Doc<"subscriptions"> | null = await ctx.runQuery(
      internal.subscriptions.getByUserId,
      { userId }
    );
    if (!existing?.stripeCustomerId) {
      throw new Error("No billing account found for this user.");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: existing.stripeCustomerId,
      return_url: `${siteUrl}/settings`,
    });

    return { url: session.url };
  },
});
