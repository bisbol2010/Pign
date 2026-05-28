"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionShell } from "./SectionShell";

type Audience = "individuals" | "organisations";

const benefits: string[] = [
  "Share secure files with, colleagues, family and friends",
  "Access your files anywhere anytime through a simple link",
  "Shred and delete files you don\u2019t need forever",
  "AI capabilities allows you to sort and find files quickly",
  "Prevent file forgery through verification",
  "Integrate with your business to send formal letters and classified documents",
  "Provide all required documentation for applications in simple steps",
];

const bandTags = [
  "Avoid junk emails",
  "Filter priority mails",
  "Smart AI verification",
];

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

      <div className="w-full border-y border-white">
        <div className="mx-auto flex min-h-[151px] max-w-[1440px] flex-wrap items-center gap-x-[24px] gap-y-4 px-6 py-6 min-[1440px]:h-[151px] min-[1440px]:flex-nowrap min-[1440px]:pl-[40px]">
          {bandTags.map((tag, i) => (
            <div key={tag} className="flex items-center gap-[24px]">
              <p className="text-[clamp(28px,3.5vw,48px)] font-medium text-white max-[1440px]:whitespace-normal min-[1440px]:whitespace-nowrap">
                {tag}
              </p>
              {i < bandTags.length - 1 && (
                <Image
                  src="/landing/sparkle-star.svg"
                  alt=""
                  aria-hidden
                  width={55}
                  height={55}
                  className="h-[55px] w-[55px] shrink-0"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[1440px]">
        <div
          aria-hidden
          className="pointer-events-none absolute right-[20px] top-[177px] hidden h-[404px] w-[346px] -rotate-[15deg] min-[1440px]:block"
        >
          <Image
            src="/landing/benefits-illustration.svg"
            alt=""
            width={346}
            height={404}
            className="h-full w-full object-contain"
          />
        </div>

        <SectionShell gutter="benefits" className="py-[54px]">
          <div
            role="tablist"
            aria-label="Choose audience"
            className="flex w-fit max-w-full"
          >
            {(
              [
                { id: "individuals", label: "For Individuals" },
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
            className="w-full max-w-[1105px] divide-y divide-grey-2 border border-grey-2 bg-grey-7 pt-[8px] text-pign-black"
          >
            {benefits.map((item) => (
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
        </SectionShell>
      </div>
    </section>
  );
}
