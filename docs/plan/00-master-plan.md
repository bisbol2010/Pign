# Pign — Master Plan (Site Revamp, New Pages, Pricing & Copy)

**Status:** Approved for implementation. Synthesizes three model-authored workstreams.
**Last updated:** 2026-05-29

**Decisions confirmed (2026-05-29):**
1. **Free = 15 GB**, **Personal/Pro = 200 GB** (no backend storage-limit change for Free).
2. **Live Stripe checkout** for Personal & Teams (Enterprise + Developer/API = contact sales). Billing backend is in scope.
3. **Proceed through Phases 0–5** as background work.

This document ties together three detailed plans and resolves conflicts between them. Read the sub-plans for full detail:

| # | Workstream | Author model | File |
|---|---|---|---|
| 01 | Product objectives, positioning, sitewide copy, **canonical pricing** | Opus | [`docs/plan/01-product-and-pricing-strategy.md`](01-product-and-pricing-strategy.md) |
| 02 | Landing revamp: 1px dividers, Integrations 4/3/4, working + auto carousel | GPT (codex) | [`docs/plan/02-landing-revamp.md`](02-landing-revamp.md) |
| 03 | New pages: `/pricing` `/terms` `/privacy` `/help` `/about` + full copy | Gemini | [`docs/plan/03-new-pages.md`](03-new-pages.md) |

Existing source of truth for the *built* product: [`SPEC.md`](../../SPEC.md) (v1 implementation spec — registered document exchange, SHA‑256 content addressing, admin‑approved verified entities, `gpt-4o-mini` OCR, Resend email, 30‑day trash purge, **15 GB hard storage limit in v1, paid tiers in v2**).

---

## 1. Product objective summary (the "why")

Pign is a **registered document exchange wearing a mailbox UX**: every send is a *document transmittal* (cover letter + payload), traceable to a verified issuer and protected from forgery by global hash-based duplicate detection (`SPEC.md` §0). The site must sell four pillars (full detail in 01 §2):

- **Provable** — fingerprint-on-upload, lock-to-owner/company, duplicate flagging, batch folder verification.
- **Private** — encrypted in transit + at rest, revocable/one-time/timed secure links, permanent shred.
- **Organised** — AI OCR, auto-tag, dedupe, natural-language search.
- **Connected** — secure-link sharing, Pending invites (growth loop), `@pign` address, integrations + API.

Prioritised objectives O1–O11 and how each maps to a page/section/proof point are in 01 §1. Top of the list: make authenticity *provable* (the wedge vs. Dropbox/Drive/email), guarantee confidentiality, and establish a distinct brand (not "another cloud drive").

---

## 2. Sitewide copy changes (apply first — cheap, high impact)

Canonical voice: calm, precise, confident-not-boastful, active voice, **British English**, **sentence case**, no "friends/social", no unverifiable scale claims (01 §2.5). Drop-in copy for every section is in 01 §3. The highest-priority fixes:

1. **Hero H1** `Connect with files, connect with friends` → **`Store it. Verify it. Trust it.`** (eyebrow → `Your digital mailbox for important documents`).
2. **Features → "File verification" body is wrong** (it currently describes *junk filtering* — a `TODO(copy)` placeholder bug). Replace with the verification copy in 01 §3.4. Also finalise "Smart storage" and "Secure & encrypted".
3. **JoinCTA** `Join the millions of users and teams` (unsubstantiated) → `Your important documents deserve a better home`.
4. **Differentiate the "For organisations" benefits tab** (currently duplicates Individuals) — org bullets in 01 §3.3.
5. **Fix typos/casing**: "Share secure files with, colleagues…", "For Individuals" vs "For organisations" → sentence case.
6. **Benefits marquee** off-strategy ("Avoid junk emails") → `Proof of authenticity · Encrypted by default · Find anything in seconds · Share with one secure link`.
7. **Add 2 FAQs** (How does verification work?; Can I share with non-users? → surfaces the Pending loop) — 01 §3.6.

---

## 3. Landing page revamp (workstream 02)

### 3.1 Unified 1px dividers
- New `components/landing/SectionDivider.tsx` — a full-bleed 1px line (`border-t`, `w-screen left-1/2 -translate-x-1/2`) so it ignores the `max-w-[1440px]` container and runs edge-to-edge at all breakpoints.
- Insert in `app/page.tsx` between all six section boundaries (Hero/Benefits/Features/Integrations/FAQ/JoinCTA/Footer).
- Remove the ad-hoc divider in `Benefits.tsx` (line 136) and the boundary lines in `Integrations.tsx`; unify on the one component. Detail: 02 §"Workstream 1".

### 3.2 Integrations section (your explicit asks)
- **Full-width divider** across all breakpoints (handled by the global divider).
- **Left-align all copy + the logo**, and on desktop **stack** logo + heading + intro *above* the tool grid (not side-by-side).
- **4 / 3 / 4 grid of real, integrable tools + API** (11 cells): Slack · Google Drive · Dropbox · Box / OneDrive · SharePoint · Gmail (Workspace) / Outlook (M365) · Notion · Zapier · **REST API + Webhooks**. Per-tile copy, responsive reflow (4/3/4 → 2-col tablet → 1-col mobile), and the 11 missing logo assets are listed in 02 §"Workstream 2".
- Intro copy → `Connect Pign to the tools you already use` (01 §3.5).
- **Honesty note:** v1 only ships Google + Resend auth (`SPEC.md` §"OAuth scope"). Most integrations are roadmap — present them as "available and coming soon" or tag a few "Coming soon" rather than implying all are live.

### 3.3 Carousel — make it work + auto-advance
- The carousel lives in `components/landing/JoinCTA.tsx` (static image + **disabled** prev/next). Plan extracts a real `DashboardCarousel.tsx` client component + `dashboard-slides.ts`.
- Functional: looping prev/next, keyboard (←/→/Home/End), dot indicators, ARIA carousel roles.
- **Autoplay** every ~5s, **pause on hover/focus**, **respect `prefers-reduced-motion`**, restart after manual interaction.
- Slides matched to the two Figma frames you linked:
  - **`2737:545`** — inbox/list operational state (timeline groups Today/This week/This month, hover + selected/checkbox states).
  - **`2737:717`** — file-viewer/detail state (document canvas, file metadata, print-with/without-verification menu, page counter 4/10).
- Full component API, state model, a11y spec: 02 §"Workstream 3". (Recommend exporting 2–3 more frames later for richer storytelling.)

---

## 4. New marketing pages (workstream 03)

Introduce an **`app/(marketing)` route group** with a shared `layout.tsx` wrapping `MarketingHeader` + `MarketingFooter`, and convert the header/footer `ComingSoonStub` links to real `Link`s so nav resolves. Pages + full copy drafts in 03:

- **`/pricing`** — monthly/annual toggle (annual = "2 months free"), 5-plan layout, feature-comparison table, security trust callouts, pricing FAQ. Numbers come from §5 below.
- **`/terms`** — ToS tailored to a verification/exchange product: accounts & handle reclaim, acceptable use (no dummy attachments to bypass the document-first rule), the delivered-copy/immutable-provenance model, cryptographic-validity disclaimers (we prove *integrity + issuer origin*, not factual truth), 30‑day trash purge + permanent shred, payment terms, liability, termination.
- **`/privacy`** — data collected, encryption, verification metadata, the `@pign` address, sharing/recipients, retention/deletion (30‑day trash cron, pending routing), AI/OCR handling (`gpt-4o-mini`, no training on user docs), sub-processors (Convex, Resend, OpenAI, Sentry, + Stripe when billing ships), GDPR/CCPA rights.
- **`/help`** — getting-started + categorised FAQ (account & `@pign`, uploading & folders, verification & duplicates, sharing & pending, security, billing), `support@pign.storage`, tiered SLA.
- **`/about`** — mission, the forgery/compromise problem, story, values (Authenticity Above All · Complete Traceability · Privacy by Design · Frictionless Security), how it works, closing CTA.

---

## 5. Pricing package (canonical) + the one conflict to resolve

Canonical go-to-market tiers (01 §4 / §5.3):

| Tier | Monthly | Annual (/mo) | Storage | Verifications/mo | Seats |
|---|---|---|---|---|---|
| **Free** | $0 | $0 | **2 GB** ⚠️ | 10 | 1 |
| **Personal (Pro)** | $6 | $5 | **200 GB** ⚠️ | 500 | 1 |
| **Teams / Business** | $12/user | $10/user | 1 TB + 250 GB/user | Unlimited (fair use) | 3–200 |
| **Enterprise** | Custom | Custom | 5 TB+ | Unlimited + SLA | Unlimited |
| **Developer / API** | Usage-based | Committed discounts | $0.02/GB‑mo | $0.05 each (tiered to $0.02) | n/a |

API meters, packaged dev plans (Build free / Launch $49 / Scale $299 / Platform custom), the full feature matrix, and competitor benchmarks (Dropbox/Box/Google/Proton/DocuSign) are in 01 §4.

### ⚠️ Conflict: Free/Pro storage numbers
- **01 (Opus, marketing target):** Free **2 GB**, Pro **200 GB** — chosen to make storage the upsell lever.
- **`SPEC.md` (built v1):** a single **hard 15 GB** limit for everyone; **no paid tiers, no billing yet** (paid is v2). The Gemini page (03) followed `SPEC.md` and wrote Free 15 GB / Pro 100 GB.

**Recommended resolution:** Publish the 01 tier *structure*, but make the **Free storage figure a deliberate decision** and align all three docs to it. My recommendation: **keep Free at 15 GB** (it's already enforced, it beats Dropbox's 2 GB, and we still have strong upsell levers in verification volume, lock‑to‑company, version history, integrations and seats) and set **Pro at 200 GB**. This avoids a backend change and a worse free tier than what users already have. The alternative (2 GB Free) maximises storage-driven upgrades but requires a backend limit change + billing before the pricing page can be truthful.

Either way: until billing (Stripe) and v2 tiering ship, the `/pricing` page should mark paid tiers as **"Coming soon" / waitlist** rather than implying live checkout. This is the single open decision I need you to confirm (see §7).

---

## 6. Recommended build sequence (phased)

1. **Phase 0 — Copy pass (fast, no new infra).** Apply all 01 §3 rewrites to existing components (Hero, Benefits inc. org tab, Features verification fix, FAQ, JoinCTA). Highest ROI, lowest risk.
2. **Phase 1 — Dividers + Integrations.** Ship `SectionDivider`, wire all boundaries, restructure Integrations (left-aligned stacked header, 4/3/4 real tools + API). Source/approve the 11 logo assets.
3. **Phase 2 — Carousel.** Extract `DashboardCarousel`, build slides from Figma `2737:545` / `2737:717`, enable functional + autoplay + a11y + reduced-motion.
4. **Phase 3 — Marketing route group + static pages.** `app/(marketing)` + shared layout; ship `/about`, `/help`, `/terms`, `/privacy` (content-only, low dependency); activate header/footer links.
5. **Phase 4 — Pricing page.** Build `/pricing` with the confirmed tiers; mark paid tiers "Coming soon" until billing.
6. **Phase 5 (later/v2) — Billing + tier enforcement.** Stripe + plan limits in Convex; flip pricing to live checkout; add in-product paywall/upsell at 80%/100% storage.

Phases 0–4 are all front-end and can largely proceed in parallel once §7 is confirmed; Phase 5 is backend (out of scope for this site revamp).

---

## 7. Open decisions for you

1. **Free storage figure:** keep **15 GB** (recommended, no backend change) or move to **2 GB** (stronger upsell, needs backend + billing first)?
2. **Paid checkout now or "Coming soon":** confirm the pricing page should show paid tiers as waitlist/coming-soon until Stripe billing exists (recommended).
3. **Integrations honesty:** OK to tag not-yet-built integrations as "Coming soon" (recommended) vs. listing all as available?
4. **Legal review:** `/terms` and `/privacy` drafts (03) need a lawyer's review before publish — acknowledge as a gate.

Once you confirm §7 (especially #1), I can begin Phase 0 and proceed through the phases.
