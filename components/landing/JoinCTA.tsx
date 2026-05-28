import Image from "next/image";
import Link from "next/link";
import { ComingSoonStub } from "./ComingSoonStub";

/**
 * Join CTA — Figma `1240:565` (1440 × 899).
 * Carousel center at left 269px, top 160px; arrows at top 363px; CTAs at top 646px.
 */
export function JoinCTA() {
  return (
    <section className="relative overflow-hidden bg-surface-ink text-white">
      <div className="relative mx-auto min-h-[899px] w-full max-w-[1440px]">
        <div
          aria-hidden
          className="absolute left-0 top-[80px] h-px w-full bg-white/30"
        />

        <div className="relative max-lg:px-4 max-lg:pt-24 min-[1440px]:h-[819px]">
          {/* Peek strips — desktop only */}
          <div
            aria-hidden
            className="absolute left-0 top-[160px] hidden h-[642px] w-[64px] overflow-hidden min-[1440px]:block"
          >
            <img
              src="/landing/dashboard-preview-sm.png"
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

          <div className="relative mx-auto mt-20 h-[min(50vh,562px)] w-full max-w-[902px] overflow-hidden min-[1440px]:absolute min-[1440px]:left-[269px] min-[1440px]:top-[160px] min-[1440px]:mt-0 min-[1440px]:h-[642px]">
            <img
              src="/landing/dashboard-preview-sm.png"
              alt="Pign dashboard preview"
              loading="eager"
              width={902}
              height={642}
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

          <div
            aria-hidden
            className="absolute right-0 top-[160px] hidden h-[642px] w-[64px] overflow-hidden min-[1440px]:block"
          >
            <img
              src="/landing/dashboard-preview-sm.png"
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

          <button
            type="button"
            aria-label="Previous dashboard preview"
            aria-disabled
            disabled
            title="Carousel — coming soon"
            className="absolute left-6 top-1/2 z-10 flex h-[37px] w-[57px] -translate-y-1/2 cursor-not-allowed items-center justify-center opacity-60 min-[1440px]:left-[90px] min-[1440px]:top-[363px] min-[1440px]:translate-y-0"
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
            className="absolute right-6 top-1/2 z-10 flex h-[37px] w-[57px] -translate-y-1/2 cursor-not-allowed items-center justify-center opacity-60 min-[1440px]:right-[90px] min-[1440px]:top-[363px] min-[1440px]:translate-y-0"
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

        <div className="relative flex flex-col items-center gap-[24px] px-6 pb-[100px] pt-8 text-center min-[1440px]:absolute min-[1440px]:left-1/2 min-[1440px]:top-[646px] min-[1440px]:w-full min-[1440px]:-translate-x-1/2 min-[1440px]:px-0">
          <h2 className="max-w-[384px] text-[clamp(28px,4vw,40px)] font-medium leading-normal text-white min-[1440px]:text-[40px]">
            Join the millions of users and teams
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-[24px]">
            <Link
              href="/signup"
              className="flex h-[59px] items-center justify-center bg-white px-[40px] py-[19px] text-[16px] font-bold leading-normal text-pign-black transition-colors hover:bg-grey-6"
            >
              Get started for free
            </Link>
            <ComingSoonStub className="flex h-[59px] cursor-default items-center justify-center border border-white px-[40px] py-[19px] text-[16px] font-bold text-white">
              Check out pricing
            </ComingSoonStub>
          </div>
        </div>

        <div
          aria-hidden
          className="absolute bottom-0 left-0 h-px w-full bg-white/30"
        />
      </div>
    </section>
  );
}
