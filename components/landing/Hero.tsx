import Link from "next/link";
import { GridBackdrop } from "./GridBackdrop";
import { MarketingHeader } from "./MarketingHeader";

/**
 * Marketing hero — Figma node `1234:1600`.
 * Desktop (≥1440px): absolute positions from MCP.
 * Below 1024px: stacked document flow.
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

      <div className="relative z-10">
        <MarketingHeader />

        <div className="relative mx-auto w-full max-w-[1440px]">
          {/* Mobile / tablet: natural stack */}
          <div className="flex flex-col gap-6 px-6 pb-16 pt-8 max-lg:max-w-3xl min-[1440px]:hidden">
            <img
              src="/landing/mailbox-illustration.svg"
              alt=""
              width={128}
              height={113}
              className="h-[113px] w-[128px] -rotate-[8deg]"
              aria-hidden
            />
            <p className="text-[clamp(28px,3vw,41px)] font-light leading-[1.15] text-white">
              Your digital mailbox for saving important documents securely
            </p>
            <h1 className="text-[clamp(48px,9vw,128px)] font-extrabold leading-[0.875] tracking-[-0.02em] text-[#F2F2F2]">
              Connect with files, connect with friends
            </h1>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex h-[77px] items-center justify-center bg-white px-12 text-[24px] font-bold text-pign-black transition-colors hover:bg-grey-6 sm:px-[112px]"
              >
                Start for free
              </Link>
              <img
                src="/landing/paper-plane.svg"
                alt=""
                width={195}
                height={67}
                aria-hidden
                className="hidden h-[67px] w-[195px] sm:block"
              />
            </div>
          </div>

          {/* Desktop: Figma absolute layout */}
          <div className="relative hidden min-[1440px]:block min-[1440px]:h-[895px]">
            <div
              className="absolute left-[56px] top-[250px] h-[113px] w-[128px] -rotate-[8deg]"
              aria-hidden
            >
              <img
                src="/landing/mailbox-illustration.svg"
                alt=""
                width={128}
                height={113}
                fetchPriority="high"
                className="h-full w-full"
              />
            </div>

            <p className="absolute left-[64px] top-[372px] w-[590px] text-[41px] font-light leading-[1.15] text-white">
              Your digital mailbox for saving important documents securely
            </p>

            <h1 className="absolute left-[56px] top-[482px] w-[1365px] text-[128px] font-extrabold leading-[112px] tracking-[-0.02em] text-[#F2F2F2]">
              Connect with files, connect with friends
            </h1>

            <div className="absolute left-[64px] top-[722px] flex items-center gap-[40px]">
              <Link
                href="/signup"
                className="inline-flex h-[77px] items-center bg-white px-[112px] text-[24px] font-bold leading-normal text-pign-black transition-colors hover:bg-grey-6"
              >
                Start for free
              </Link>
              <img
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
      </div>
    </section>
  );
}
