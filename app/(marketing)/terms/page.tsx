import type { Metadata } from "next";
import { SectionShell } from "@/components/landing/SectionShell";

export const metadata: Metadata = {
  title: "Terms of Use — Pign",
  description:
    "Read the Pign Terms of Use covering accounts, document transmittals, acceptable use, cryptographic verification, payments, and more.",
};

const sections = [
  { id: "s1", label: "Introduction" },
  { id: "s2", label: "The @pign digital mailbox" },
  { id: "s3", label: "Accounts & handles" },
  { id: "s4", label: "Acceptable use" },
  { id: "s5", label: "Content & provenance" },
  { id: "s6", label: "Cryptographic verification" },
  { id: "s7", label: "Pending delivery model" },
  { id: "s8", label: "Deletion & shredding" },
  { id: "s9", label: "Payments & quotas" },
  { id: "s10", label: "Limitation of liability" },
  { id: "s11", label: "Termination" },
  { id: "s12", label: "Governing law" },
  { id: "s13", label: "Revisions" },
];

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-white/10 py-16 md:py-24">
        <SectionShell gutter="64">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-white/50">
            Legal
          </p>
          <h1 className="text-[clamp(36px,5vw,72px)] font-extrabold leading-[0.95] tracking-tight text-white">
            Terms of use
          </h1>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/50">
            <span>Effective date: 29 May 2026</span>
            <span>Version: 1.0.4-LOCKED</span>
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
          <p className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-white/50">
            Please read these Terms carefully before using Pign. They contain an
            arbitration agreement, class action waiver, and limitations of
            liability.
          </p>
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
              <div id="s1">
                <h2 className="mb-4 text-xl font-bold text-white">
                  1. Introduction and agreement to terms
                </h2>
                <div className="space-y-4 text-base font-light leading-relaxed text-white/70">
                  <p>
                    Welcome to <strong className="font-medium text-white">Pign</strong> (the
                    "Platform" or "Service"), owned and operated by Pign Storage
                    Inc. ("we", "us", or "our"). These Terms of Use ("Terms")
                    govern your access to and use of our secure digital mailbox
                    system, cryptographic document verification, file storage
                    features, and @pign email routing services.
                  </p>
                  <p>
                    By creating an account, uploading documents, or initiating a
                    document transmittal, you agree to be bound by these Terms
                    and our Privacy Policy. If you do not agree to these Terms,
                    you must not access or use the Service.
                  </p>
                </div>
              </div>

              {/* §2 */}
              <div id="s2">
                <h2 className="mb-4 text-xl font-bold text-white">
                  2. The @pign digital mailbox
                </h2>
                <div className="space-y-4 text-base font-light leading-relaxed text-white/70">
                  <p>
                    Pign is a <strong className="font-medium text-white">registered document exchange</strong>.
                    By registering for the Service, you are allocated a unique
                    email handle ending in{" "}
                    <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-white/80">
                      @pign.app
                    </code>{" "}
                    (your "Pign Address").
                  </p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      <strong className="font-medium text-white">Transmittal rule:</strong>{" "}
                      Emails and communications sent through or received by your
                      Pign Address must carry at least one valid document or file
                      payload. Plain-text messages without document payloads are
                      rejected by our mail routing engine.
                    </li>
                    <li>
                      <strong className="font-medium text-white">Content-addressable verification:</strong>{" "}
                      When documents are uploaded or issued by verified entities,
                      the Platform generates a cryptographic SHA-256 hash
                      representing the document's contents. These hashes are used
                      to verify authenticity, traceability, and prevent forgery.
                    </li>
                  </ul>
                </div>
              </div>

              {/* §3 */}
              <div id="s3">
                <h2 className="mb-4 text-xl font-bold text-white">
                  3. Account creation, security, and handles
                </h2>
                <div className="space-y-6 text-base font-light leading-relaxed text-white/70">
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-white">
                      3.1 Eligibility
                    </h3>
                    <p>
                      You must be at least 18 years old or the age of legal
                      majority in your jurisdiction to register an account.
                      Accounts registered by automated bots are prohibited.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-white">
                      3.2 Account security
                    </h3>
                    <p>
                      Your account uses cryptographic authentication protocols
                      (including OAuth or Resend verification codes). You are
                      solely responsible for keeping your credentials confidential
                      and for all activities that occur under your account. You
                      must notify us immediately at{" "}
                      <a
                        href="mailto:support@pign.storage"
                        className="text-white/80 underline hover:text-white"
                      >
                        support@pign.storage
                      </a>{" "}
                      if you suspect unauthorised access.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-white">
                      3.3 Allocated Pign handles
                    </h3>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>
                        Standard accounts receive an auto-generated handle (e.g.{" "}
                        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-white/80">
                          firstname-lastname-NNNN@pign.app
                        </code>).
                      </li>
                      <li>
                        Premium vanity handles and custom domain subdomains are
                        subject to availability and compliance with third-party
                        trademark rights. We reserve the right to reclaim,
                        reassign, or block any handle that infringes on
                        intellectual property, is deceptive, or impersonates
                        another individual or entity.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* §4 */}
              <div id="s4">
                <h2 className="mb-4 text-xl font-bold text-white">
                  4. Acceptable use policy
                </h2>
                <p className="mb-4 text-base font-light leading-relaxed text-white/70">
                  You agree not to use the Service to upload, store, or transmit
                  any content that:
                </p>
                <ol className="list-decimal space-y-3 pl-5 text-base font-light leading-relaxed text-white/70">
                  <li>Is unlawful, fraudulent, harmful, or designed to deceive.</li>
                  <li>
                    Contains malicious software, viruses, trojans, ransomware, or
                    corrupted files.
                  </li>
                  <li>
                    Infringes upon any copyright, patent, trademark, trade secret,
                    or other proprietary rights.
                  </li>
                  <li>Exploits, harms, or threatens minors.</li>
                  <li>
                    Involves unauthorised bulk electronic messaging ("spam") or
                    attempts to bypass our document transmittal rules by attaching
                    empty, blank, or dummy files.
                  </li>
                </ol>
                <p className="mt-4 text-sm italic text-white/50">
                  We reserve the right, in our sole discretion, to lock, suspend,
                  or permanently terminate any account that violates this
                  Acceptable Use Policy.
                </p>
              </div>

              {/* §5 */}
              <div id="s5">
                <h2 className="mb-4 text-xl font-bold text-white">
                  5. User content, provenance, and shared ownership
                </h2>
                <div className="space-y-6 text-base font-light leading-relaxed text-white/70">
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-white">
                      5.1 Content ownership
                    </h3>
                    <p>
                      You retain all intellectual property rights in the
                      documents, files, metadata, and texts that you upload to the
                      Platform (your "User Content").
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-white">
                      5.2 The delivered copy model
                    </h3>
                    <p className="mb-3">
                      Pign's core benefit is absolute traceability. When you
                      transmit or send a document to another user via the Platform
                      (a "Delivery"):
                    </p>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>
                        A permanent, separate copy of that document is created and
                        allocated to the recipient's storage.
                      </li>
                      <li>
                        Once delivered, the provenance metadata (including issuer
                        ID, transaction time, and SHA-256 hash) is frozen and
                        becomes immutable.
                      </li>
                      <li>
                        Because the recipient now owns a record of the transmittal,{" "}
                        <strong className="font-medium text-white">
                          you cannot unilaterally delete, recall, or alter the
                          recipient's copy
                        </strong>{" "}
                        of the delivered document. Shredding on your end only
                        removes it from your storage quota; it does not destroy
                        the recipient's proof of receipt.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* §6 */}
              <div id="s6">
                <h2 className="mb-4 text-xl font-bold text-white">
                  6. Cryptographic verification & authenticity disclaimer
                </h2>
                <div className="mb-4 rounded border border-verify-amber/40 bg-verify-amber/10 p-4 text-sm text-verify-amber">
                  Attorney review recommended before relying on this section for
                  legal purposes.
                </div>
                <div className="space-y-4 text-base font-light leading-relaxed text-white/70">
                  <p>
                    Pign provides cryptographic confirmation that a document's
                    digital file matches the exact file registered by an issuer.
                    However:
                  </p>
                  <ol className="list-decimal space-y-3 pl-5">
                    <li>
                      <strong className="font-medium text-white">
                        No warranty of fact:
                      </strong>{" "}
                      Cryptographic verification only confirms file integrity and
                      the identity of the digital issuer. It does not warrant that
                      the statements contained within the document are true,
                      accurate, legally binding, or legally compliant.
                    </li>
                    <li>
                      <strong className="font-medium text-white">
                        Identity assurance limits:
                      </strong>{" "}
                      Pign relies on manual verification, domain records, and KYC
                      integrations to approve Verified Entities. We do not
                      guarantee that an approved entity has not suffered an
                      internal credential compromise.
                    </li>
                    <li>
                      <strong className="font-medium text-white">
                        Not a notary:
                      </strong>{" "}
                      Pign does not replace standard, government-mandated
                      notarisation unless explicitly stated in your jurisdiction.
                    </li>
                  </ol>
                </div>
              </div>

              {/* §7 */}
              <div id="s7">
                <h2 className="mb-4 text-xl font-bold text-white">
                  7. The Pign-email / pending delivery model
                </h2>
                <div className="space-y-3 text-base font-light leading-relaxed text-white/70">
                  <p>
                    When you send a document to a non-Pign user:
                  </p>
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>
                      They receive an out-of-band notification informing them that
                      a secure document is waiting.
                    </li>
                    <li>The document is queued in a "Pending" folder.</li>
                    <li>
                      To retrieve the file, the recipient must register a free
                      Pign account using the target email address.
                    </li>
                    <li>
                      Queued pending documents are held in our secure temporary
                      storage for{" "}
                      <strong className="font-medium text-white">90 days</strong>.
                      If the recipient fails to sign up within 90 days, the
                      delivery is permanently purged from our queue.
                    </li>
                  </ol>
                </div>
              </div>

              {/* §8 */}
              <div id="s8">
                <h2 className="mb-4 text-xl font-bold text-white">
                  8. Permanent deletion and shredding
                </h2>
                <ul className="list-disc space-y-3 pl-5 text-base font-light leading-relaxed text-white/70">
                  <li>
                    <strong className="font-medium text-white">Trash isolation:</strong>{" "}
                    When you move a file to Trash, it remains recoverable for{" "}
                    <strong className="font-medium text-white">30 days</strong>.
                  </li>
                  <li>
                    <strong className="font-medium text-white">Automatic purging:</strong>{" "}
                    At the end of the 30-day window, our automated background
                    scripts permanently delete the file's storage block. This
                    operation is irreversible.
                  </li>
                  <li>
                    <strong className="font-medium text-white">Hash retention:</strong>{" "}
                    We retain a record of the document's SHA-256 content hash in
                    our global ledger for duplicate checking. Because hashes are
                    one-way cryptographic strings, they cannot be reversed to
                    recreate your document's contents.
                  </li>
                </ul>
              </div>

              {/* §9 */}
              <div id="s9">
                <h2 className="mb-4 text-xl font-bold text-white">
                  9. Payments, billing, and quotas
                </h2>
                <div className="space-y-6 text-base font-light leading-relaxed text-white/70">
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-white">
                      9.1 Subscriptions
                    </h3>
                    <p>
                      Paid plans (Pro, Teams, Developer) are billed on a
                      recurring monthly or annual basis via our payment processor,
                      Stripe.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-white">
                      9.2 Hard quota limits
                    </h3>
                    <p>
                      Pign enforces strict storage quotas (15 GB for Free plans).
                      If you cross your quota limit, we reserve the right to
                      reject new incoming documents and uploads.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-white">
                      9.3 Overdue balances
                    </h3>
                    <p>
                      If your account balance is overdue, we will provide a 30-day
                      grace period. If payment is not received, we reserve the
                      right to downgrade your account to the Free tier, which may
                      restrict your access if your total storage exceeds 15 GB.
                    </p>
                  </div>
                </div>
              </div>

              {/* §10 */}
              <div id="s10">
                <h2 className="mb-4 text-xl font-bold text-white">
                  10. Limitation of liability and indemnification
                </h2>
                <p className="text-sm font-light leading-relaxed text-white/60">
                  TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
                  SHALL PIGN STORAGE INC., ITS AFFILIATES, OR DIRECTORS BE LIABLE
                  FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                  PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUE, WHETHER
                  INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE,
                  GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING FROM (I) YOUR
                  ACCESS TO OR USE OF THE SERVICE; (II) ANY FORGERY OR
                  IMPERSONATION ACTIONS BY THIRD-PARTIES; OR (III) THE PERMANENT
                  SHREDDING OF DATA PURSUANT TO YOUR INSTRUCTIONS.
                </p>
              </div>

              {/* §11 */}
              <div id="s11">
                <h2 className="mb-4 text-xl font-bold text-white">
                  11. Termination of service
                </h2>
                <p className="text-base font-light leading-relaxed text-white/70">
                  You may terminate your account at any time by accessing your
                  account settings and selecting "Delete Account". We may suspend
                  or terminate your access immediately if you violate these Terms
                  or our Acceptable Use Policy.
                </p>
              </div>

              {/* §12 */}
              <div id="s12">
                <h2 className="mb-4 text-xl font-bold text-white">
                  12. Governing law and jurisdiction
                </h2>
                <p className="text-base font-light leading-relaxed text-white/70">
                  These Terms and any dispute arising out of or related to them
                  shall be governed by and construed in accordance with the laws
                  of the{" "}
                  <strong className="font-medium text-white">
                    State of California
                  </strong>
                  , without regard to conflict of law principles. Any legal action
                  or proceeding arising under these Terms shall be brought
                  exclusively in the federal or state courts located in San
                  Francisco, California.
                </p>
              </div>

              {/* §13 */}
              <div id="s13">
                <h2 className="mb-4 text-xl font-bold text-white">
                  13. Revisions to these terms
                </h2>
                <p className="text-base font-light leading-relaxed text-white/70">
                  We reserve the right to modify these Terms at any time. We will
                  notify you of material changes by placing a prominent notice on
                  our website or by sending an email to your registered address.
                </p>
              </div>

              <hr className="border-white/10" />
              <p className="text-sm text-white/40">
                For questions or support, contact{" "}
                <a
                  href="mailto:support@pign.storage"
                  className="text-white/60 underline hover:text-white"
                >
                  support@pign.storage
                </a>
                .
              </p>
            </div>
          </div>
        </SectionShell>
      </section>
    </>
  );
}
