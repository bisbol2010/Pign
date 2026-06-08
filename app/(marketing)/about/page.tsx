import type { Metadata } from "next";
import Link from "next/link";
import { SectionShell } from "@/components/landing/SectionShell";

export const metadata: Metadata = {
  title: "About — Pign",
  description:
    "Learn how Pign became the secure digital mailbox for the documents that matter — store, verify, and share official records you can prove are real.",
};

const values = [
  {
    title: "Authenticity above all",
    body: "You should never have to guess whether a document is genuine. We use mathematical hashes to guarantee that files are original and unaltered.",
  },
  {
    title: "Complete traceability",
    body: "Senders and recipients deserve a reliable audit trail. Every transmittal carries an immutable record of provenance from upload to delivery.",
  },
  {
    title: "Privacy by design",
    body: "Your document contents are yours alone. We do not sell your data, load ad trackers, or train AI models on your files.",
  },
  {
    title: "Frictionless security",
    body: "Cryptographic security should not require a PhD. We package advanced proofs into a familiar, intuitive mailbox interface.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Ingest & hash",
    body: "When a document enters Pign, we compute its SHA-256 hash. If it is an image or PDF, our secure OCR engine extracts the text and writes a summary so you can find it instantly.",
  },
  {
    step: "02",
    title: "Verify & sign",
    body: "Verified companies can digitally sign original documents, linking the file to their official corporate profile so recipients see a trusted badge.",
  },
  {
    step: "03",
    title: "Secure routing",
    body: "Every Pign send is routed securely to the recipient's mailbox. If the recipient is not registered yet, we queue the document in a Pending state until they create their free mailbox.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-white/10 py-24 md:py-32">
        <SectionShell gutter="64">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/landing/mailbox-illustration.svg"
            alt=""
            aria-hidden
            className="mb-8 h-[96px] w-[108px] -rotate-[8deg]"
          />
          <p className="mb-6 text-sm font-medium uppercase tracking-widest text-white/50">
            Our mission
          </p>
          <h1 className="max-w-4xl text-[clamp(48px,7vw,112px)] font-extrabold leading-[0.9] tracking-tight text-white">
            The secure mailbox for documents that matter.
          </h1>
          <p className="mt-8 max-w-2xl text-xl font-light leading-relaxed text-white/70">
            We built Pign to bridge the gap between simple email mailboxes and
            secure cryptographic ledgers — so every important document you send
            or receive can be proved genuine.
          </p>
        </SectionShell>
      </section>

      {/* Problem */}
      <section className="border-b border-white/10 py-20 md:py-28">
        <SectionShell gutter="64">
          <div className="grid gap-12 md:grid-cols-2 md:gap-20">
            <div>
              <h2 className="mb-6 text-[clamp(28px,3.5vw,48px)] font-bold leading-tight text-white">
                The unsecured document era
              </h2>
              <p className="mb-8 text-lg font-light leading-relaxed text-white/70">
                Every day, individuals and organisations exchange millions of
                critical documents — bank statements, invoices, employment
                contracts, medical records, and legal agreements — via standard
                email. This model is fundamentally broken.
              </p>
              <ul className="space-y-4">
                {[
                  "Unsecured attachments interceptable in transit",
                  "Invoice-compromise fraud costs businesses billions annually",
                  "Nearly impossible to prove a PDF has not been altered",
                  "Crucial records scattered across inboxes with no audit trail",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/70">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-verify-red" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-[clamp(28px,3.5vw,48px)] font-bold leading-tight text-white">
                The registered document exchange
              </h2>
              <p className="mb-8 text-lg font-light leading-relaxed text-white/70">
                Pign is a secure digital mailbox designed exclusively for
                important documents. By assigning every file a unique
                cryptographic hash and locking it to a verified issuing
                company, we make document forgery mathematically impossible.
              </p>
              <ul className="space-y-4">
                {[
                  "SHA-256 fingerprint on every upload",
                  "Lock documents to verified companies or individuals",
                  "Global duplicate detection flags tampered copies",
                  "Immutable audit trail for every transmittal",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/70">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-verify-green" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* How it works */}
      <section className="border-b border-white/10 py-20 md:py-28">
        <SectionShell gutter="64">
          <h2 className="mb-16 text-[clamp(28px,3.5vw,48px)] font-bold text-white">
            How Pign works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {howItWorks.map(({ step, title, body }) => (
              <div
                key={step}
                className="rounded-sm border border-white/10 bg-surface-ink-soft p-8"
              >
                <p className="mb-4 font-mono text-sm text-verify-green">{step}</p>
                <h3 className="mb-3 text-xl font-semibold text-white">{title}</h3>
                <p className="text-base font-light leading-relaxed text-white/70">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Values */}
      <section className="border-b border-white/10 py-20 md:py-28">
        <SectionShell gutter="64">
          <h2 className="mb-16 text-[clamp(28px,3.5vw,48px)] font-bold text-white">
            Our core values
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {values.map(({ title, body }) => (
              <div
                key={title}
                className="rounded-sm border border-white/10 bg-surface-ink-soft p-8"
              >
                <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3>
                <p className="text-base font-light leading-relaxed text-white/70">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Story */}
      <section className="border-b border-white/10 py-20 md:py-28">
        <SectionShell gutter="64">
          <div className="max-w-3xl">
            <h2 className="mb-8 text-[clamp(28px,3.5vw,48px)] font-bold text-white">
              Our story
            </h2>
            <p className="mb-6 text-lg font-light leading-relaxed text-white/70">
              Pign was founded in 2026 by a team of cybersecurity engineers and
              product designers who grew tired of watching businesses fall victim
              to email compromise and PDF tampering. We realised that rather than
              trying to patch old email servers, the world needed a dedicated
              digital mailbox designed specifically for document exchange.
            </p>
            <p className="text-lg font-light leading-relaxed text-white/70">
              Today, Pign stores important documents for individuals and
              organisations, protecting everything from mortgage agreements to
              corporate invoices with mathematical certainty.
            </p>
          </div>
        </SectionShell>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-40">
        <SectionShell gutter="64">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <h2 className="text-[clamp(32px,4.5vw,56px)] font-bold leading-tight text-white">
              Ready to secure your records?
            </h2>
            <p className="mt-6 max-w-xl text-lg font-light text-white/70">
              Stop risking your most important documents on unsecured email
              attachments. Create your secure digital mailbox today.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex h-[59px] items-center justify-center bg-white px-10 text-base font-bold text-pign-black transition-colors hover:bg-grey-6"
              >
                Get started for free
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-[59px] items-center justify-center border border-white px-10 text-base font-bold text-white transition-colors hover:bg-white/10"
              >
                See pricing
              </Link>
            </div>
          </div>
        </SectionShell>
      </section>
    </>
  );
}
