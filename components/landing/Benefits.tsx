"use client";

import { useState } from "react";
import Image from "next/image";

type Audience = "individuals" | "organisations";

/**
 * Benefits section — Figma node `1234:1575` (1440 × 783).
 *
 * Three vertical bands inside one section:
 *
 *   1. Sub-hero band (151px, full-bleed, bordered top+bottom white):
 *        "Avoid junk emails ★ Filter priority mails ★ Smart AI verification"
 *
 *   2. Tab row + 7-row light card (~1105px wide, #F2F2F2 bg, #4D4D4D border):
 *        Tabs: For Individuals (active) | For organisations
 *        Body: 7 bullet rows with hairline dividers — 24px on #1A1A1A
 *
 *   3. "Personal files-bro" illustration anchored top-right, rotated -15°
 *
 * Per the build plan (open decision #4) both audience tabs render the
 * same 7-bullet list until org-specific copy lands. Tab switch is wired
 * up so the tab is a real interactive control today.
 */

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

      {/* Sub-hero band — Figma 1237:1963 / 1234:1577 (151px, full-bleed) */}
      <div className="w-full border-y border-white">
        <div className="mx-auto flex h-[151px] max-w-[1440px] items-center gap-[24px] pl-[40px]">
          {bandTags.map((tag, i) => (
            <div key={tag} className="flex items-center gap-[24px]">
              <p className="whitespace-nowrap text-[clamp(28px,3.5vw,48px)] font-medium text-white">
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

      {/* Tab + 7-row card + illustration — Figma 1541:219 */}
      <div className="relative mx-auto max-w-[1440px]">
        {/* Side illustration (Group 58), pinned to top-right */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[20px] top-[177px] hidden h-[404px] w-[346px] -rotate-[15deg] lg:block"
        >
          <Image
            src="/landing/benefits-illustration.svg"
            alt=""
            width={346}
            height={404}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="px-[167px] py-[54px]">
          {/* Tabs (Figma 1541:218) — rounded only on top corners */}
          <div
            role="tablist"
            aria-label="Choose audience"
            className="flex w-fit"
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
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls="benefits-panel"
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

          {/* Body card (Figma 1541:181) */}
          <div
            id="benefits-panel"
            role="tabpanel"
            aria-labelledby="benefits-tab"
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

          {audience === "organisations" && (
            <p className="mt-4 max-w-[600px] text-sm text-white/60">
              Organisation-specific features are landing soon — for now both
              tabs share the same benefits list.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
