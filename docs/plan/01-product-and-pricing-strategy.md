# Pign — Product & Pricing Strategy

**Document:** `docs/plan/01-product-and-pricing-strategy.md`
**Owner:** Product Management · Product Marketing · Sales/Monetization
**Status:** Canonical v1 plan — PLANNING ONLY (no code/component changes in this doc)
**Last updated:** 2026-05-29

> **Purpose.** This is the authoritative source of truth for *what Pign is*, *who it's for*, *how we say it*, and *what we charge*. Downstream workstreams — landing copy implementation, Pricing/About/Help pages, billing integration, and the in-app paywall — must conform to the positioning, voice, and **pricing tiers** defined here. If anything in product, marketing, or sales conflicts with another doc, this document wins until explicitly superseded.

---

## 0. Product context & grounding (what exists today)

Pign is a **digital mailbox for important documents** — a secure inbox and vault for letters and official documents, deliberately *not* casual email and *not* a generic file drive. Two audiences: **Individuals** and **Organisations**.

### 0.1 Decided product concepts (the spec we are marketing & pricing against)

- Every user signs up with an **external email** and is allocated a **`@pign` email address**.
- Documents can be **cryptographically verified** and **locked** to a company or individual — this proves authenticity, traces a document to its sender/owner, and **flags duplicate uploads**.
- **Folders** contain multiple documents; a folder's documents can be **verified in one action** (batch verification).
- **Secure-link sharing** — links can be one-time, time-limited, or revoked instantly.
- Emails sent *within Pign* **must include a document or folder** (Pign is document-first, not chat).
- Sending to a **non-Pign recipient** creates a **"Pending"** item until that person signs up — a built-in viral/referral loop.
- **Shred / permanently delete** for unrecoverable disposal.
- **AI sorting & search** (OCR, auto-tagging, dedupe, natural-language find).
- **Integrations** with business tools (Slack, Google Drive, Dropbox, Notion, Gmail, Microsoft Teams, Zapier, Linear, Asana).

### 0.2 Current landing inventory (as built, verbatim)

The marketing landing (`app/page.tsx`) renders, in order: **Hero → Benefits → Features → Integrations → FAQ → JoinCTA → Footer**. Stack: Next.js 16 (App Router), Tailwind v4, TypeScript, Convex (`@convex-dev/auth` Password), dark theme `#161616`, font Bricolage Grotesque.

Current copy captured for audit (quoted verbatim in §3):

- **Hero eyebrow:** "Your digital mailbox for saving important documents securely"
- **Hero H1:** "Connect with files, connect with friends"
- **Hero CTA:** "Start for free"
- **Header CTAs:** "Login", "Create storage"
- **Benefits marquee tags:** "Avoid junk emails", "Filter priority mails", "Smart AI verification"
- **Benefits tabs:** "For Individuals", "For organisations" (note casing inconsistency)
- **Features:** "Smart storage", "File verification", "Secure & encrypted" (two bodies are `TODO(copy)` placeholders)
- **Features heading:** "Everything you need, less of what you don't"
- **Integrations heading:** "Integrate Pign with your favourite tools to get the most out of it"
- **FAQ:** 5 Q&As (strong baseline copy already present)
- **JoinCTA:** "Join the millions of users and teams" + "Get started for free" / "Check out pricing"
- **Support email:** `support@pign.storage`

**Known issues already flagged for copy/marketing (not just layout):**
- `Features.tsx` ships **placeholder bodies** for *File verification* and *Secure & encrypted* (`TODO(copy)`), and the *File verification* body literally describes **junk filtering**, which is wrong for the feature. This is a P1 copy correctness bug.
- Benefits list has **grammar/typo issues** ("Share secure files with, colleagues, family and friends").
- Audience tab casing is inconsistent ("For Individuals" vs "For organisations").
- Hero H1 ("Connect with files, connect with friends") is **brand-evocative but off-strategy** — it implies a social product, undercutting the "important/official documents" core. Addressed in §3.
- "Join the millions of users and teams" is an **unsubstantiated claim** (we have not launched) — a trust/credibility risk. Addressed in §3.

---

## 1. Product objectives (prioritized) + how the site/product achieves each

Objectives are ranked by impact on activation, trust, and monetization. Each lists **the audience**, **why it matters**, and **concretely how Pign delivers it** (page / section / feature / proof point).

### P0 — Trust & authenticity (the reason Pign exists)

**O1. Make document authenticity provable, not assumed.**
- *Audience:* Both. Critical for Organisations.
- *Why:* This is the single differentiator vs. Dropbox/Drive/email. Forgery, tampering, and "is this the real document?" are unsolved in storage and email today.
- *How:* **Features → "File verification"** card (rewrite in §3.4) explains fingerprint-on-upload + lock-to-owner; **FAQ "Are my files safe?"** reinforces tamper-evidence; in-product the **verify badge** on a document and the **batch "Verify folder"** action are the proof points. Landing must show a verified-badge visual, not generic lock iconography.

**O2. Guarantee confidentiality (encryption + access control the user controls).**
- *Audience:* Both; table-stakes for Organisations handling classified/formal letters.
- *Why:* "Important documents" implies sensitive. Without encryption + revocable access, Pign is not credible.
- *How:* **Features → "Secure & encrypted"** card (rewrite in §3.4: encrypted at rest + in transit, locked to account, revocable links); **FAQ "Are my files safe?"**; in-product **secure-link controls** (one-time / time-limited / revoke). Proof point: shred/permanent-delete and link-revocation are visible, user-initiated actions.

**O3. Establish a credible, distinct brand identity vs. "another cloud drive."**
- *Audience:* Both.
- *Why:* Storage is commoditized; "mailbox for important documents" is our wedge. Off-strategy hero copy dilutes this.
- *How:* **Hero** positioning line + H1 rewrite (§3.2); consistent **mailbox/letter** visual language already present (`mailbox-illustration.svg`, paper-plane); **About page** (voice set here) tells the "documents that matter" story.

### P1 — Activation & onboarding

**O4. Get a new user to first value (upload + verify + find) in under 3 minutes.**
- *Audience:* Individuals primarily.
- *Why:* Activation drives retention and conversion to paid.
- *How:* **Hero CTA "Start for free"**; **FAQ "What do I need to start?" / "How fast is onboarding?"** (already strong — keep, tighten in §3.5); in-product **AI OCR/auto-tag** sorts a back-stack while the user keeps working. Proof point: "set up in under three minutes."

**O5. Reduce the "where is my document?" pain with AI sorting & search.**
- *Audience:* Both.
- *Why:* The everyday hook that earns daily/weekly active use between high-stakes moments.
- *How:* **Benefits** list item ("AI capabilities allows you to sort and find files quickly" → rewrite §3.3); **Features → "Smart storage"** card; marquee tag "Smart AI verification" reframed (§3.3). In-product: natural-language search + auto-tagging + dedupe.

**O6. Make sharing safe and effortless (secure links + Pending invites).**
- *Audience:* Both.
- *Why:* Sharing is the core collaborative action *and* the growth loop.
- *How:* **Benefits** items (secure links, access anywhere); **Features/Secure** card (revocable links); in-product **secure-link** + **Pending item** flow when recipient isn't on Pign yet. Proof point: the Pending flow is also our acquisition engine (see O10).

### P2 — Organisation readiness & monetization

**O7. Position Pign as a system of record for inbound documents (org source of truth).**
- *Audience:* Organisations.
- *Why:* Anchors the higher-priced Teams/Business and Enterprise tiers.
- *How:* **Benefits "For organisations"** tab (rewrite §3.3 with org-specific bullets — currently identical to Individuals, a known gap "L-009"); **Integrations** section (route letters to Slack/Teams channels, tie docs to Linear/Asana); **Pricing page** Teams/Enterprise columns; **FAQ** org line ("central source of truth").

**O8. Enable formal/official document workflows (lock-to-company, traceability, audit).**
- *Audience:* Organisations.
- *Why:* Justifies verification limits and Enterprise compliance pricing.
- *How:* **File verification** feature (lock-to-company, sender traceability); **Enterprise** features (audit log, retention/legal hold, SSO) on the Pricing page; **integrations** that attach decision letters/approvals to work items.

**O9. Convert free → paid via clear, fair limits (storage is the primary V2 lever).**
- *Audience:* Both.
- *Why:* Revenue. Storage is the most legible, least resented upsell.
- *How:* **Pricing page** (full matrix §4); in-product **paywall/upsell** prompts at storage and verification thresholds; **JoinCTA "Check out pricing"** link (currently a `ComingSoonStub` — must point to the new `/pricing`). Annual discount (§4) drives prepaid commitment.

**O10. Build a self-reinforcing growth loop (Pending invites + secure links).**
- *Audience:* Both.
- *Why:* Lowers CAC; every shared document is a branded invitation.
- *How:* In-product **Pending item → recipient signs up** flow; landing reflects this with referral-friendly copy ("share with anyone — they don't need Pign yet"). The footer/JoinCTA must replace the unsubstantiated "millions of users" with credible, loop-aware copy (§3.6).

### P3 — Platform & developer ecosystem

**O11. Make verification & storage available as an API (developer/platform play).**
- *Audience:* Organisations / developers.
- *Why:* Usage-based API revenue + ecosystem lock-in; lets other apps embed Pign verification.
- *How:* **Developer/API plan** (§4.5) with metered verifications, storage, API calls, webhooks; future **Developers** page + docs. Landing **Integrations** intro foreshadows extensibility (§3.4).

---

## 2. Positioning & messaging framework

### 2.1 One-line positioning

> **Pign is the secure digital mailbox for the documents that matter — store, verify, and share official letters and records you can prove are real.**

Short forms:
- **Tagline (≤6 words):** *Your mailbox for important documents.*
- **Boilerplate (1 sentence):** *Pign is a secure digital mailbox where individuals and organisations store, cryptographically verify, and share their most important documents.*

### 2.2 Value pillars (4)

| Pillar | Promise | Backed by |
|---|---|---|
| **Provable** | Every document is fingerprinted and locked to its owner, so authenticity is verifiable and tampering is visible. | File verification, lock-to-company/individual, duplicate detection, batch folder verification |
| **Private** | Encrypted at rest and in transit; you decide who sees what, and you can revoke or shred instantly. | Encryption, secure links (one-time/time-limited/revocable), shred/permanent delete |
| **Organised** | AI sorts, tags, deduplicates, and finds — so the right document is one search away. | OCR, auto-tagging, natural-language search, folders |
| **Connected** | Share with anyone via a signed link, route documents into the tools you already use, and reach people who aren't on Pign yet. | Secure-link sharing, Pending invites, integrations, `@pign` address |

### 2.3 Differentiators vs. ordinary cloud storage / email

| Capability | Ordinary cloud drive (Dropbox/Drive/Box) | Email (Gmail/Outlook) | **Pign** |
|---|---|---|---|
| Proves a document is authentic/untampered | No | No | **Yes — fingerprint + verify badge** |
| Locks a document to a company/person | No | No | **Yes** |
| Flags duplicate uploads | No | No | **Yes** |
| Verify a whole folder at once | No | No | **Yes** |
| Document-first messaging (every send carries a doc/folder) | No (chat/email is free-form) | No | **Yes** |
| Reach non-users via Pending invites | Link only | No identity loop | **Yes — Pending → sign-up** |
| Revocable, one-time, time-limited links | Partial | No | **Yes** |
| Permanent shred | Trash only | No | **Yes** |
| Purpose | Generic files | Conversations | **Important/official documents** |

**The wedge sentence we repeat everywhere:** *Storage keeps your files. Email moves your messages. Pign protects the documents you can't afford to get wrong.*

### 2.4 Target personas

**Individuals**
1. **"The Life-Admin Organiser" (primary individual).** 25–45, juggling visas, mortgages, tax, medical, school records. Pain: scrambling to assemble documents for applications; fear of losing originals. Wins with: AI sorting, fast search, secure sharing, proof of authenticity.
2. **"The Applicant."** Submitting documents to a bank, embassy, university, or landlord. Pain: "is this the latest/real version?" and resending the same files. Wins with: verified docs, secure links, Pending sharing.

**Organisations**
3. **"The Operations/Compliance Lead" (primary org buyer).** SMB to mid-market. Receives formal letters, contracts, certificates from customers/partners. Pain: scattered inboxes, no audit trail, forgery risk. Wins with: org source of truth, lock-to-company, audit log, integrations, retention.
4. **"The Developer/Platform Integrator."** Wants to embed verification/storage in their own product. Wins with: API plan, webhooks, metered usage.

### 2.5 Tone of voice (canonical — About/Help/Pricing must follow)

- **Calm, precise, trustworthy.** We handle people's most important documents; we never sound flippant about security.
- **Plain over clever.** Short sentences. Concrete nouns ("letters, contracts, certificates"), not vague ("stuff", "things").
- **Confident, not boastful.** No unverifiable claims ("millions of users") pre-scale. Lead with capability and proof.
- **Active voice, second person.** "You decide who sees what." Not "Access can be configured by the user."
- **British English** spelling (organise, favourite, colour) — consistent with existing copy and `pign.storage`.
- **Sentence case** for UI labels and headings (fix "For organisations" vs "For Individuals" → both sentence case, but treat audience proper nouns consistently: "For individuals" / "For organisations").
- **Words we use:** mailbox, document, letter, verify, locked, secure link, shred, source of truth.
- **Words we avoid:** "files" as the hero noun (too generic), "social", "friends" in product-critical copy, hype superlatives, jargon ("synergy", "leverage").
- **Reading level:** aim Grade 7–8 for marketing, Grade 6 for in-product microcopy.

---

## 3. Sitewide copy strategy & rewrites

> **Method:** For each section we (a) **quote the current copy**, (b) note the problem, (c) give **final, drop-in copy**. The voice set here is canonical for About/Help/Pricing.

### 3.1 Global fixes (apply everywhere)

- Replace social-leaning language ("connect with friends") with document-trust language.
- Remove unverifiable scale claims until we can substantiate them.
- Fix typos/grammar and casing inconsistencies.
- Standardise on British English and sentence case for headings.
- Ensure the *File verification* and *Secure & encrypted* feature bodies describe the **right** features (current File verification body wrongly describes junk filtering).

### 3.2 Hero

**Current (verbatim):**
- Eyebrow: *"Your digital mailbox for saving important documents securely"*
- H1: *"Connect with files, connect with friends"*
- CTA: *"Start for free"*

**Problem:** H1 implies a social/file-sharing app and buries the "important documents + verify" core. Eyebrow is solid but wordy.

**Final copy (drop-in):**
- **Eyebrow:** `Your digital mailbox for important documents`
- **H1:** `Store it. Verify it. Trust it.`
  *(Alt H1 options, ranked: (2) `The mailbox for documents that matter`; (3) `Keep your important documents safe — and provably real`.)*
- **Sub-headline (new, optional below H1):** `Pign keeps your official letters, contracts and records encrypted, organised, and verifiable — and lets you share them with a single secure link.`
- **Primary CTA:** `Start for free` *(keep)*
- **Secondary CTA (new):** `See how verification works` → `/about#verification`

### 3.3 Benefits (marquee + audience tabs)

**Current marquee tags (verbatim):** "Avoid junk emails", "Filter priority mails", "Smart AI verification"

**Problem:** "Avoid junk emails" / "Filter priority mails" frame Pign as an email client; off-strategy.

**Final marquee tags:** `Proof of authenticity` · `Encrypted by default` · `Find anything in seconds` · `Share with one secure link`

**Current Individuals bullets (verbatim, with issues):**
- "Share secure files with, colleagues, family and friends" *(typo)*
- "Access your files anywhere anytime through a simple link"
- "Shred and delete files you don't need forever"
- "AI capabilities allows you to sort and find files quickly" *(grammar)*
- "Prevent file forgery through verification"
- "Integrate with your business to send formal letters and classified documents"
- "Provide all required documentation for applications in simple steps"

**Final — For individuals (drop-in):**
- `Share documents securely with family, friends and colleagues`
- `Open your documents anywhere, anytime, from a single secure link`
- `Shred documents you no longer need — permanently`
- `Let AI sort, tag and find any document in seconds`
- `Prove a document is genuine and prevent forgery with verification`
- `Keep every important letter, ID and certificate in one private mailbox`
- `Assemble everything an application needs in a few clicks`

**Final — For organisations (drop-in; fixes the duplicate-tab gap):**
- `Make your mailbox the single source of truth for inbound documents`
- `Verify and lock documents to your company to prove authenticity`
- `Send formal letters and classified documents with full traceability`
- `Route incoming documents into Slack, Teams and your project tools`
- `Control access with revocable, time-limited secure links`
- `Detect duplicate and tampered uploads automatically`
- `Retain, audit and dispose of documents to meet your policies`

**Tab labels (fix casing):** `For individuals` / `For organisations`

### 3.4 Features (Smart storage / File verification / Secure & encrypted)

**Current (verbatim):**
- *Smart storage:* "Smart file management system for saving important files, efficient organization and easy access to items, saving time and reducing clutter."
- *File verification:* "Junk filtering for the efficient and effective removal of unwanted or spam messages from your inbox." — **WRONG FEATURE (placeholder).**
- *Secure & encrypted:* "Every file is encrypted and locked to your account, so only the people you choose can ever open what you store and share."

**Final copy (drop-in):**

- **Smart storage**
  `Drop in documents and let Pign do the filing. AI reads, tags and organises everything — and finds any letter, contract or certificate the moment you search for it.`

- **File verification** *(replaces the incorrect placeholder)*
  `Every document is fingerprinted on upload and locked to its owner, so you can prove it's genuine and untampered. Pign flags duplicates automatically, and you can verify an entire folder in one click.`

- **Secure & encrypted**
  `Your documents are encrypted in transit and at rest, and locked to your account. You decide exactly who can open them — with links you can make one-time, time-limited, or revoke instantly.`

### 3.5 Integrations intro

**Current (verbatim):** "Integrate Pign with your favourite tools to get the most out of it"

**Final copy (drop-in):**
- **Heading:** `Connect Pign to the tools you already use`
- **Sub (new):** `Route incoming letters to the right channel, attach verified documents to your work, and automate it all — with native integrations and an open API.`

### 3.6 FAQ (keep strong baseline; tighten + add 1)

**Current Q&As are good.** Keep "What is Pign?", "What do I need to start?", "How fast is onboarding?", "Are my files safe?", "What are the benefits?" — minor edits below; add a verification-specific question (our #1 differentiator).

**Final FAQ set (drop-in):**

1. **What is Pign?**
   `Pign is a digital mailbox built for the documents that actually matter — official letters, ID, contracts and certificates. It keeps them organised, verified against tampering, and shareable with anyone you trust via a single secure link.`

2. **How does document verification work?** *(new)*
   `When you upload a document, Pign creates a unique fingerprint and locks it to its owner. Anyone you share it with can confirm it's the genuine, unaltered original — and Pign automatically flags duplicate or tampered copies. You can verify a whole folder at once.`

3. **What do I need to start using Pign?**
   `Just an email address. Sign up, drag in a few documents (or forward them to your Pign address), and Pign will tag, deduplicate and index them so you can find anything in seconds.`

4. **Are my documents safe?**
   `Every document is encrypted in transit and at rest, and fingerprinted on upload so any tamper attempt is visible. You decide who sees what — links can be one-time, time-limited, or revoked instantly — and shredding removes a document permanently.`

5. **Can I share with someone who isn't on Pign?**  *(new — surfaces the Pending loop)*
   `Yes. Share a secure link, or send the document to their email — it waits as a Pending item until they create their free mailbox, then lands securely in their inbox.`

6. **What do I get as an organisation?**
   `A central source of truth for every document your customers and partners send you — verified, access-controlled, searchable, and routed into the tools your team already uses, with retention and audit controls for compliance.`

**Contact line (keep):** `Have a question that isn't answered? Contact us at support@pign.storage`

### 3.7 JoinCTA

**Current (verbatim):** Heading "Join the millions of users and teams"; CTAs "Get started for free" / "Check out pricing".

**Problem:** "millions of users" is unverifiable pre-launch (credibility risk).

**Final copy (drop-in):**
- **Heading:** `Your important documents deserve a better home`
  *(Alt once we have real traction: `Join the people and teams who trust Pign with what matters`.)*
- **Primary CTA:** `Get started for free` *(keep; → `/signup`)*
- **Secondary CTA:** `See pricing` *(→ `/pricing`, replacing the current `ComingSoonStub`)*

### 3.8 Footer

**Current links:** Pricing · Terms of use · Privacy · Help & support (all stubbed). Header nav: About · Pricing.

**Final:** Activate `Pricing` → `/pricing`, `Help & support` → `/help`, `About` → `/about`, keep `Terms of use` / `Privacy` → legal pages. Footer tagline (optional, new): `Pign — your mailbox for important documents.`

### 3.9 Header CTAs

"Create storage" is unusual phrasing. **Recommendation:** keep `Login`, change primary header CTA to `Start for free` for consistency with Hero (or `Create your mailbox` if a distinct verb is desired). Note: minor, defer to brand preference.

---

## 4. Pricing & packaging (Free → Personal → Teams/Business → Enterprise → API)

### 4.0 Strategy & principles

1. **Storage is the primary upsell lever** (most legible, least resented). Verification volume is the secondary org lever.
2. **Free must deliver real value** (vault + verify + share) so the growth loop (Pending invites) works — but cap storage, verification volume, and retention to create natural upgrade pressure.
3. **Annual discount = ~2 months free (~17%)**, standard for the category and rewards prepaid commitment.
4. **Per-seat for Teams**, flat for Individuals, **usage-metered for API**.
5. **Currency:** prices in **USD**; show GBP/EUR at parity-ish on the pricing page (product is `.storage`, British English; Proton/Google price near-parity across currencies, so we follow suit).
6. **Benchmarks** (see §4.7) justify positioning: priced **below** DocuSign (we're not a per-envelope eSignature tool) and **at/below** Proton/Dropbox for storage, with verification as the value-add others lack.

### 4.1 Tier summary (at a glance)

| | **Free** | **Personal (Pro)** | **Teams / Business** | **Enterprise** | **Developer / API** |
|---|---|---|---|---|---|
| **Price (monthly)** | $0 | **$6 /mo** | **$12 /user/mo** | **Custom** | **Usage-based** (see §4.5) |
| **Price (annual)** | $0 | **$5 /mo** ($60/yr) | **$10 /user/mo** ($120/user/yr) | Custom (annual contract) | Committed-use discounts |
| **Target user** | Individuals trying Pign; light personal use | Individuals with real document loads (life-admin, applicants) | SMB/mid-market ops & compliance teams | Regulated / large orgs | Developers embedding verification & storage |
| **Storage** | **2 GB** | **200 GB** | **1 TB pooled + 250 GB/user** | **Custom (5 TB+ pooled)** | Metered (per GB-month) |
| **Verifications / mo** | **10** | **500** | **Unlimited (fair use)** | Unlimited + SLA | Metered (per verification) |
| **Seats / members** | 1 | 1 | **3 min, up to 200** | Unlimited | API keys (n/a seats) |
| **Retention (deleted/version)** | 7 days | 30 days + version history | 90 days + version history | Custom + legal hold | Per-config |
| **Active secure links** | 3 at a time | Unlimited | Unlimited + org link policies | Unlimited + DLP | Via API |
| **Support** | Community / docs | Email (48 h) | Priority email (24 h) | Dedicated CSM + SLA | Email + status page; SLA on committed |

### 4.2 Free — "Mailbox"

- **Price:** $0 forever, no card.
- **Who:** Anyone trying Pign; recipients arriving via a Pending invite.
- **Limits:** 2 GB storage · 10 verifications/mo · 1 seat · 3 active secure links · 7-day deleted-item recovery · standard `@pign` address.
- **Includes:** AI sort/search, folders, shred, Pending invites/sharing, mobile + web.
- **Excludes:** Batch folder verification beyond fair limit, version history, integrations beyond 1, priority support.
- **Upgrade triggers (paywall copy hooks):** hitting 2 GB; needing the 11th verification; wanting a 4th live link; wanting >7-day recovery.

### 4.3 Personal (Pro) — "$6/mo, $5/mo annual"

- **Who:** Individuals with serious document needs (visas, mortgages, medical, tax).
- **Limits/Includes:** **200 GB** · **500 verifications/mo** · 1 seat · unlimited active secure links · 30-day recovery + **version history** · **batch folder verification** · up to **3 personal integrations** (Gmail, Drive, Dropbox) · email support (48 h).
- **Storage add-on (V2 upsell):** +500 GB for **$3/mo**; +2 TB for **$8/mo** (mirrors Proton-style storage steps).
- **Rationale:** Undercuts Proton Unlimited ($9.99) and sits below DocuSign Personal ($10) while bundling verification + storage + AI search that those don't combine.

### 4.4 Teams / Business — "$12/user/mo, $10/user/mo annual"

- **Who:** SMB/mid-market ops, legal-ops, compliance, customer-document teams.
- **Limits/Includes:** **1 TB pooled + 250 GB/user** · **unlimited verifications (fair use)** · **3 seats minimum, up to 200** · unlimited links + **org link policies** (force expiry, domain allowlists) · 90-day recovery + version history · **all integrations** (Slack, Teams, Notion, Linear, Asana, Zapier) · **lock-to-company** verification · **shared folders & roles** · **basic audit log** · priority email (24 h).
- **Storage add-on:** +1 TB pooled for **$15/mo**.
- **Rationale:** Sits between Google Workspace Business Standard ($12–14.40) and below Dropbox Business ($15–22) / DocuSign Business Pro ($40), while being the only one that bundles verification + lock-to-company. Per-seat aligns with buyer expectations.

### 4.5 Enterprise — "Custom"

- **Who:** Regulated industries, large orgs, anyone needing compliance/security guarantees.
- **Includes (on top of Teams):** **SSO/SAML & SCIM**, **5 TB+ pooled** (custom), **legal hold & custom retention**, **DLP / advanced access policies**, **full audit & export**, **lock-to-company at scale + traceability reports**, **dedicated CSM**, **99.9% uptime SLA**, custom DPA/BAA, **API included with committed volume**, onboarding & migration support.
- **Pricing motion:** annual contract, sales-led, custom quote (anchor: per-seat premium over Teams + platform fee). Benchmarks: Google/Dropbox/Box/DocuSign Enterprise are all "Custom" — we match the motion.

### 4.6 Developer / API plan — usage-based metering

**Model:** pay-as-you-go with **committed-use discounts**; first calls free to drive adoption. Four metered dimensions:

| Meter | Free allowance (/mo) | Pay-as-you-go rate | Notes |
|---|---|---|---|
| **Verifications** (fingerprint + verify/lock) | 100 | **$0.05 each** (vol. tiers below) | Core differentiator; cheaper than DocuSign ID-verify (~$2.50) because it's a fingerprint, not KYC |
| **Storage** | 5 GB-month | **$0.02 / GB-month** | Standard object-storage economics |
| **API calls** (reads/writes) | 10,000 | **$0.50 / 10k calls** | Bundled with SDK |
| **Webhooks** (delivered events) | 10,000 | **$0.20 / 10k events** | Retry/al delivery included |

**Verification volume tiers (price/verification):**

| Monthly verifications | Price each |
|---|---|
| 0–100 | Free |
| 101–10,000 | $0.05 |
| 10,001–100,000 | $0.03 |
| 100,001–1,000,000 | $0.02 |
| 1,000,000+ | Custom / committed |

**Example developer tiers (packaged for predictability):**

| Plan | Monthly platform fee | Included | Overage |
|---|---|---|---|
| **Build (Free)** | $0 | 100 verifications, 5 GB, 10k calls, 10k webhooks | Hard cap (sandbox) |
| **Launch** | **$49/mo** | 2,000 verifications, 100 GB, 250k calls, 250k webhooks | At PAYG rates above |
| **Scale** | **$299/mo** | 20,000 verifications, 1 TB, 2M calls, 2M webhooks | Discounted vol. tiers |
| **Platform** | Custom | Committed volume, SLA, dedicated support | Committed pricing |

### 4.7 Full feature matrix

| Feature | Free | Personal | Teams | Enterprise |
|---|---|---|---|---|
| `@pign` email address | ✓ | ✓ | ✓ (custom domain opt.) | ✓ (custom domain) |
| Storage | 2 GB | 200 GB | 1 TB + 250 GB/user | 5 TB+ custom |
| Verifications / mo | 10 | 500 | Unlimited (fair use) | Unlimited + SLA |
| Lock document to owner | ✓ | ✓ | ✓ | ✓ |
| Lock document to **company** | — | — | ✓ | ✓ |
| Duplicate detection | ✓ | ✓ | ✓ | ✓ |
| Batch (folder) verification | Limited | ✓ | ✓ | ✓ |
| AI sort / tag / search | ✓ | ✓ | ✓ | ✓ |
| Encryption (transit + rest) | ✓ | ✓ | ✓ | ✓ + custom keys |
| Secure links (one-time/timed/revoke) | 3 active | Unlimited | Unlimited + policies | Unlimited + DLP |
| Pending invites / sharing | ✓ | ✓ | ✓ | ✓ |
| Shred / permanent delete | ✓ | ✓ | ✓ | ✓ |
| Version history | — | ✓ | ✓ | ✓ |
| Deleted-item recovery | 7 days | 30 days | 90 days | Custom + legal hold |
| Integrations | 1 | 3 | All | All + custom |
| Shared folders & roles | — | — | ✓ | ✓ + advanced RBAC |
| Audit log | — | — | Basic | Full + export |
| Retention / legal hold | — | — | — | ✓ |
| SSO / SAML / SCIM | — | — | — | ✓ |
| DLP / advanced policies | — | — | — | ✓ |
| API access | — | — | Add-on | Included (committed) |
| Support | Community | Email 48 h | Priority 24 h | CSM + SLA |
| Uptime SLA | — | — | — | 99.9% |

### 4.8 Annual discount & upsell logic

- **Annual = ~2 months free (~17% off)** across Personal/Teams (Personal $6→$5; Teams $12→$10). Communicate as "2 months free."
- **Storage upsell (V2 lever):** in-product prompts at **80% and 100%** of storage; one-click add-on packs (§4.3/§4.4). This is the primary expansion-revenue path.
- **Verification upsell:** Free→Personal triggered at the verification cap; Personal→Teams when a user needs lock-to-company or unlimited verifications.
- **Seat expansion:** Teams grows by adding seats; natural land-and-expand.
- **API expansion:** Free→Launch→Scale as volume grows; committed-use locks in revenue.

### 4.9 Competitive benchmark (justification)

| Competitor | Free | Entry paid | Business/Team | Enterprise | Note vs. Pign |
|---|---|---|---|---|---|
| **Dropbox** | 2 GB | ~$8–12/mo (2 TB Plus) | $15–22/user/mo | Custom | Storage/sync only; **no verification** |
| **Box** | 10 GB | ~$10/user (Personal Pro) | $15–25/user/mo | Custom | ECM; compliance-heavy, **no doc fingerprint-verify for end users** |
| **Google Workspace** | 15 GB (consumer) | $7.20/user (Starter, 30 GB) | $14.40/user (Standard, 2 TB) | Custom | Full suite; storage pooled; **no authenticity proof** |
| **Proton Drive** | 5 GB | $3.99/mo (200 GB Plus) | $7.99/user (Professional, 1 TB) | Custom | Privacy/E2EE; **no verification or doc-mailbox model** |
| **DocuSign** | None (trial) | $10/mo Personal (5 docs) | $25–40/user/mo | Custom | eSignature; **ID verify ~$2.50/attempt** — far pricier per-action |

**Why our numbers hold:**
- **Personal $5–6** undercuts Proton Unlimited ($9.99) and DocuSign Personal ($10), and matches the value of Proton Plus/Dropbox while adding verification + AI search.
- **Teams $10–12/user** sits below Dropbox Business ($15–22) and DocuSign Business Pro ($40), aligned with Google Standard ($14.40) — but is the only option bundling **verification + lock-to-company**.
- **API verification at $0.05** is ~50× cheaper than DocuSign ID verification (~$2.50) because Pign verifies **document integrity (fingerprint)**, not full identity/KYC — a different, higher-volume primitive.
- **Free at 2 GB** matches Dropbox's free tier and is intentionally tight to power the upgrade + Pending-invite loop, while still letting verification and sharing work.

---

## 5. Decisions summary (for dependent workstreams)

### 5.1 Positioning
- **One-liner:** *Pign is the secure digital mailbox for the documents that matter — store, verify, and share official letters and records you can prove are real.*
- **Pillars:** Provable · Private · Organised · Connected.
- **Voice:** calm, precise, plain, confident-not-boastful, active voice, **British English**, sentence case. No "friends/social", no unverifiable scale claims.

### 5.2 Copy (highest-priority drop-ins)
- **Hero H1:** `Store it. Verify it. Trust it.` (eyebrow: `Your digital mailbox for important documents`).
- **Fix the wrong *File verification* body** (currently describes junk filtering) → use §3.4 copy.
- **Replace "Join the millions of users and teams"** → `Your important documents deserve a better home`.
- Differentiate the **For organisations** benefits tab (§3.3).
- Activate `/pricing`, `/about`, `/help` from header/footer/JoinCTA.

### 5.3 Final pricing tiers (canonical — other workstreams depend on these)

| Tier | Monthly | Annual (per mo) | Storage | Verifications/mo | Seats |
|---|---|---|---|---|---|
| **Free** | $0 | $0 | 2 GB | 10 | 1 |
| **Personal (Pro)** | **$6** | **$5** ($60/yr) | 200 GB | 500 | 1 |
| **Teams / Business** | **$12/user** | **$10/user** ($120/user/yr) | 1 TB + 250 GB/user | Unlimited (fair use) | 3–200 |
| **Enterprise** | Custom | Custom | 5 TB+ custom | Unlimited + SLA | Unlimited |
| **Developer/API** | Usage-based | Committed discounts | $0.02/GB-mo | $0.05 each (tiered) | n/a |

- **Annual discount:** ~17% ("2 months free").
- **API meters:** verifications $0.05 (tiered to $0.02), storage $0.02/GB-mo, API calls $0.50/10k, webhooks $0.20/10k. Packaged plans: Build (free) / Launch $49 / Scale $299 / Platform (custom).
- **Primary upsell lever:** storage (in-product at 80%/100%); secondary: verification volume & lock-to-company; tertiary: seats.

### 5.4 File written
- **Path:** `docs/plan/01-product-and-pricing-strategy.md`
