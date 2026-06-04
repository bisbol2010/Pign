import Link from "next/link";
import { GridBackdrop } from "./GridBackdrop";
import { MarketingHeader } from "./MarketingHeader";

/**
 * Marketing hero — Figma node `1234:1600`.
 * One responsive layout at all widths: a full-height (min-h-dvh) column with
 * the content group and CTA bottom-anchored (justify-end), a fixed 24px gap
 * between the headline and the button, and 80px below the button. Typography
 * scales via clamp() up to the Figma desktop sizes (eyebrow 41px, H1 128px).
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface-ink text-white">
      <GridBackdrop />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(48,48,48,0) 34%, var(--surface-ink) 94%)",
        }}
      />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <MarketingHeader />

        <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
          {/*
            One responsive layout for all widths: a full-height column whose
            content group and CTA are anchored to the bottom (justify-end). The
            gap between the headline block and the button is a fixed 24px
            (gap-6) on every device, the CTA keeps 80px (pb-20) below it, and the
            flexible space accumulates above the content as the viewport grows.
            On very short viewports the content overflows and the page scrolls
            (CTA below the fold), which is the unavoidable lower bound.
          */}
          <div className="flex flex-1 flex-col justify-end gap-6 px-6 pb-20 pt-8 max-lg:max-w-3xl lg:px-10 min-[1440px]:px-[56px]">
            <div className="flex flex-col gap-6">
              <img
                src="/landing/mailbox-illustration.svg"
                alt=""
                width={128}
                height={113}
                fetchPriority="high"
                className="h-[113px] w-[128px] -rotate-[8deg]"
                aria-hidden
              />
              <p className="text-[clamp(28px,3vw,41px)] font-light leading-[1.15] text-white">
                Your digital mailbox for important documents
              </p>
              <h1 className="text-[clamp(48px,9vw,128px)] font-extrabold leading-[0.875] tracking-[-0.02em] text-[#F2F2F2]">
                Store it. Verify it. Trust it.
              </h1>
              <p className="max-w-[900px] text-[clamp(18px,2.2vw,32px)] font-light leading-[1.25] text-white/90">
                Pign keeps your official letters, contracts and records encrypted,
                organised, and verifiable — and lets you share them with a single
                secure link.
              </p>
            </div>
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-[6px]">
              <Link
                href="/signup"
                className="inline-flex h-[77px] items-center justify-center bg-white px-12 text-[24px] font-bold text-pign-black transition-colors hover:bg-grey-6 sm:px-[112px]"
              >
                Start for free
              </Link>
              <PaperPlaneTrail className="relative hidden sm:inline-block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PaperPlaneTrail({ className = "" }: { className?: string }) {
  return (
    <span
      className={`h-[67px] w-[195px] shrink-0 ${className}`}
      aria-hidden
    >
      <img
        src="/landing/paper-plane.svg"
        alt=""
        width={195}
        height={67}
        className="h-full w-full"
      />
      <img
        src="/landing/paper-plane-glyph.svg"
        alt=""
        width={54}
        height={54}
        className="absolute -top-[11px] left-[211px] h-[54px] w-[54px]"
      />
    </span>
  );
}
