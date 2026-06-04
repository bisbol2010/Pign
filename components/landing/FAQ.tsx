"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

/**
 * FAQ section — Figma node `1240:527` (1440 × 786).
 *
 * Layout:
 *   - Centered H2 "Frequently asked questions" (40px) + contact subtitle
 *   - 5 stacked accordion items inside 754px-wide bordered white cards
 *   - Only one open at a time; "What is Pign?" is open by default
 */

type FaqItem = { q: string; a: string };

const faqs: FaqItem[] = [
  {
    q: "What is Pign?",
    a: "Pign is a digital mailbox built for the documents that actually matter — official letters, ID, contracts and certificates. It keeps them organised, verified against tampering, and shareable with anyone you trust via a single secure link.",
  },
  {
    q: "How does document verification work?",
    a: "When you upload a document, Pign creates a unique fingerprint and locks it to its owner. Anyone you share it with can confirm it’s the genuine, unaltered original — and Pign automatically flags duplicate or tampered copies. You can verify a whole folder at once.",
  },
  {
    q: "What do I need to start using Pign?",
    a: "Just an email address. Sign up, drag in a few documents (or forward them to your Pign address), and Pign will tag, deduplicate and index them so you can find anything in seconds.",
  },
  {
    q: "Are my documents safe?",
    a: "Every document is encrypted in transit and at rest, and fingerprinted on upload so any tamper attempt is visible. You decide who sees what — links can be one-time, time-limited, or revoked instantly — and shredding removes a document permanently.",
  },
  {
    q: "Can I share with someone who isn’t on Pign?",
    a: "Yes. Share a secure link, or send the document to their email — it waits as a Pending item until they create their free mailbox, then lands securely in their inbox.",
  },
  {
    q: "What do I get as an organisation?",
    a: "A central source of truth for every document your customers and partners send you — verified, access-controlled, searchable, and routed into the tools your team already uses, with retention and audit controls for compliance.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="relative bg-surface-ink py-[80px] text-white"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-[1440px] px-[56px]">
        <div className="mx-auto flex max-w-[651px] flex-col items-center gap-[18px] text-center">
          <h2
            id="faq-heading"
            className="text-[clamp(28px,4vw,40px)] font-medium leading-[1.1] text-white"
          >
            Frequently asked questions
          </h2>
          <p className="max-w-[475px] text-[16px] font-medium text-white">
            Have a question that isn&apos;t answered? You can contact us at{" "}
            <a
              href="mailto:support@pign.storage"
              className="font-bold underline-offset-4 hover:underline"
            >
              support@pign.storage
            </a>
          </p>
        </div>

        <div className="mx-auto mt-[40px] flex w-full max-w-[754px] flex-col gap-[12px]">
          {faqs.map((faq, i) => {
            const isOpen = i === openIndex;
            return (
              <div
                key={faq.q}
                className="border border-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-center justify-between gap-[24px] px-[48px] py-[24px] text-left transition-colors hover:bg-white/5"
                >
                  <span className="text-[20px] font-medium leading-[1.4] text-white">
                    {faq.q}
                  </span>
                  <span
                    aria-hidden
                    className="flex h-[24px] w-[24px] shrink-0 items-center justify-center text-white"
                  >
                    {isOpen ? (
                      <Minus size={20} strokeWidth={1.75} />
                    ) : (
                      <Plus size={20} strokeWidth={1.75} />
                    )}
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={`faq-panel-${i}`}
                    className="px-[48px] pb-[32px] pt-[8px] text-[20px] font-medium leading-[32px] text-white"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
