"use client";

import { useEffect, useState } from "react";
import { SectionShell } from "@/components/landing/SectionShell";

type FaqTopic = {
  topic: string;
  id: string;
  items: { q: string; a: string }[];
};

const faqs: FaqTopic[] = [
  {
    topic: "Account & @pign mailbox",
    id: "account",
    items: [
      {
        q: "How is my @pign.app address allocated?",
        a: "When you register a standard account, you receive an address based on your name plus a random four-digit suffix (e.g. jane-smith-9041@pign.app). On a Personal (Pro) or Teams plan you can claim a custom vanity handle (e.g. jane@pign.app) or a custom domain address (billing@acme.pign.app).",
      },
      {
        q: "Can I use Pign to send regular, plain-text emails?",
        a: "No. Pign is a registered document exchange, not a general-purpose email client. Our mail engine enforces a Document Payload Rule: every outgoing and incoming transmittal must contain at least one valid document attachment. Messages without attachments are rejected.",
      },
    ],
  },
  {
    topic: "Uploads & folder routing",
    id: "uploads",
    items: [
      {
        q: "What files can I upload to Pign?",
        a: "We support PDF, PNG, JPG, JPEG, and TXT files. The maximum file size per upload is 50 MB.",
      },
      {
        q: "How do incoming folder structures work?",
        a: "When another user sends you a package of documents, Pign automatically organises them into a synthetic folder labelled \u201cFrom [Sender Name] \u00b7 [Date]\u201d. You can also create your own custom folders and drag files into them.",
      },
    ],
  },
  {
    topic: "Cryptographic verification",
    id: "verification",
    items: [
      {
        q: "What does \u2018Verified Document\u2019 mean?",
        a: "It means the file was issued by a registered company or individual whose identity has been verified by the Pign administration. When a verified entity sends a document, its hash is logged. Anyone who views the file sees a green checkmark confirming that the file is authentic and has not been altered since it was issued.",
      },
      {
        q: "What is a \u2018Possible Duplicate\u2019 alert?",
        a: "Pign uses global hash-based duplicate detection. If you upload a document that has been registered as a verified original by a company (such as a bank invoice), and you do not have a matching distribution record, our system flags it. The verified company is notified to approve or dispute your copy to prevent fraud.",
      },
    ],
  },
  {
    topic: "Secure sharing & deliveries",
    id: "sharing",
    items: [
      {
        q: "How do I share a document with a non-Pign user?",
        a: "When you send a document to an external email address, we send them a notification containing a secure sign-up link. Once they register a free Pign account, the document auto-materialises in their new mailbox immediately.",
      },
      {
        q: "Can I retract a document after I have sent it?",
        a: "No. Once a document has been successfully delivered, it is written to the recipient's secure storage. You cannot delete the recipient's copy or undo a transmittal, ensuring a reliable audit trail for both parties.",
      },
    ],
  },
  {
    topic: "Platform security & audits",
    id: "security",
    items: [
      {
        q: "Where is my data stored and is it secure?",
        a: "Your files are stored in highly secure, SOC2-compliant cloud databases, encrypted with AES-256 at rest, and TLS 1.3 in transit. Our backend architecture is powered by Convex.",
      },
      {
        q: "How does the AI summarise my documents?",
        a: "When you upload a file, we run a secure, stateless OCR pipeline using OpenAI's gpt-4o-mini model. The model extracts text and writes a summary for search indexing. Your document contents are never used to train public AI models.",
      },
    ],
  },
  {
    topic: "Billing & subscriptions",
    id: "billing",
    items: [
      {
        q: "What happens if I go over my 15 GB free storage quota?",
        a: "You will receive an alert once you use 90% of your quota. If you hit 100%, uploads and document receipts are paused until you free up space by shredding old files or upgrading to a premium plan.",
      },
      {
        q: "How do I manage or cancel my premium subscription?",
        a: "You can upgrade, downgrade, or cancel your plan at any time from your account settings. Payments are securely managed through our payment processor, Stripe.",
      },
    ],
  },
];

const quickStart = [
  {
    n: "1",
    title: "Upload your files",
    body: "Ingest any PDF or image. Pign instantly hashes the file and uses secure AI to extract the text and generate a concise summary.",
  },
  {
    n: "2",
    title: "Register your address",
    body: "Get your @pign.app handle. Send document packages directly to external emails or other Pign mailboxes.",
  },
  {
    n: "3",
    title: "Establish provenance",
    body: "Lock original files to your verified company profile to secure your documents against forgery and duplicates.",
  },
];

const supportTiers = [
  { tier: "Free accounts", sla: "Best effort (2–3 business days)" },
  { tier: "Pro accounts", sla: "Guaranteed within 24 hours" },
  { tier: "Teams & developers", sla: "Guaranteed within 12 hours" },
  { tier: "Enterprise", sla: "Within 1 hour, 24/7/365" },
];

export function HelpContent() {
  const [activeId, setActiveId] = useState<string>(faqs[0].id);

  // Honour a deep link such as /help#verification (used by the homepage
  // feature links) by selecting the matching tab on mount.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && faqs.some((f) => f.id === hash)) {
      setActiveId(hash);
    }
  }, []);

  const active = faqs.find((f) => f.id === activeId) ?? faqs[0];

  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32">
        <SectionShell gutter="64">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/landing/mailbox-illustration.svg"
            alt=""
            aria-hidden
            className="mb-8 h-[96px] w-[108px] -rotate-[8deg]"
          />
          <p className="mb-6 text-sm font-medium uppercase tracking-widest text-white/50">
            Help &amp; support
          </p>
          <h1 className="max-w-3xl text-[clamp(48px,6vw,96px)] font-extrabold leading-[0.9] tracking-tight text-white">
            How can we help?
          </h1>
          <p className="mt-8 max-w-2xl text-xl font-light leading-relaxed text-white/70">
            Find answers to common questions about your Pign mailbox, document
            verification, secure sharing, and billing. Pick a topic below — the
            answers update right here, no endless scrolling.
          </p>
        </SectionShell>
      </section>

      {/* Quick start */}
      <section className="py-20 md:py-28">
        <SectionShell gutter="64">
          <h2 className="mb-12 text-[clamp(24px,3vw,40px)] font-bold text-white">
            Quick start: how Pign works in 3 steps
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {quickStart.map(({ n, title, body }) => (
              <div
                key={n}
                className="rounded-sm border border-white/10 bg-surface-ink-soft p-8"
              >
                <p className="mb-4 font-mono text-sm text-verify-green">0{n}</p>
                <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3>
                <p className="text-base font-light leading-relaxed text-white/70">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* FAQ explorer — tabs + in-view content */}
      <section className="py-20 md:py-28">
        <SectionShell gutter="64">
          <h2 className="mb-12 text-[clamp(24px,3vw,40px)] font-bold text-white">
            Browse by topic
          </h2>
          <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
            {/* Tab list */}
            <div
              role="tablist"
              aria-label="Help topics"
              aria-orientation="vertical"
              className="flex flex-row flex-wrap gap-2 lg:flex-col lg:gap-1"
            >
              {faqs.map(({ topic, id }) => {
                const isActive = id === activeId;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    id={`tab-${id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${id}`}
                    onClick={() => setActiveId(id)}
                    className={`rounded-sm px-4 py-3 text-left text-sm font-medium transition-colors lg:text-base ${
                      isActive
                        ? "bg-white text-pign-black"
                        : "border border-white/10 text-white/70 hover:border-white/30 hover:text-white lg:border-transparent lg:hover:bg-white/5"
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>

            {/* Active panel */}
            <div
              role="tabpanel"
              id={`panel-${active.id}`}
              aria-labelledby={`tab-${active.id}`}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-white">{active.topic}</h3>
              {active.items.map(({ q, a }) => (
                <div
                  key={q}
                  className="rounded-sm border border-white/10 bg-surface-ink-soft p-6 md:p-8"
                >
                  <h4 className="mb-3 text-base font-semibold text-white">{q}</h4>
                  <p className="text-base font-light leading-relaxed text-white/70">
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Contact */}
      <section className="py-24 md:py-32">
        <SectionShell gutter="64">
          <div className="rounded-sm border border-white/10 bg-surface-ink-soft p-10 md:p-16">
            <h2 className="mb-4 text-[clamp(24px,3vw,40px)] font-bold text-white">
              Still need help?
            </h2>
            <p className="mb-8 text-lg font-light text-white/70">
              If your question is not answered above, reach out to our support
              team directly. Please include your registered @pign.app handle and
              any relevant document IDs to help us assist you quickly.
            </p>
            <a
              href="mailto:support@pign.storage"
              className="mb-10 inline-block text-[clamp(24px,3.5vw,48px)] font-bold text-white transition-opacity hover:opacity-70"
            >
              support@pign.storage
            </a>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {supportTiers.map(({ tier, sla }) => (
                <div key={tier} className="rounded-sm border border-white/10 p-5">
                  <p className="mb-1 text-sm font-semibold text-white">{tier}</p>
                  <p className="text-sm font-light text-white/60">{sla}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>
      </section>
    </>
  );
}
