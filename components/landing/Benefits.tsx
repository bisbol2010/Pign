"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionShell } from "./SectionShell";

type Audience = "individuals" | "organisations";

const audienceBenefits: Record<Audience, string[]> = {
  individuals: [
    "Share documents securely with family, friends and colleagues",
    "Open your documents anywhere, anytime, from a single secure link",
    "Shred documents you no longer need — permanently",
    "Let AI sort, tag and find any document in seconds",
    "Prove a document is genuine and prevent forgery with verification",
    "Keep every important letter, ID and certificate in one private mailbox",
    "Assemble everything an application needs in a few clicks",
  ],
  organisations: [
    "Make your mailbox the single source of truth for inbound documents",
    "Verify and lock documents to your company to prove authenticity",
    "Send formal letters and classified documents with full traceability",
    "Route incoming documents into Slack, Teams and your project tools",
    "Control access with revocable, time-limited secure links",
    "Detect duplicate and tampered uploads automatically",
    "Retain, audit and dispose of documents to meet your policies",
  ],
};

const bandTags = [
  "Proof of authenticity",
  "Encrypted by default",
  "Find anything in seconds",
  "Share with one secure link",
];

/** One seamless run of the ticker tags; rendered twice for the marquee loop. */
function BandRun({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-[24px] pr-[24px]"
    >
      {bandTags.map((tag) => (
        <div key={tag} className="flex items-center gap-[24px]">
          <p className="whitespace-nowrap text-[clamp(28px,3.5vw,48px)] font-medium text-white">
            {tag}
          </p>
          <Image
            src="/landing/sparkle-star.svg"
            alt=""
            aria-hidden
            width={55}
            height={55}
            className="h-[55px] w-[55px] shrink-0"
          />
        </div>
      ))}
    </div>
  );
}

export function Benefits() {
  const [audience, setAudience] = useState<Audience>("individuals");

  return (
    <section
      className="relative bg-surface-ink text-white"
      aria-labelledby="benefits-heading"
    >
      <h2 id="benefits-heading" className="sr-only">
        Why Pign
      </h2>

      <div className="w-full overflow-hidden border-y border-white">
        <div className="flex min-h-[151px] items-center min-[1440px]:h-[151px]">
          <div className="landing-marquee flex w-max shrink-0 items-center">
            <BandRun />
            <BandRun ariaHidden />
          </div>
        </div>
      </div>

      <SectionShell gutter="benefits" className="py-[54px]">
        <div className="mx-auto w-full max-w-[1105px]">
          <div
            role="tablist"
            aria-label="Choose audience"
            className="flex w-fit max-w-full"
          >
            {(
              [
                { id: "individuals", label: "For individuals" },
                { id: "organisations", label: "For organisations" },
              ] as const
            ).map((tab, i) => {
              const isActive = audience === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`benefits-tab-${tab.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls="benefits-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setAudience(tab.id)}
                  className={[
                    "flex items-center justify-center border border-grey-2 px-[20px] py-[16px] text-[clamp(20px,2vw,32px)] font-bold transition-colors",
                    i === 0
                      ? "rounded-tl-[20px] -mr-px"
                      : "rounded-tr-[20px]",
                    isActive
                      ? "bg-grey-7 text-pign-black"
                      : "bg-transparent text-white hover:bg-white/5",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div
            id="benefits-panel"
            role="tabpanel"
            aria-labelledby={`benefits-tab-${audience}`}
            className="w-full divide-y divide-grey-2 border border-grey-2 bg-grey-7 pt-[8px] text-pign-black"
          >
            {audienceBenefits[audience].map((item) => (
              <div
                key={item}
                className="flex items-center gap-[40px] px-[20px] py-[16px]"
              >
                <span
                  aria-hidden
                  className="block size-[12px] shrink-0 rounded-full bg-pign-black"
                />
                <p className="text-[clamp(16px,1.6vw,24px)] font-medium leading-tight">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
