import Image from "next/image";
import Link from "next/link";
import { GridBackdrop } from "./GridBackdrop";
import { MarketingHeader } from "./MarketingHeader";

/**
 * Marketing hero — Figma node `1234:1600` (1440 × 895 visible area).
 *
 * Layout (top → bottom):
 *   - MarketingHeader (111px) on transparent grid backdrop
 *   - Mailbox illustration (Figma `undraw_mailbox_re_dvds`, ~128×113, rotate -8°)
 *     pinned at left=56px, top≈250px
 *   - Eyebrow text at left=64px, top≈372px: "Your digital mailbox..." 41px
 *   - H1 at left=56px, top≈482px: "Connect with files, connect with friends" 128px / lh 112px
 *   - "Start for free" CTA + paper-plane illustration at top≈722px
 *
 * Bottom of the section uses a radial gradient to fade the grid into the
 * solid ink colour, matching Figma's `Rectangle 724` overlay.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface-ink text-white">
      <GridBackdrop />

      {/* Bottom-fading vignette (mirrors Figma Rectangle 724) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(48,48,48,0) 34%, var(--surface-ink) 94%)",
        }}
      />

      <div className="relative z-10">
        <MarketingHeader />

        <div className="relative mx-auto h-[784px] w-full max-w-[1440px]">
          {/* Mailbox illustration — Figma 1234:1951, rotated -8° */}
          <div
            className="absolute left-[56px] top-[155px] h-[113px] w-[128px] -rotate-[8deg]"
            aria-hidden
          >
            <Image
              src="/landing/mailbox-illustration.svg"
              alt=""
              width={128}
              height={113}
              priority
              className="h-full w-full"
            />
          </div>

          {/* Eyebrow / subtitle — Figma 1234:1656 */}
          <p className="absolute left-[64px] top-[278px] w-[590px] text-[clamp(28px,3vw,41px)] font-light leading-[1.15] text-white">
            Your digital mailbox for saving important documents securely
          </p>

          {/* Display headline — Figma 1234:1655 (128px / 112px line-height) */}
          <h1 className="absolute left-[56px] top-[388px] w-[1365px] text-[clamp(64px,9vw,128px)] font-extrabold leading-[0.875] tracking-[-0.02em] text-[#F2F2F2]">
            Connect with files, connect with friends
          </h1>

          {/* CTA row — Figma 1234:1657 (Start for free) + 1234:1950 (paper plane vector) */}
          <div className="absolute left-[64px] top-[628px] flex items-center gap-[40px]">
            <Link
              href="/signup"
              className="inline-flex h-[77px] items-center bg-white px-[112px] text-[24px] font-bold text-pign-black transition-colors hover:bg-grey-6"
            >
              Start for free
            </Link>

            {/* Paper plane vector (Figma 1234:1950, 195×67) */}
            <Image
              src="/landing/paper-plane.svg"
              alt=""
              width={195}
              height={67}
              aria-hidden
              className="h-[67px] w-[195px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
