import Image from "next/image";
import Link from "next/link";
import { ComingSoonStub } from "./ComingSoonStub";

/**
 * Join CTA section — Figma node `1240:565` (1440 × 899).
 *
 * Layout (top → bottom):
 *   1. Hairline rule at y=80
 *   2. Dashboard-mockup carousel: peek-left | centered | peek-right
 *      (currently using the same preview tile per open decision #2 —
 *      will diversify when dedicated mockups land)
 *   3. Curved nav arrows (Figma `arrow custom`) on either edge of the row
 *   4. Centered headline + two CTAs
 *   5. Closing hairline rule at y=899
 */
export function JoinCTA() {
  return (
    <section className="relative overflow-hidden bg-surface-ink text-white">
      <div className="mx-auto max-w-[1440px]">
        {/* Top hairline */}
        <div aria-hidden className="h-px w-full bg-white/30" />

        {/* Carousel row */}
        <div className="relative h-[642px] w-full overflow-hidden">
          {/* Peek-left preview (cropped to the rightmost 64px of a mockup) */}
          <div
            aria-hidden
            className="absolute left-0 top-[80px] h-[562px] w-[64px] overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> avoids Next/Image aspect-ratio warning for the clipped mockup */}
            <img
              src="/landing/dashboard-preview.png"
              alt=""
              className="absolute left-[-838px] top-0 h-full w-[902px] max-w-none object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0) 0%, var(--surface-ink) 72%, var(--surface-ink) 84%)",
              }}
            />
          </div>

          {/* Centered, prominent mockup */}
          <div className="absolute left-1/2 top-[80px] h-[562px] w-[902px] -translate-x-1/2 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> avoids Next/Image aspect-ratio warning for the cover-cropped mockup */}
            <img
              src="/landing/dashboard-preview.png"
              alt="Pign dashboard preview"
              loading="eager"
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0) 0%, var(--surface-ink) 72%, var(--surface-ink) 84%)",
              }}
            />
          </div>

          {/* Peek-right preview (cropped to the leftmost 64px of a mockup) */}
          <div
            aria-hidden
            className="absolute right-0 top-[80px] h-[562px] w-[64px] overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> avoids Next/Image aspect-ratio warning for the clipped mockup */}
            <img
              src="/landing/dashboard-preview.png"
              alt=""
              className="absolute left-0 top-0 h-full w-[902px] max-w-none object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0) 0%, var(--surface-ink) 72%, var(--surface-ink) 84%)",
              }}
            />
          </div>

          {/* Carousel navigation arrows */}
          <button
            type="button"
            aria-label="Previous dashboard preview"
            aria-disabled
            disabled
            title="Carousel — coming soon"
            className="absolute left-[90px] top-[283px] flex h-[37px] w-[57px] cursor-not-allowed items-center justify-center opacity-60"
          >
            <Image
              src="/landing/carousel-arrow-left.svg"
              alt=""
              aria-hidden
              width={57}
              height={37}
            />
          </button>
          <button
            type="button"
            aria-label="Next dashboard preview"
            aria-disabled
            disabled
            title="Carousel — coming soon"
            className="absolute right-[90px] top-[283px] flex h-[37px] w-[57px] cursor-not-allowed items-center justify-center opacity-60"
          >
            <Image
              src="/landing/carousel-arrow-right.svg"
              alt=""
              aria-hidden
              width={57}
              height={37}
              className="rotate-180"
            />
          </button>
        </div>

        {/* Headline + CTA row */}
        <div className="flex flex-col items-center gap-[24px] pb-[100px] pt-[24px] text-center">
          <h2 className="max-w-[384px] text-[clamp(28px,4vw,40px)] font-medium leading-[1.1] text-white">
            Join the millions of users and teams
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-[24px]">
            <Link
              href="/signup"
              className="flex h-[59px] items-center justify-center bg-white px-[40px] text-[16px] font-bold text-pign-black transition-colors hover:bg-grey-6"
            >
              Get started for free
            </Link>
            <ComingSoonStub className="flex h-[59px] cursor-default items-center justify-center border border-white px-[40px] text-[16px] font-bold text-white">
              Check out pricing
            </ComingSoonStub>
          </div>
        </div>

        {/* Bottom hairline */}
        <div aria-hidden className="h-px w-full bg-white/30" />
      </div>
    </section>
  );
}
