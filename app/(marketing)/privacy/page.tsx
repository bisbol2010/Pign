import type { Metadata } from "next";
import { SectionShell } from "@/components/landing/SectionShell";

export const metadata: Metadata = {
  title: "Privacy Policy — Pign",
  description:
    "Read how Pign collects, protects, and deletes your data — covering encryption, OCR, verification metadata, sub-processors, and your GDPR/CCPA rights.",
};

const sections = [
  { id: "p1", label: "Introduction" },
  { id: "p2", label: "Data we collect" },
  { id: "p3", label: "Document handling & encryption" },
  { id: "p4", label: "Verification metadata" },
  { id: "p5", label: "The @pign email engine" },
  { id: "p6", label: "Sharing & recipient rights" },
  { id: "p7", label: "Data retention & deletion" },
  { id: "p8", label: "Sub-processors" },
  { id: "p9", label: "Your rights (GDPR & CCPA)" },
  { id: "p10", label: "Policy revisions" },
];

const commitments = [
  {
    icon: "🔒",
    title: "We never sell your data",
    body: "We do not monetise your documents, metadata, or Pign handles.",
  },
  {
    icon: "🚫",
    title: "Zero ad trackers",
    body: "Our platform loads no advertising trackers, behavioural cookies, or third-party pixels.",
  },
  {
    icon: "🔐",
    title: "True encryption",
    body: "Your files are protected in transit and at rest using banking-grade encryption algorithms.",
  },
];

const subprocessors = [
  {
    name: "Convex",
    use: "Backend data store and serverless architecture",
    region: "US",
  },
  {
    name: "Resend",
    use: "SMTP mail routing, verification codes, and external alerts",
    region: "US",
  },
  {
    name: "OpenAI",
    use: "AI-assisted OCR, file summaries, and contextual search",
    region: "US",
  },
  {
    name: "Stripe",
    use: "Secure credit card processing and subscription billing",
    region: "US",
  },
  {
    name: "Sentry",
    use: "Performance diagnostics and crash logging",
    region: "US",
  },
];

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-white/10 py-16 md:py-24">
        <SectionShell gutter="64">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-white/50">
            Legal
          </p>
          <h1 className="text-[clamp(36px,5vw,72px)] font-extrabold leading-[0.95] tracking-tight text-white">
            Privacy policy
          </h1>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/50">
            <span>Effective date: 29 May 2026</span>
            <span>Last updated: 29 May 2026</span>
            <span>
              Contact:{" "}
              <a
                href="mailto:support@pign.storage"
                className="text-white/70 underline hover:text-white"
              >
                support@pign.storage
              </a>
            </span>
          </div>
        </SectionShell>
      </section>

      {/* Core commitment cards */}
      <section className="border-b border-white/10 py-12">
        <SectionShell gutter="64">
          <div className="grid gap-4 sm:grid-cols-3">
            {commitments.map(({ title, body }) => (
              <div
                key={title}
                className="rounded-sm border border-white/10 bg-surface-ink-soft p-6"
              >
                <h3 className="mb-2 text-base font-semibold text-white">
                  {title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-white/60">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Body: sticky ToC + content */}
      <section className="py-16 md:py-24">
        <SectionShell gutter="64">
          <div className="flex gap-16">
            {/* Sticky ToC — desktop only */}
            <aside className="hidden w-56 shrink-0 lg:block">
              <nav className="sticky top-8" aria-label="Table of contents">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
                  Contents
                </p>
                <ul className="space-y-2">
                  {sections.map(({ id, label }) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className="block text-sm text-white/50 transition-colors hover:text-white"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Content */}
            <div className="min-w-0 flex-1 space-y-14">
              {/* §1 */}
              <div id="p1">
                <h2 className="mb-4 text-xl font-bold text-white">
                  1. Introduction and core privacy commitment
                </h2>
                <div className="space-y-4 text-base font-light leading-relaxed text-white/70">
                  <p>
                    At Pign, we believe that your personal and professional
                    documents are completely private. We designed our platform
                    from the ground up as a secure digital mailbox. This Privacy
                    Policy describes how we collect, protect, process, and delete
                    your data when you use the Pign digital document exchange.
                  </p>
                  <p>
                    Unlike standard email providers and document storage services:
                    we never sell your data, we load no advertising trackers, and
                    your files are protected with banking-grade encryption.
                  </p>
                </div>
              </div>

              {/* §2 */}
              <div id="p2">
                <h2 className="mb-4 text-xl font-bold text-white">
                  2. Personal data we collect
                </h2>
                <div className="space-y-6 text-base font-light leading-relaxed text-white/70">
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-white">
                      2.1 Account information
                    </h3>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>
                        <strong className="font-medium text-white">
                          External email address:
                        </strong>{" "}
                        Used for login verification and out-of-band notifications.
                      </li>
                      <li>
                        <strong className="font-medium text-white">
                          OAuth profile data:
                        </strong>{" "}
                        If you sign in via Google, we receive your name, email,
                        and avatar image.
                      </li>
                      <li>
                        <strong className="font-medium text-white">Pign handle:</strong>{" "}
                        Your allocated{" "}
                        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-white/80">
                          @pign.app
                        </code>{" "}
                        mailbox handle.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-white">
                      2.2 Payment & billing data
                    </h3>
                    <p>
                      If you sign up for a premium plan, your credit card details
                      are processed directly by{" "}
                      <strong className="font-medium text-white">Stripe</strong>.
                      We do not store or see your raw credit card numbers.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-white">
                      2.3 System log data
                    </h3>
                    <p>
                      Standard diagnostic logs, including IP addresses, browser
                      types, and operating systems. These logs are used strictly
                      for security monitoring and error tracking via{" "}
                      <strong className="font-medium text-white">Sentry</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* §3 */}
              <div id="p3">
                <h2 className="mb-4 text-xl font-bold text-white">
                  3. Document and file handling & encryption
                </h2>
                <div className="space-y-6 text-base font-light leading-relaxed text-white/70">
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-white">
                      3.1 Encryption protocols
                    </h3>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>
                        <strong className="font-medium text-white">In-transit:</strong>{" "}
                        All documents and API calls are encrypted using TLS 1.3.
                      </li>
                      <li>
                        <strong className="font-medium text-white">At-rest:</strong>{" "}
                        Documents are stored in secure cloud storage and encrypted
                        using AES-256 keys.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-white">
                      3.2 AI metadata extraction & OCR
                    </h3>
                    <p className="mb-3">
                      To enable fast text searching, auto-sorting, and semantic
                      chat, Pign processes your uploaded files using secure,
                      automated pipelines:
                    </p>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>
                        When a PDF or image is uploaded, an automated background
                        action extracts the text contents (OCR) and generates a
                        2–3 sentence document summary.
                      </li>
                      <li>
                        This process utilises a secure API integration with
                        OpenAI's{" "}
                        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-white/80">
                          gpt-4o-mini
                        </code>{" "}
                        vision model.
                      </li>
                      <li>
                        <strong className="font-medium text-white">
                          No model training:
                        </strong>{" "}
                        Our API agreements explicitly prevent OpenAI or any other
                        sub-processor from using your document contents to train
                        public AI models. Your files are isolated and processed in
                        a stateless memory buffer.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* §4 */}
              <div id="p4">
                <h2 className="mb-4 text-xl font-bold text-white">
                  4. Verification metadata & content-addressability
                </h2>
                <div className="space-y-3 text-base font-light leading-relaxed text-white/70">
                  <p>
                    To protect your documents from forgery, we generate unique
                    identifiers:
                  </p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      <strong className="font-medium text-white">
                        SHA-256 content hashes:
                      </strong>{" "}
                      When a document is uploaded, we compute a mathematical hash
                      of the file's bytes.
                    </li>
                    <li>
                      <strong className="font-medium text-white">
                        Immutable logs:
                      </strong>{" "}
                      If you are a member of a Verified Entity, the document's
                      hash, your user ID, and the issuance timestamp are
                      registered in an immutable distribution record.
                    </li>
                    <li>
                      <strong className="font-medium text-white">
                        Duplicate detection:
                      </strong>{" "}
                      If a third party uploads an identical document hash, our
                      duplicate engine alerts the verified owner to review and
                      approve or dispute the copy. The original document is never
                      shown to the third party during this check; we compare
                      hashes, not files.
                    </li>
                  </ul>
                </div>
              </div>

              {/* §5 */}
              <div id="p5">
                <h2 className="mb-4 text-xl font-bold text-white">
                  5. The allocated @pign email engine
                </h2>
                <div className="space-y-3 text-base font-light leading-relaxed text-white/70">
                  <p>
                    Your allocated{" "}
                    <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-white/80">
                      @pign.app
                    </code>{" "}
                    email address operates under strict mail routing policies:
                  </p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      <strong className="font-medium text-white">
                        Payload enforcement:
                      </strong>{" "}
                      Our SMTP servers only accept incoming emails that attach at
                      least one valid file (PDF, PNG, JPG, JPEG). Incoming emails
                      without attachments are rejected.
                    </li>
                    <li>
                      <strong className="font-medium text-white">
                        Cover letters:
                      </strong>{" "}
                      The body text of emails received at your Pign address is
                      captured and stored as a cover letter inside your mailbox
                      interface.
                    </li>
                  </ul>
                </div>
              </div>

              {/* §6 */}
              <div id="p6">
                <h2 className="mb-4 text-xl font-bold text-white">
                  6. Sharing & recipient rights
                </h2>
                <ul className="list-disc space-y-3 pl-5 text-base font-light leading-relaxed text-white/70">
                  <li>
                    <strong className="font-medium text-white">
                      Secure link sharing:
                    </strong>{" "}
                    When you share a document using a secure link, the recipient
                    is granted read-only access.
                  </li>
                  <li>
                    <strong className="font-medium text-white">
                      Account-required sharing:
                    </strong>{" "}
                    Recipients must log in or sign up for a free Pign account to
                    open shared files.
                  </li>
                  <li>
                    <strong className="font-medium text-white">
                      Lineage locking:
                    </strong>{" "}
                    If you send a document to another user, they receive their own
                    independent, immutable copy. Even if you subsequently shred
                    your copy, the recipient's copy and the transmittal audit
                    record remain intact to protect their legal proof of delivery.
                  </li>
                </ul>
              </div>

              {/* §7 */}
              <div id="p7">
                <h2 className="mb-4 text-xl font-bold text-white">
                  7. Data retention and deletion
                </h2>
                <ul className="list-disc space-y-3 pl-5 text-base font-light leading-relaxed text-white/70">
                  <li>
                    <strong className="font-medium text-white">30-day trash:</strong>{" "}
                    Deleted documents remain in your Trash folder for 30 days.
                    During this window you can fully restore them.
                  </li>
                  <li>
                    <strong className="font-medium text-white">
                      Permanent shredding:
                    </strong>{" "}
                    After 30 days, the files are deleted from our servers. This
                    operation cannot be undone.
                  </li>
                  <li>
                    <strong className="font-medium text-white">
                      Pending deliveries:
                    </strong>{" "}
                    Documents sent to unregistered emails are held in queue for 90
                    days. If the recipient does not register within 90 days, the
                    files are permanently deleted.
                  </li>
                  <li>
                    <strong className="font-medium text-white">
                      Account closure:
                    </strong>{" "}
                    When you delete your account, we shred all documents you own
                    and purge your personal profile within 14 business days.
                    Immutable cryptographic ledger hashes (without files or
                    plain-text names) remain in place to protect historic
                    transaction records.
                  </li>
                </ul>
              </div>

              {/* §8 */}
              <div id="p8">
                <h2 className="mb-4 text-xl font-bold text-white">
                  8. Third-party processors and sub-processors
                </h2>
                <p className="mb-6 text-base font-light leading-relaxed text-white/70">
                  To deliver a premium, secure service, Pign integrates with a
                  limited number of vetted, industry-leading cloud service
                  providers. Every sub-processor is bound by strict data
                  processing agreements.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="pb-3 pr-6 text-left font-semibold text-white">
                          Processor
                        </th>
                        <th className="pb-3 pr-6 text-left font-semibold text-white">
                          Purpose
                        </th>
                        <th className="pb-3 text-left font-semibold text-white">
                          Region
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subprocessors.map(({ name, use, region }) => (
                        <tr
                          key={name}
                          className="border-b border-white/5 text-white/70"
                        >
                          <td className="py-3 pr-6 font-medium text-white">
                            {name}
                          </td>
                          <td className="py-3 pr-6">{use}</td>
                          <td className="py-3">{region}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* §9 */}
              <div id="p9">
                <h2 className="mb-4 text-xl font-bold text-white">
                  9. Your rights (GDPR & CCPA)
                </h2>
                <p className="mb-4 text-base font-light leading-relaxed text-white/70">
                  Depending on your jurisdiction, you hold specific legal rights:
                </p>
                <ul className="list-disc space-y-3 pl-5 text-base font-light leading-relaxed text-white/70">
                  <li>
                    <strong className="font-medium text-white">Right of access:</strong>{" "}
                    You can download all your documents and account metadata
                    directly from your Settings page.
                  </li>
                  <li>
                    <strong className="font-medium text-white">
                      Right of rectification:
                    </strong>{" "}
                    You can edit your profile name and handle at any time.
                  </li>
                  <li>
                    <strong className="font-medium text-white">
                      Right to erasure (shredding):
                    </strong>{" "}
                    You can permanently delete your files and account.
                  </li>
                  <li>
                    <strong className="font-medium text-white">
                      Right to portability:
                    </strong>{" "}
                    You can export your documents in their original file format.
                  </li>
                </ul>
                <p className="mt-4 text-base font-light leading-relaxed text-white/70">
                  To exercise these rights, please email{" "}
                  <a
                    href="mailto:support@pign.storage"
                    className="text-white/80 underline hover:text-white"
                  >
                    support@pign.storage
                  </a>
                  . We respond to all valid legal requests within{" "}
                  <strong className="font-medium text-white">30 days</strong>.
                </p>
              </div>

              {/* §10 */}
              <div id="p10">
                <h2 className="mb-4 text-xl font-bold text-white">
                  10. Revisions to this privacy policy
                </h2>
                <p className="text-base font-light leading-relaxed text-white/70">
                  We may update this Privacy Policy to reflect security
                  enhancements or legal changes. We will notify you of any
                  material changes by posting an update alert inside your
                  dashboard or by emailing your registered address.
                </p>
              </div>

              <hr className="border-white/10" />
              <p className="text-sm text-white/40">
                Pign Security Team ·{" "}
                <a
                  href="mailto:support@pign.storage"
                  className="text-white/60 underline hover:text-white"
                >
                  support@pign.storage
                </a>
              </p>
            </div>
          </div>
        </SectionShell>
      </section>
    </>
  );
}
