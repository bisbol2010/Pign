import Image from "next/image";

/**
 * Features section — Figma node `1234:1464` (1440 × 1050).
 *
 * Three stacked bands inside one section:
 *
 *   1. H2 + decorative mailbox  ("Everything you need, less of what you don't" 88px)
 *   2. Three pill labels — Smart storage / File verification / Secure & encrypted
 *   3. Showcase card with a wave background (Vector 8):
 *        - left half: folder + document + lightbulb composite
 *        - right half: "Smart storage" headline + body
 *        - curved arrow connector between halves
 *        - faded "File verification" teaser below as a hint of more content
 *
 * Sizes/positions track Figma node geometry at the 1440px design width.
 */

const pillLabels = [
  "Smart storage",
  "File verification",
  "Secure & encrypted",
];

export function Features() {
  return (
    <section
      id="features"
      className="relative bg-surface-ink text-white"
      aria-labelledby="features-heading"
    >
      <div className="relative mx-auto max-w-[1440px] py-[80px]">
        {/* Headline + decorative mailbox — Figma 1240:468 */}
        <div className="relative flex items-start justify-between gap-[40px] px-[64px]">
          <h2
            id="features-heading"
            className="max-w-[1100px] font-medium leading-[1.05] text-white text-[clamp(40px,7vw,88px)]"
          >
            Everything you need, less
            <br />
            of what you don&rsquo;t
          </h2>
          <Image
            src="/landing/mailbox-illustration.svg"
            alt=""
            aria-hidden
            width={128}
            height={113}
            className="hidden h-[113px] w-[128px] shrink-0 -rotate-[8deg] lg:block"
          />
        </div>

        {/* Three pill labels — Figma 1240:472 */}
        <div className="mt-[60px] flex flex-wrap gap-x-[80px] gap-y-[24px] px-[64px]">
          {pillLabels.map((label) => (
            <div key={label} className="flex items-center gap-[11px]">
              <span
                aria-hidden
                className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white"
              >
                <span className="h-[14px] w-[14px] rounded-full bg-pign-black" />
              </span>
              <span className="text-[24px] font-medium tracking-[-0.01em] text-white">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Showcase card with wave background — Figma 1240:467 */}
        <div className="relative mx-auto mt-[60px] h-[647px] w-full max-w-[1295px] overflow-hidden px-[64px] lg:px-0">
          <Image
            src="/landing/features-wave-bg.svg"
            alt=""
            aria-hidden
            width={1295}
            height={597}
            className="pointer-events-none absolute inset-x-0 top-0 h-auto w-full select-none"
          />

          {/* Left composite — folder + document + lightbulb (Figma 1234:1465) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[110px] top-[125px] hidden lg:block"
          >
            {/* Folder (Group 61) — top of composite */}
            <Image
              src="/landing/features-folder.svg"
              alt=""
              width={105}
              height={114}
              className="absolute -left-2 top-0 h-[173px] w-[170px] rotate-[12deg]"
            />
            {/* Document (Group 60) — bottom-left of composite */}
            <Image
              src="/landing/features-document.svg"
              alt=""
              width={105}
              height={114}
              className="absolute left-[40px] top-[240px] h-[150px] w-[150px] -rotate-[6deg]"
            />
          </div>

          {/* Right side: headline + body — Figma 1234:1494 */}
          <div className="absolute left-[64px] top-[142px] flex max-w-[660px] flex-col gap-[32px] text-white lg:left-[580px]">
            <h3 className="text-[clamp(36px,5vw,60px)] font-medium leading-[1] tracking-[-0.01em]">
              Smart storage
            </h3>
            <p className="text-[clamp(20px,2.5vw,32px)] font-light leading-[1.43] text-white">
              Smart file management system for saving important files,
              efficient organization and easy access to items, saving time
              and reducing clutter.
            </p>
          </div>

          {/* Curved arrow connector — Figma 1237:2043 */}
          <Image
            src="/landing/curved-arrow.svg"
            alt=""
            aria-hidden
            width={195}
            height={67}
            className="pointer-events-none absolute left-[330px] top-[440px] hidden h-[67px] w-[195px] -rotate-[6deg] lg:block"
          />

          {/* "File verification" teaser — Figma 1240:466 (faded preview of next card) */}
          <div className="absolute left-[64px] top-[540px] hidden w-[634px] lg:left-[580px] lg:block">
            <p className="text-[clamp(28px,4vw,48px)] font-medium leading-[1] tracking-[-0.01em] text-white/40">
              File verification
            </p>
            <p className="mt-[23px] text-[clamp(18px,2.2vw,32px)] font-light leading-[1.43] text-white/10">
              Junk filtering for the efficient and effective removal of
              unwanted or spam messages from your inbox.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
