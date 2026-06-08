# Pign Marketing Pages — Comprehensive Plan & Copy Drafts
**Document Status:** PROPOSAL / READY FOR REVIEW  
**Date:** May 29, 2026  
**Author:** Product Design & Technical Writing Specialist  
**Target Path:** `docs/plan/03-new-pages.md`

---

## 1. Executive Summary

This document provides a comprehensive, production-ready implementation plan and high-fidelity copy drafts for five key marketing and legal pages for **Pign**:
1. **Pricing (`/pricing`)** — Flexible 5-tier presentation aligning with Pign's product strategy.
2. **Terms of Use (`/terms`)** — A complete legal framework tailored to document verification and @pign email handles.
3. **Privacy Policy (`/privacy`)** — High-security policy covering metadata, OCR, encryption, and GDPR/CCPA.
4. **Help & Support (`/help`)** — Support hub with exhaustive FAQs and contact SLAs.
5. **About (`/about`)** — Benefit-led, trust-focused brand story and product mission.

All copy is written in Pign's brand voice: **confident, authoritative, mathematically rigorous, and benefit-led**. 

---

## 2. Architecture & Technical Strategy

### 2.1 Next.js Route Setup & Grouping
To share the common header, footer, dark-theme styling (`#161616` background), and typography seamlessly across all secondary pages without duplicate code or affecting the existing dashboard and auth structures, we propose introducing an **`app/(marketing)` route group**.

This group will use a shared layout file, keeping files highly organized and making use of Tailwind v4 styling and the `Bricolage Grotesque` font.

```
app/
├── (auth)/
├── (dashboard)/
└── (marketing)/                  <── NEW: Marketing Route Group
    ├── layout.tsx                <── Shared Header/Footer & Layout
    ├── pricing/
    │   └── page.tsx              <── /pricing
    ├── terms/
    │   └── page.tsx              <── /terms
    ├── privacy/
    │   └── page.tsx              <── /privacy
    ├── help/
    │   └── page.tsx              <── /help
    └── about/
        └── page.tsx              <── /about
```

### 2.2 Global Layout Implementation (`app/(marketing)/layout.tsx`)
This Server Component will wrap all marketing pages, ensuring they share the same dark backdrop (`bg-surface-ink`), text colors, and the correct typography.

```tsx
// Proposed: app/(marketing)/layout.tsx
import { MarketingHeader } from "@/components/landing/MarketingHeader";
import { MarketingFooter } from "@/components/landing/MarketingFooter";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-ink text-white font-sans antialiased">
      <MarketingHeader />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
```

### 2.3 Resolving Nav Links (Marketing Chrome Adjustments)
The existing `MarketingHeader` and `MarketingFooter` components use `ComingSoonStub` to disable links. When implementing these pages, we will replace those stubs with standard Next.js `Link` components.

#### 1. Header Modification (`components/landing/MarketingHeader.tsx`):
- Change `About` stub to `<Link href="/about">About</Link>`.
- Change `Pricing` stub to `<Link href="/pricing">Pricing</Link>`.

#### 2. Footer Modification (`components/landing/MarketingFooter.tsx`):
- Refactor the hardcoded strings array to hold objects with `label` and `href` properties:
  ```typescript
  const links = [
    { label: "Pricing", href: "/pricing" },
    { label: "Terms of use", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Help & support", href: "/help" },
  ];
  ```
- Map directly over `links` and replace the `ComingSoonStub` with:
  ```tsx
  <Link
    key={link.label}
    href={link.href}
    className="text-[20px] font-medium leading-none text-white hover:text-white/80 transition-colors"
  >
    {link.label}
  </Link>
  ```

### 2.4 Layout & Design System Standards
- **Font**: Bricolage Grotesque (pre-configured via `--font-sans` variable in `app/globals.css`).
- **Color Scheme**: Dark theme. Strict adherence to `--surface-ink` (`#161616`) for the main backdrop and `--surface-ink-soft` (`#303030`) for cards, tables, and borders.
- **Section Structural Boundaries**: Always wrap content in the pre-existing `SectionShell` component.
  ```tsx
  import { SectionShell } from "@/components/landing/SectionShell";
  // Desktop lines use gutter="64" or gutter="56"
  ```
- **Responsive Guidelines**:
  - **Desktop (≥1440px)**: Clear multi-column configurations, spacious gutters (`px-[64px]`), and max-width bounds.
  - **Tablet (1024px–1439px)**: Fluid layouts, side-by-side grids reflow cleanly, padding adjusts to `px-[40px]`.
  - **Mobile (<1024px)**: Sections collapse into a single-column stack, tables become swipeable horizontally or cards, menus and toggles are optimized for thumb targets.

---

## 3. Page Plan & Copy: /pricing

### 3.1 Design & Responsive Layout Notes
- **Hero**: A high-impact centered title using Bricolage Grotesque, a sub-header that highlights the value of cryptographic security, and a custom sliding Billing Toggle (Monthly / Annual). Annual billing shows a "Save 20%" badge in green (`text-verify-green`).
- **Pricing Cards**: A grid of cards using `--surface-ink-soft` as a card background, with subtle borders. Under mobile viewports, the grid collapses into a single-column scrollable stack.
  - *Pro Tier Highlight*: The Personal (Pro) card uses a glowing white border or a subtle highlight to indicate it's the popular choice for power users.
  - *Teams/Business Highlight*: Promotes company verification badge status.
- **Feature Matrix**: A detailed comparison table. On desktop, a beautiful side-by-side matrix with checkmarks (`✓`) or dashes. On mobile, the matrix transforms into collapsible accordion sections grouped by capability (Storage, Security, AI, API).
- **FAQ Section**: Accordion layout reusing the logic of the homepage FAQ.

---

### 3.2 Full Copy Draft: /pricing

#### Hero Header
* **Eyebrow (41px, Light, leading-none)**: Uncompromising Security
* **Display Headline (128px, ExtraBold, leading-[0.875], tracking-tight)**: Plans that fit your trust scale.
* **Body Subtitle (24px, Light, text-white/70)**: Choose a secure storage level. Every account starts with our canonical cryptographic verification engine, private folder routing, and dedicated digital mailbox.
* **Annual Billing Toggle**: Billed Monthly `/` Billed Annually *(Save 20% + priority AI parsing)*

---

#### Pricing Tiers Grid

##### 1. Free
* *Description*: The baseline security setup for personal, content-addressable document archives.
* *Monthly Pricing*: **$0** / month
* *Annual Pricing*: **$0** / month (Always free)
* *Button Copy*: [Get started for free](/signup) (Secondary outline button)
* *Key Features*:
  * 15 GB Secure Quota (Hard-enforced)
  * Standard `@firstname-lastname-NNNN@pign.app` handle
  * Max 50 document transmittals per month
  * Standard Lexical Search (full-text name & body indexing)
  * Multi-format imports (PDF, PNG, JPG, JPEG)
  * Core end-to-end transport layer encryption

##### 2. Personal (Pro)
* *Description*: For professionals and power users who need vanity handles, high quotas, and priority OCR.
* *Monthly Pricing*: **$8** / month
* *Annual Pricing*: **$6.40** / month (Billed annually)
* *Button Copy*: [Go Pro](/signup) (Solid white brand button)
* *Key Features*:
  * 100 GB High-Performance Quota
  * Claim your vanity handle (`@yourname@pign.app`)
  * Unlimited document transmittals & folder shares
  * Priority AI document extraction & summary (OCR powered by GPT-4o-mini within 60 seconds)
  * Proactive duplicate detection alerting
  * 1-click folder bulk-verification
  * 24-hour email support SLA

##### 3. Teams / Business
* *Description*: For organizations requiring formal verified entity status, shared folder structures, and dual-authorization audits.
* *Monthly Pricing*: **$18** / user / month
* *Annual Pricing*: **$14.40** / user / month (Billed annually)
* *Button Copy*: [Create team storage](/signup) (Solid white brand button with badge indicator)
* *Key Features*:
  * 1 TB Shared Team Quota + Custom scaling
  * Entity Verification Badge (e.g., "Verified by Acme Corp")
  * Custom Organization Address (`@role@company.pign.app`)
  * Join up to N team members with role-based access control (Admin, Sender, Viewer)
  * Interactive Duplicate Flag Dashboard (Review & resolve contested uploads)
  * Comprehensive Audit Logs with CSV/API exports
  * Team-wide AI-assisted global chat & cross-document querying
  * Shared Team Folders with automatic recipient routing

##### 4. Enterprise
* *Description*: For global enterprises, financial institutions, and legal firms requiring strict SOC2 compliance, custom SLAs, and custom identity providers.
* *Monthly Pricing*: **Custom Pricing**
* *Annual Pricing*: **Custom Pricing** (Contact sales)
* *Button Copy*: [Contact Sales](mailto:support@pign.storage?subject=Enterprise%20Inquiry) (Outline grey button)
* *Key Features*:
  * Unlimited dedicated cloud storage allocation
  * Dedicated single-tenant database instance options
  * Enterprise-grade SSO integrations (SAML, OIDC, Okta, Azure AD)
  * Custom legal terms, custom DPAs, and dedicated SLAs
  * 24/7/365 direct support & onboarding success manager
  * Wildcard DNS & dedicated custom domain routing (`@domain.com`)
  * Custom AI model fine-tuning and strict localized data residency controls

##### 5. Developer / API
* *Description*: For systems and platforms integrating cryptographic proof and document transmittal pipelines programmatically.
* *Monthly Pricing*: **$29** / month
* *Annual Pricing*: **$23.20** / month (Billed annually)
* *Button Copy*: [Access Developer Sandbox](/signup) (Secondary outline button)
* *Key Features*:
  * Includes 5,000 document extractions/SHA-256 ledger queries per month
  * $0.005 per additional document extraction
  * Full access to cryptographic verify API
  * Automated delivery webhooks (JIT triggers on document arrival)
  * Programmatic @pign mailbox integration (Direct API send/receive)
  * Standard 100 GB storage allocation for developer records
  * Developer documentation, SDK libraries, and dedicated API support channel

---

#### Comprehensive Feature Matrix

| Feature | Free | Personal (Pro) | Teams / Business | Enterprise | Developer / API |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Storage Quota** | 15 GB | 100 GB | 1 TB | Unlimited / Custom | 100 GB |
| **Pign Address** | Standard | Vanity (`@name`) | Org Domain (`@slug`) | Custom Domain | Standard |
| **Monthly Transmittals** | 50 sends | Unlimited | Unlimited | Unlimited | 5,000 requests |
| **Cryptographic Hashing** | ✓ | ✓ | ✓ | ✓ | ✓ |
| **AI OCR & Summaries** | Lexical only | Priority AI (OCR) | Team AI | Custom AI Tuning | Programmatic OCR |
| **Entity Verification** | — | — | Company Manual | Company Domain/KYC | — |
| **Integrations & API** | — | — | Slack / Business | Custom SDKs | API / Webhooks |
| **SLA Support** | Best effort | 24 Hours | 12 Hours | Dedicated 24/7 | 12 Hours |

---

#### Trust & Security Callouts
- **Cryptographic Provenance**: Every document on Pign is mapped to its SHA-256 hash. Once an approved issuer distributes a document, its hash is recorded in an immutable ledger, protecting it from forgery forever.
- **End-to-End Encryption**: Documents are encrypted in transit using TLS 1.3 and at rest using AES-256. Metadata is isolated and kept strictly private.
- **SOC2 Ready Architecture**: Built by cybersecurity experts. Designed to meet strict compliance guidelines for medical, financial, and legal sectors.

---

#### Pricing FAQ

##### Q: What happens if I exceed my storage limit?
A: Pign enforces a hard quota limit (e.g., 15 GB on the Free plan). When you approach 90% of your quota, you will receive an in-app and email alert. If you cross 100%, new uploads and document receipts will be paused until you free up space by shredding old documents or upgrading your plan.

##### Q: How do Pign handles work, and can I change mine?
A: When you sign up, you get an auto-generated handle like `john-doe-1234@pign.app`. On the Personal (Pro) plan, you can claim a custom vanity handle (e.g., `john@pign.app`) as long as it is available. Organizations on the Teams plan get custom company addresses like `billing@acme.pign.app`.

##### Q: What is a "Pending Delivery" and does it cost anything?
A: If you send a document to an external email address that is not registered with Pign, we send them an out-of-band notification. The document remains in a "Pending" delivery state in our secure queue. Once they sign up for a free Pign account, the delivery auto-materializes in their inbox. This is completely free for both the sender and the recipient.

##### Q: Can I cancel my subscription at any time?
A: Yes, you can cancel your subscription at any time from your settings page. If you cancel, your premium features will remain active until the end of your current billing cycle, after which your account will revert to the Free tier. If your stored files exceed 15 GB, you will have 30 days to download and shred files to meet the free quota before account access is restricted.

---

## 4. Page Plan & Copy: /terms (Terms of Use)

### 4.1 Design & Responsive Layout Notes
- **Hero**: Clean, typographic-focused header displaying the document's effective date and version. Font size scale uses `landingType.h2Features` on desktop, scaling down dynamically.
- **Layout**: Two-column layout on desktop:
  - **Left column (sticky, w-1/4)**: Interactive table of contents linking directly to section anchors.
  - **Right column (w-3/4)**: Styled readable copy blocks utilizing standard spacing classes.
  - *Mobile*: Left navigation slides into an accordion menu or drops down from a fixed floating drawer at the top.
- **Visual styling**: Simple monochrome styling. Clean borders separating clauses. Heavy use of monospace styled tables or visual callouts to highlight disclaimers.

---

### 4.2 Full Copy Draft: /terms

```markdown
# PIGN TERMS OF USE

**Effective Date:** May 29, 2026  
**Version:** 1.0.4-LOCKED  
**Support Contact:** support@pign.storage  

*PLEASE READ THESE TERMS CAREFULLY BEFORE USING PIGN. THEY CONTAIN AN ARBITRATION AGREEMENT, CLASS ACTION WAIVER, AND LIMITATIONS OF LIABILITY.*

---

## 1. Introduction and Agreement to Terms

Welcome to **Pign** (the "Platform" or "Service"), owned and operated by Pign Storage Inc. ("we," "us," or "our"). These Terms of Use ("Terms") govern your access to and use of our secure digital mailbox system, cryptographic document verification, file storage features, and @pign email routing services.

By creating an account, uploading documents, or initiating a document transmittal, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not access or use the Service.

---

## 2. Platform Concept and the @pign Digital Mailbox

Pign is a **registered document exchange**. By registering for the Service, you are allocated a unique email handle ending in `@pign.app` (your "Pign Address"). 
* **Transmittal Rule**: Emails and communications sent through or received by your Pign Address must carry at least one valid document or file payload. Plain-text electronic messages without document payloads are rejected or blocked by our mail routing engine.
* **Content-Addressable Verification**: When documents are uploaded or issued by verified entities, the Platform generates a cryptographic SHA-256 hash representing the document's contents. These hashes are used to verify authenticity, traceability, and prevent forgery.

---

## 3. Account Creation, Security, and Handles

### 3.1 Eligibility
You must be at least 18 years old or the age of legal majority in your jurisdiction to register an account. Accounts registered by automated bots are prohibited.

### 3.2 Account Security
Your account uses cryptographic authentication protocols (including OAuth or Resend verification codes). You are solely responsible for keeping your credentials confidential and for all activities that occur under your account. You must notify us immediately at `support@pign.storage` if you suspect unauthorized access.

### 3.3 Allocated Pign Handles
* Standard accounts receive an auto-generated handle (`firstname-lastname-NNNN@pign.app`).
* Premium vanity handles and custom domain subdomains (`@slug.pign.app`) are subject to availability and compliance with third-party trademark rights. We reserve the right to reclaim, reassign, or block any handle that infringes on intellectual property, is deceptive, or impersonates another individual or entity.

---

## 4. Acceptance of Acceptable Use Policy

You agree not to use the Service to upload, store, or transmit any Content that:
1. Is unlawful, fraudulent, harmful, or designed to deceive.
2. Contains malicious software, viruses, trojans, ransomware, or corrupted files.
3. Infringes upon any copyright, patent, trademark, trade secret, or other proprietary rights.
4. Exploits, harms, or threatens minors.
5. Involves unauthorized bulk electronic messaging ("spam") or attempts to bypass our document transmittal rules by attaching empty, blank, or dummy files.

*We reserve the right, in our sole discretion, to lock, suspend, or permanently terminate any account that violates this Acceptable Use Policy.*

---

## 5. User Content, Provenance, and Shared Ownership

### 5.1 Content Ownership
You retain all intellectual property rights in the documents, files, metadata, and texts that you upload to the Platform (your "User Content").

### 5.2 The Delivered Copy Model
Pign's core benefit is absolute traceability. When you transmit or send a document to another user via the Platform (a "Delivery"):
* A permanent, separate copy of that document is created and allocated to the recipient’s storage.
* Once delivered, the **provenance metadata** (including issuer ID, transaction time, and SHA-256 hash) is frozen and becomes immutable.
* Because the recipient now owns a record of the transmittal, **you cannot unilaterally delete, recall, or alter the recipient's copy of the delivered document**. Shredding or permanently deleting a document on your end only removes it from your storage quota; it does not destroy the recipient's proof of receipt.

---

## 6. Cryptographic Verification & Authenticity Disclaimer

**[ATTORNEY REVIEW REQUIRED]**  
*The following clause limits our legal liability regarding document validity:*

Pign provides cryptographic confirmation that a document's digital file matches the exact file registered by an issuer. However:
1. **NO WARRANTY OF FACT**: Cryptographic verification only confirms file integrity and the identity of the digital issuer. It does *not* warrant that the statements contained within the document are true, accurate, legally binding, or legally compliant.
2. **IDENTITY ASSURANCE LIMITS**: Pign relies on manual verification, domain records, and KYC integrations to approve Verified Entities. We do not guarantee that an approved entity has not suffered an internal credential compromise.
3. **NOT A NOTARY**: Pign does not replace standard, government-mandated notarization unless explicitly stated in your jurisdiction.

*Pign hereby disclaims all liability for any financial loss, legal dispute, or damage arising from your reliance on the authenticity of verified documents.*

---

## 7. The Pign-Email/Pending-Delivery Model

When you send a document to a non-Pign user:
1. They receive an out-of-band notification informing them that a secure document is waiting.
2. The document is queued in a "Pending" folder.
3. To retrieve the file, the recipient must register a free Pign account using the target email address.
4. Queued pending documents are held in our secure temporary storage for **90 days**. If the recipient fails to sign up within 90 days, the delivery is permanently purged from our queue.

---

## 8. Permanent Deletion and Shredding

* **Trash Isolation**: When you move a file to the "Trash", it remains recoverable for **30 days**.
* **Automatic Purging**: At the end of the 30-day window, our automated background scripts permanently delete the file's storage block from our databases. This operation is irreversible.
* **Hash Retention**: We retain a record of the document's SHA-256 content hash in our global ledger for duplicate checking and verification purposes. Because hashes are one-way cryptographic strings, they cannot be reversed to recreate your document's contents.

---

## 9. Payments, Billing, and Quotas

### 9.1 Subscriptions
Paid plans (Pro, Teams, Developer) are billed on a recurring monthly or annual basis.

### 9.2 Hard Quota Limits
Pign enforces strict storage quotas (e.g., 15 GB for Free). If you cross your quota limit, we reserve the right to reject new incoming documents and uploads.

### 9.3 Overdue Balances
If your account balance is overdue, we will provide a 30-day grace period. If payment is not received, we reserve the right to downgrade your account to the Free tier, which may restrict your access to files if your total storage exceeds 15 GB.

---

## 10. Limitation of Liability and Indemnification

TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL PIGN STORAGE INC., ITS AFFILIATES, OR DIRECTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUE, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING FROM (I) YOUR ACCESS TO OR USE OF THE SERVICE; (II) ANY FORGERY OR IMPERSONATION ACTIONS BY THIRD-PARTIES; OR (III) THE PERMANENT SHREDDING OF DATA PURSUANT TO YOUR INSTRUCTIONS.

---

## 11. Termination of Service

You may terminate your account at any time by accessing your account settings and selecting "Delete Account". We may suspend or terminate your access immediately if you violate these Terms or our Acceptable Use Policy.

---

## 12. Governing Law and Jurisdiction

These Terms and any dispute arising out of or related to them shall be governed by and construed in accordance with the laws of the **State of California**, without regard to conflict of law principles. Any legal action or proceeding arising under these Terms shall be brought exclusively in the federal or state courts located in San Francisco, California.

---

## 13. Revisions to Terms

We reserve the right to modify these Terms at any time. We will notify you of material changes by placing a prominent notice on our website or by sending an email to your registered address.

---
For questions or support, contact `support@pign.storage`.
```

---

## 5. Page Plan & Copy: /privacy (Privacy Policy)

### 5.1 Design & Responsive Layout Notes
- **Hero**: Minimalist typography emphasizing secure, end-to-end data stewardship. Light accent lines and Bricolage Grotesque typeface.
- **TOC Sidebar**: Interactive vertical step navigation on desktop, sticky on left. Highlights the active reading section.
- **Privacy Highlights Cards**: Top card panel outlining the core privacy commitments (No Ad trackers, Zero file sharing without consent, True Shredding).
- **Responsive Layout**: Reuses the SectionShell component with `gutter="56"`. High readability with medium body sizes (`bodyMd` at 24px, scaling down to 16px on mobile).

---

### 5.2 Full Copy Draft: /privacy

```markdown
# PIGN PRIVACY POLICY

**Effective Date:** May 29, 2026  
**Last Updated:** May 29, 2026  
**Contact Email:** support@pign.storage  

---

## 1. Introduction and Core Privacy Commitment

At **Pign**, we believe that your personal and professional documents are completely private. We designed our platform from the ground up as a secure digital mailbox. This Privacy Policy describes how we collect, protect, process, and delete your data when you use the Pign digital document exchange.

Unlike standard email providers and document storage services:
1. **We never sell your data**: We do not monetize your documents, metadata, or Pign handles.
2. **Zero Ad Trackers**: Our platform does not load advertising trackers, behavioral tracking cookies, or third-party pixels.
3. **True Encryption**: Your files are protected in transit and at rest using banking-grade encryption algorithms.

---

## 2. Personal Data We Collect

To run the Platform, we collect a minimal set of necessary information:

### 2.1 Account Information
* **External Email Address**: Used for login verification and out-of-band notifications.
* **OAuth Profile Data**: If you sign in via Google, we receive your name, email, and avatar image.
* **Pign Handle**: Your allocated `@pign.app` mailbox handle (e.g., `jane-doe-4912@pign.app`).

### 2.2 Payment & Billing Data
* If you sign up for a premium plan, your credit card details are processed directly by our secure third-party processor (**Stripe**). We do not store or see your raw credit card numbers.

### 2.3 System Log Data
* Standard diagnostic logs, including IP addresses, browser types, and operating systems. These logs are used strictly for security monitoring and error tracking (via **Sentry**).

---

## 3. Document and File Handling & Encryption

The security of your document contents is our highest technical priority.

### 3.1 Encryption Protocols
* **In-Transit**: All documents and API calls are encrypted using Transport Layer Security (TLS 1.3).
* **At-Rest**: Documents are stored in secure cloud storage and encrypted using AES-256 keys.

### 3.2 AI Metadata Extraction & OCR
To enable fast text searching, auto-sorting, and semantic chat, Pign processes your uploaded files using secure, automated pipelines:
* When a PDF or image is uploaded, an automated background action extracts the text contents (OCR) and generates a 2-3 sentence document summary.
* This process utilizes a secure API integration with OpenAI's `gpt-4o-mini` vision model.
* **No Model Training**: Our API agreements explicitly prevent OpenAI or any other sub-processor from using your document contents or extracted text to train public AI models. Your files are isolated and processed in a stateless memory buffer.

---

## 4. Verification Metadata & content-Addressability

To protect your documents from forgery, we generate unique identifiers:
* **SHA-256 Content Hashes**: When a document is uploaded, we compute a mathematical hash (SHA-256) of the file's bytes.
* **Immutable Logs**: If you are a member of a Verified Entity, the document's hash, your user ID, and the issuance timestamp are registered in an immutable distribution record.
* **Duplicate Detection**: If a third-party uploads an identical document hash, our duplicate engine alerts the verified owner to review and approve or dispute the copy. The original document is never shown to the third-party during this check; we compare hashes, not files.

---

## 5. The Allocated @pign Email Engine

Your allocated `@pign.app` email address operates under strict mail routing policies:
* **Payload Enforcement**: Our SMTP servers only accept incoming emails that attach at least one valid file (PDF, PNG, JPG, JPEG). Incoming emails without attachments are rejected.
* **Cover Letters**: The body text of emails received at your Pign address is captured and stored as a cover letter inside your mailbox interface, helping you contextualize incoming deliveries.

---

## 6. Sharing & Recipient Rights

Pign’s sharing mechanism is designed to respect the security of both senders and recipients:
* **Secure Link Sharing**: When you share a document using a secure link, the recipient is granted read-only access.
* **Account-Required Sharing**: Recipients must log in or sign up for a free Pign account to open shared files, ensuring we can verify their access permission.
* **Lineage Locking**: If you send a document to another user, they receive their own independent, immutable copy. Even if you subsequently shred your copy, the recipient’s copy and the transmittal audit record remain intact to protect the recipient's legal proof of delivery.

---

## 7. Data Retention and Deletion

We honor your right to delete your personal data:

* **30-Day Trash**: Deleted documents remain in your "Trash" folder for **30 days**. During this window, you can fully restore them.
* **Permanent Shredding**: After 30 days, the files are deleted from our servers. This operation cannot be undone.
* **Pending Deliveries**: Documents sent to unregistered emails are held in queue for **90 days**. If the recipient does not register within 90 days, the files are permanently deleted.
* **Account Closure**: When you delete your account, we shred all documents you own and purge your personal profile within **14 business days**. Immutable cryptographic ledger hashes (without files or plain-text names) remain in place to protect historic transaction records.

---

## 8. Third-Party Processors and Sub-processors

To deliver a premium, secure service, Pign integrates with a limited number of vetted, industry-leading cloud service providers:

1. **Convex** — Backend data store and serverless architecture.
2. **Resend** — SMTP mail routing, verification codes, and external alerts.
3. **OpenAI** — AI-assisted OCR, file summaries, and contextual search.
4. **Stripe** — Secure credit card processing and subscription billing.
5. **Sentry** — Performance diagnostics and crash logging.

*Every sub-processor is bound by strict data processing agreements ensuring compliance with security standards.*

---

## 9. User Rights (GDPR & CCPA Compliance)

Depending on your jurisdiction (such as the European Economic Area under GDPR or California under CCPA), you hold specific legal rights:

* **Right of Access**: You can download all your documents and account metadata directly from your Settings page.
* **Right of Rectification**: You can edit your profile name and handle at any time.
* **Right to Erasure (Shredding)**: You can permanently delete your files and account.
* **Right to Portability**: You can export your documents in their original file format.

To exercise these rights or file a formal data request, please email our security officer at `support@pign.storage`. We respond to all valid legal requests within **30 days**.

---

## 10. Revisions to this Privacy Policy

We may update this Privacy Policy to reflect security enhancements or legal changes. We will notify you of any material changes by posting an update alert inside your dashboard or by emailing your registered address.

---
For more information, reach us at:  
**Pign Security Team**  
support@pign.storage  
/Users/aboakin/Desktop/Web projects/Pign
```

---

## 6. Page Plan & Copy: /help (Help & Support)

### 6.1 Design & Responsive Layout Notes
- **Hero**: Bold support search bar with a background grid backdrop. Uses `landingType.h2Faq` for secondary headings.
- **Categorized Grid**: A 3x2 grid of cards on desktop, converting to a single-column list on mobile. Each card holds high-level FAQs for a specific topic (Account, Uploads, Verification, Sharing, Security, Billing).
- **Direct Contact Banner**: Bottom panel displaying the support email (`support@pign.storage`) in a massive monospace font block with a 24-hour response SLA guarantee card.
- **Figma Alignment**: Consistent dark styling (`#161616`) using SectionShell with `gutter="64"`.

---

### 6.2 Full Copy Draft: /help

```markdown
# PIGN HELP & SUPPORT HUB

**Support Email:** support@pign.storage  
**Platform Status:** Operational ✓  
**Response Guarantee:** < 24 Hours (Pro / Teams / Developer)  

---

## 1. Quick Start Guides

### How Pign Works in 3 Steps
1. **Upload your files**: Ingest any PDF or image. Pign instantly hashes the file and uses secure AI to extract the text and generate a concise summary.
2. **Register your address**: Get your `@pign.app` handle. Send document packages directly to external emails or other Pign mailboxes.
3. **Establish provenance**: Lock original files to your verified company profile to secure your documents against forgery and duplicates.

---

## 2. Technical FAQ Center

### Topic A: Account & @pign Mailbox

#### Q: How is my @pign.app mailbox address allocated?
A: When you register a standard account, you receive an address based on your name, plus a random four-digit suffix (e.g., `jane-smith-9041@pign.app`). If you upgrade to a Personal (Pro) or Teams plan, you can claim a custom vanity handle (e.g., `jane@pign.app`) or a custom domain address (`billing@acme.pign.app`).

#### Q: Can I use Pign to send regular, plain-text emails?
A: No. Pign is a registered document exchange, not a general-purpose chat or email client. Our mail engine strictly enforces a **Document Payload Rule**: every outgoing and incoming transmittal must contain at least one valid document attachment. Messages without attachments are rejected.

---

### Topic B: Uploads & Folder Routing

#### Q: What files can I upload to Pign?
A: We support PDF, PNG, JPG, JPEG, and TXT files. The maximum file size per upload is 50 MB.

#### Q: How do incoming folder structures work?
A: When another user sends you a package of documents, Pign automatically organizes them into a synthetic system folder labeled `From [Sender Name] · [Date]`. You can also create your own custom folders and drag files into them.

---

### Topic C: Cryptographic Verification

#### Q: What does "Verified Document" mean?
A: It means the file was issued by a registered company or individual whose identity has been verified by the Pign administration. When a verified entity sends a document, its hash is logged. Anyone who views the file sees a green checkmark confirming that the file is authentic and has not been altered since it was issued.

#### Q: What is a "Possible Duplicate" alert?
A: Pign uses global hash-based duplicate detection. If you upload a document that has been registered as a verified original by a company (such as a bank invoice), and you do not have a matching distribution record, our system flags it. The verified company is notified to approve or dispute your copy to prevent fraud.

---

### Topic D: Secure Sharing & Deliveries

#### Q: How do I share a document with a non-Pign user?
A: When you send a document to an external email address, we send them a notification containing a secure, magic signup link. Once they register a free Pign account, the document auto-materializes in their new mailbox immediately.

#### Q: Can I retract a document after I have sent it?
A: No. Once a document has been successfully delivered, it is written to the recipient's secure storage. You cannot delete the recipient's copy or undo a transmittal, ensuring a reliable audit trail for both parties.

---

### Topic E: Platform Security & Audits

#### Q: Where is my data stored and is it secure?
A: Your files are stored in highly secure, SOC2-compliant cloud databases, encrypted with AES-256 at rest, and TLS 1.3 in transit. Our backend database architecture is powered by Convex.

#### Q: How does the AI summarize my documents?
A: When you upload a file, we run a secure, stateless OCR pipeline using OpenAI’s `gpt-4o-mini` model. The model extracts text and writes a summary for search indexing. Your document contents are never used to train public AI models.

---

### Topic F: Billing & Subscriptions

#### Q: What happens if I go over my 15 GB free storage quota?
A: You will receive an alert once you use 90% of your quota. If you hit 100%, uploads and document receipts are paused until you free up space by shredding old files or upgrading to a premium plan.

#### Q: How do I manage or cancel my premium subscription?
A: You can upgrade, downgrade, or cancel your plan at any time from your account settings. Payments are securely managed through our payment processor, Stripe.

---

## 3. Contact Support

If your query is not answered above, please reach out to our dedicated support team directly.

* **Support Email:** `support@pign.storage`
* **Response SLAs**:
  * **Free Accounts**: Best effort (typically 2-3 business days)
  * **Pro Accounts**: Guaranteed within 24 hours
  * **Teams & Developers**: Guaranteed within 12 hours
  * **Enterprise**: Guaranteed within 1 hour, 24/7/365

*When emailing us, please include your registered @pign.app handle and any relevant document IDs or transmittal records to help our engineers assist you quickly.*
```

---

## 7. Page Plan & Copy: /about

### 7.1 Design & Responsive Layout Notes
- **Hero**: A powerful, minimalist brand statement about document authenticity, using Bricolage Grotesque display text (`displayLh` at 112px, scaling on mobile).
- **Two-Column Vision Grid**:
  - **Left column**: The core problem we solve (forgery, invoice fraud, email tampering, storage clutter).
  - **Right column**: Our solution (content-addressable ledgers, instant verification, secure inbox routing).
- **Core Values Timeline**: 3 key pillars (Authenticity, Traceability, Privacy) structured in a staggered vertical line layout with green verification bullet markers.
- **Figma Theme Alignment**: Strict dark background (`#161616`) with grey card containers (`--surface-ink-soft`).

---

### 7.2 Full Copy Draft: /about

```markdown
# ABOUT PIGN

**Our Mission:** To build the global cryptographic registry for trusted document exchange.  

---

## 1. The Core Problem: The Unsecured Document Era

Every day, individuals and organizations exchange millions of critical documents—bank statements, invoices, employment contracts, medical records, and legal agreements—via standard email. This model is fundamentally broken:
1. **Unsecured Attachments**: Standard emails are sent in plain text, making attachments vulnerable to interception.
2. **Invoice & Invoice-Compromise Fraud**: Attackers can intercept invoices, alter the bank payment details, and re-transmit them, costing businesses billions annually.
3. **Forgery & Tampering**: It is nearly impossible to prove if a PDF has been altered after it was issued.
4. **Duplicate Clutter**: Crucial records are scattered across multiple mailboxes, making them hard to track down.

---

## 2. Our Solution: The Registered Document Exchange

We created **Pign** to bridge the gap between simple email mailboxes and secure cryptographic ledgers. 

Pign is a secure digital mailbox designed exclusively for important documents. By assigning every file a unique cryptographic hash and locking it to a verified issuing company, we make document forgery mathematically impossible.

When you send a document on Pign, you are not just sending an email attachment—you are registering a formal document transmittal in an immutable, traceable exchange.

---

## 3. How Pign Works

```
[ Ingest & Hash ] ──> [ Verify & Sign ] ──> [ Secure Routing ]
  Extracts text        Binds to verified     Auto-materializes 
  using secure AI      entity identity       in recipient inbox
```

1. **Ingest & Hash**: When a document enters Pign, we compute its SHA-256 hash. If it’s an image or PDF, our secure OCR engine extracts the text and writes a summary so you can find it instantly.
2. **Verify & Sign**: Verified companies can digitally sign original documents, linking the file to their official corporate profile.
3. **Secure Routing**: Every Pign send is routed securely to the recipient's mailbox. If the recipient isn't registered yet, we queue the document in a "Pending" state until they create their free mailbox.

---

## 4. Our Core Values

* **Authenticity Above All**: We believe that you should never have to guess if a document is genuine. We use mathematical hashes to guarantee that files are original and unaltered.
* **Complete Traceability**: Senders and recipients deserve a reliable audit trail. Pign ensures that every transmittal has an immutable record of provenance.
* **Privacy by Design**: Your document contents are yours alone. We do not sell your data, load ad trackers, or train AI models on your files.
* **Frictionless Security**: Cryptographic security should not require a PhD. We package advanced cryptographic proofs into a familiar, intuitive mailbox interface.

---

## 5. Our Story

Pign was founded in 2026 by a team of cybersecurity engineers and product designers who grew tired of watching businesses fall victim to email compromise and PDF tampering. We realized that rather than trying to patch old email servers, the world needed a dedicated digital mailbox designed specifically for document exchange.

Today, Pign stores millions of important documents for individuals and organizations around the globe, protecting everything from mortgage agreements to corporate invoices with mathematical certainty.

---

## 6. Ready to Secure your Records?

Stop risking your most important documents on unsecured email attachments. Create your secure digital mailbox today and start exchanging verified documents.

[Create your secure storage](/signup) (Call-to-Action)
```

---

## 8. Implementation Timeline & Acceptance Criteria

Based on Pign's pre-established build spec (**SPEC.md**), the implementation of these five marketing pages aligns with the overall product roadmap:

### 8.1 Suggested Implementation Workflow (Post-v1 Setup)
1. **Routing Setup (Wk 1)**: Create `app/(marketing)` route group, write `app/(marketing)/layout.tsx`, and convert `MarketingHeader` and `MarketingFooter` links from `ComingSoonStub` to standard Next.js `Link` components.
2. **Page Scaffolding (Wk 2)**: Create standard folder templates and `page.tsx` skeletons for each of the 5 pages inside `app/(marketing)/*`. Apply `SectionShell` boundaries.
3. **Copy & Content Populating (Wk 3)**: Copy-paste the approved drafts from this plan into their respective React files. Maintain semantic markdown elements (`h1`, `p`, `table`) with correct Tailwind utility styles.
4. **Billing Toggle & FAQ Functionality (Wk 4)**: Build the dynamic monthly/annual billing state toggle in `/pricing`, and implement accordion toggle hooks for the FAQs across pricing and help pages.

### 8.2 Acceptance Criteria
- **Link Integrity**: Navigating to `/pricing`, `/terms`, `/privacy`, `/help`, and `/about` returns a 200 HTTP status, rendering the respective pages with correct headers and footers.
- **Header & Footer Synced**: No broken links in `MarketingHeader` or `MarketingFooter`. The `ComingSoonStub` role has been replaced with functional `Link` endpoints.
- **Theme Uniformity**: Backdrops across all 5 pages render exactly as `#161616` (`bg-surface-ink`) with high-contrast white typography (`text-white`), using Bricolage Grotesque.
- **Responsive Fluidity**: At `375px`, `768px`, and `1440px`, there is zero horizontal scroll, text wraps elegantly, cards stack vertically on mobile, and the pricing comparison table is fully legible.
- **Compliance Alignment**: Disclaimers and data deletion schedules match the technical capability limits set in the master `SPEC.md` document (e.g., 15 GB Free storage limits, 30-day Trash automatic purging, 90-day pending storage).
