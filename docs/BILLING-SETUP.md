# Billing setup (Stripe) — Phase 5

This document is the operator runbook for Pign's Stripe billing + plan
enforcement. The code is fully implemented; it just needs the Stripe account,
products/prices, and the environment variables below to go live.

> The app **builds and runs without any Stripe keys**. With keys absent,
> everyone is treated as the **free** plan, storage/verification limits are
> still enforced, and the checkout/portal actions throw a clear, user-facing
> error ("Billing is not configured…") instead of crashing.

---

## 1. What got built

| Piece | File | Notes |
|---|---|---|
| Plan limits + helpers | `convex/plans.ts` | Pure constants (no Stripe import). Tiers + storage/verification limits. |
| Subscription state | `convex/schema.ts` → `subscriptions` table | One row per user, created lazily. Absence of a row = free. |
| State mutations/queries | `convex/subscriptions.ts` | Internal q/m for the action + webhook; public `getMySubscription` for UI. |
| Checkout + portal | `convex/billing.ts` (`"use node"`) | `createCheckoutSession`, `createPortalSession`. Uses the Stripe Node SDK. |
| Webhook | `convex/http.ts` → `POST /stripe/webhook` | V8 runtime, SubtleCrypto signature verification. |
| Enforcement | `convex/documents.ts` | Storage quota in `create`; monthly verification quota in `verify`. |

### Public contract (what the pricing page calls)

```ts
// Action — returns a Stripe Checkout URL to redirect to.
createCheckoutSession({
  planId: "personal" | "teams",
  interval: "monthly" | "annual",
}): Promise<{ url: string }>

// Action — returns a Stripe Billing Portal URL (manage / cancel).
createPortalSession(): Promise<{ url: string }>
```

Both require an authenticated user (derived server-side via
`getAuthUserId` / `ctx.auth.getUserIdentity()` — never passed as an argument).

---

## 2. Plan limits (enforced in code)

Source of truth: `docs/plan/01-product-and-pricing-strategy.md` §4 and the
confirmed decisions in `docs/plan/00-master-plan.md`.

| Plan | Price (mo / annual-per-mo) | Storage | Verifications / mo | Seats |
|---|---|---|---|---|
| **Free** | $0 | **15 GB** | 10 | 1 |
| **Personal** | **$6 / $5** | **200 GB** | 500 | 1 |
| **Teams** | **$12 / $10** per seat | **1 TB + 250 GB/seat** | Unlimited (fair use) | 3–200 |
| **Enterprise** | Custom (contact sales) | 5 TB+ | Unlimited | — |

Notes:
- **Verification quota** is a rolling 30-day window tracked on the
  `subscriptions` row (`verificationsUsed` / `verificationPeriodStart`).
- **Teams storage** is documented as "1 TB pooled + 250 GB/seat". True
  team-wide pooled accounting is not wired up in Phase 5; we enforce per-user
  against the full team allowance (a safe over-approximation). Tightening to
  real pooled accounting is a follow-up.
- **Enterprise** and **Developer/API** are contact-sales — there is no live
  checkout path for them.

---

## 3. Stripe dashboard setup

1. **Create the account** (or use an existing one). Grab the **Secret key**
   from *Developers → API keys* (`sk_live_…` for prod, `sk_test_…` for test).

2. **Create two Products**, each with a **monthly** and an **annual** recurring
   price (USD). Annual ≈ 2 months free (~17% off):

   | Product | Price | Interval | Stripe price | env var |
   |---|---|---|---|---|
   | **Pign Personal** | $6.00 | monthly | recurring | `STRIPE_PRICE_PERSONAL_MONTHLY` |
   | **Pign Personal** | $60.00 | yearly | recurring | `STRIPE_PRICE_PERSONAL_ANNUAL` |
   | **Pign Teams** | $12.00 | monthly | recurring, **per seat** | `STRIPE_PRICE_TEAMS_MONTHLY` |
   | **Pign Teams** | $120.00 | yearly | recurring, **per seat** | `STRIPE_PRICE_TEAMS_ANNUAL` |

   - For **Teams**, the checkout uses a per-seat quantity (min 3, max 200, buyer
     adjustable). Use a standard recurring price; quantity is handled by the
     Checkout Session.
   - Copy each **Price ID** (`price_…`) — you'll set it as the matching env var.

3. **Enable the Billing Portal**: *Settings → Billing → Customer portal* →
   activate it and allow plan cancellation/updates. `createPortalSession`
   depends on this being enabled.

4. **Register the webhook**: *Developers → Webhooks → Add endpoint*.
   - **URL:** `https://<your-deployment>.convex.site/stripe/webhook`
     (use your Convex deployment's **`.convex.site`** HTTP-actions domain — not
     `.convex.cloud`).
   - **Events to send:**
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the **Signing secret** (`whsec_…`) → `STRIPE_WEBHOOK_SECRET`.

   For **local development**, use the Stripe CLI:
   ```bash
   stripe listen --forward-to https://<your-deployment>.convex.site/stripe/webhook
   ```
   (the CLI prints a `whsec_…` to use as `STRIPE_WEBHOOK_SECRET` for testing).

---

## 4. Environment variables

Set these in the **Convex deployment** environment (dev and prod separately):

```bash
npx convex env set STRIPE_SECRET_KEY            sk_live_xxx
npx convex env set STRIPE_WEBHOOK_SECRET        whsec_xxx
npx convex env set STRIPE_PRICE_PERSONAL_MONTHLY price_xxx
npx convex env set STRIPE_PRICE_PERSONAL_ANNUAL  price_xxx
npx convex env set STRIPE_PRICE_TEAMS_MONTHLY    price_xxx
npx convex env set STRIPE_PRICE_TEAMS_ANNUAL     price_xxx
```

| Variable | Required | Purpose |
|---|---|---|
| `STRIPE_SECRET_KEY` | yes (to enable billing) | Stripe API auth for checkout/portal + webhook verification. |
| `STRIPE_WEBHOOK_SECRET` | yes (for webhook) | Verifies inbound webhook signatures. |
| `STRIPE_PRICE_PERSONAL_MONTHLY` | yes | Price id for Personal monthly. |
| `STRIPE_PRICE_PERSONAL_ANNUAL` | yes | Price id for Personal annual. |
| `STRIPE_PRICE_TEAMS_MONTHLY` | yes | Price id for Teams monthly (per seat). |
| `STRIPE_PRICE_TEAMS_ANNUAL` | yes | Price id for Teams annual (per seat). |
| `SITE_URL` | already set | Reused to build success/cancel/return URLs. |

Redirect URLs the code builds from `SITE_URL`:
- Success: `${SITE_URL}/settings?billing=success`
- Cancel: `${SITE_URL}/pricing?billing=cancelled`
- Portal return: `${SITE_URL}/settings`

---

## 5. How the flow works

1. Pricing page calls `createCheckoutSession({ planId, interval })`.
2. The action ensures a Stripe **Customer** exists for the user (creating one
   and persisting `stripeCustomerId` on first use), then creates a **Checkout
   Session** for the resolved Price and returns its `url`.
3. The client redirects the user to `url`. On success Stripe redirects back to
   `/settings?billing=success`.
4. Stripe fires `customer.subscription.created/updated` → our webhook maps the
   price → `plan`/`interval` (preferring the metadata set at checkout), reads
   status, seats (quantity), and current period end, and patches the
   `subscriptions` row.
5. Enforcement reads the effective plan: `documents.create` checks the storage
   limit; `documents.verify` checks the monthly verification limit.
6. On `customer.subscription.deleted`, the user is downgraded to **free**.

---

## 6. Verifying the integration

```bash
# Compile Convex functions + validate schema
npx convex dev --once

# Optional: trigger a test event once the webhook is registered
stripe trigger checkout.session.completed
```

Then complete a test checkout (test-mode card `4242 4242 4242 4242`) and
confirm the `subscriptions` row updates to the purchased plan, and that the
storage/verification limits change accordingly.
