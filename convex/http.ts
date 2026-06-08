import { httpRouter } from "convex/server";
import Stripe from "stripe";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { BillingInterval, CheckoutPlanId } from "./plans";

const http = httpRouter();

auth.addHttpRoutes(http);

/**
 * Reverse-map a Stripe Price id back to our plan + interval using the same env
 * vars billing.ts uses to create checkout sessions. Returns null if no match.
 */
function planFromPrice(
  priceId: string | undefined
): { plan: CheckoutPlanId; interval: BillingInterval } | null {
  if (!priceId) return null;
  const table: Array<[CheckoutPlanId, BillingInterval, string]> = [
    ["personal", "monthly", "STRIPE_PRICE_PERSONAL_MONTHLY"],
    ["personal", "annual", "STRIPE_PRICE_PERSONAL_ANNUAL"],
    ["teams", "monthly", "STRIPE_PRICE_TEAMS_MONTHLY"],
    ["teams", "annual", "STRIPE_PRICE_TEAMS_ANNUAL"],
  ];
  for (const [plan, interval, envVar] of table) {
    if (process.env[envVar] && process.env[envVar] === priceId) {
      return { plan, interval };
    }
  }
  return null;
}

function customerIdOf(
  customer: string | { id: string } | null | undefined
): string | null {
  if (!customer) return null;
  return typeof customer === "string" ? customer : customer.id;
}

/**
 * Stripe webhook. Verifies the signature with SubtleCrypto (works in the V8
 * runtime — no "use node" needed) then persists subscription state via the
 * internal mutations in convex/subscriptions.ts.
 *
 * Register this URL in the Stripe dashboard as:
 *   https://<your-deployment>.convex.site/stripe/webhook
 */
http.route({
  path: "/stripe/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!webhookSecret || !apiKey) {
      return new Response("Billing is not configured", { status: 500 });
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    const payload = await request.text();
    const stripe = new Stripe(apiKey, {
      httpClient: Stripe.createFetchHttpClient(),
    });

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        payload,
        signature,
        webhookSecret,
        undefined,
        Stripe.createSubtleCryptoProvider()
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown error";
      return new Response(`Webhook signature verification failed: ${message}`, {
        status: 400,
      });
    }

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = customerIdOf(sub.customer);
        if (!customerId) break;

        const item = sub.items?.data?.[0];
        const priceId = item?.price?.id;
        // Prefer metadata we set at checkout; fall back to price reverse-map.
        const metaPlan = sub.metadata?.plan as CheckoutPlanId | undefined;
        const metaInterval = sub.metadata?.interval as
          | BillingInterval
          | undefined;
        // The live price is authoritative — Stripe does NOT update the
        // checkout metadata when a customer switches plan/interval via the
        // Billing Portal, so metadata is only a fallback.
        const mapped = planFromPrice(priceId);
        const plan = mapped?.plan ?? metaPlan ?? "free";
        const interval = mapped?.interval ?? metaInterval;

        // current_period_end lives on the item in newer API versions; fall back
        // to the subscription-level field for older ones.
        const periodEndSec =
          (item as { current_period_end?: number } | undefined)
            ?.current_period_end ??
          (sub as unknown as { current_period_end?: number })
            .current_period_end;

        await ctx.runMutation(
          internal.subscriptions.applyStripeSubscriptionUpdate,
          {
            stripeCustomerId: customerId,
            plan,
            status: sub.status,
            stripeSubscriptionId: sub.id,
            interval,
            seats: item?.quantity ?? undefined,
            currentPeriodEnd:
              typeof periodEndSec === "number"
                ? periodEndSec * 1000
                : undefined,
          }
        );
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = customerIdOf(sub.customer);
        if (customerId) {
          await ctx.runMutation(
            internal.subscriptions.markSubscriptionCanceled,
            { stripeCustomerId: customerId }
          );
        }
        break;
      }

      // checkout.session.completed: the customer<->user link is already
      // established when we create the customer in createCheckoutSession, and
      // the subscription.created/updated events carry the plan details, so no
      // additional work is required here.
      default:
        break;
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;
