import Link from "next/link";
import { DashboardCarousel } from "./DashboardCarousel";
import { DASHBOARD_SLIDES } from "./dashboard-slides";

/**
 * Join CTA — Figma `1240:565` (1440 × 899).
 * Carousel center at left 269px, top 160px; arrows at top 363px; CTAs at top 646px.
 */
export function JoinCTA() {
  return (
    <section className="relative overflow-hidden bg-surface-ink text-white">
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center min-[1440px]:min-h-[899px]">
        <div className="relative w-full max-lg:px-4 max-lg:pt-24 min-[1440px]:h-[819px]">
          <DashboardCarousel slides={DASHBOARD_SLIDES} />
        </div>

        <div className="relative z-10 flex w-full flex-col items-center gap-[24px] px-6 pb-[80px] pt-8 text-center min-[1440px]:-mt-[173px] min-[1440px]:px-0">
          <h2 className="max-w-[384px] text-[clamp(28px,4vw,40px)] font-medium leading-normal text-white min-[1440px]:text-[40px]">
            Your important documents deserve a better home
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-[24px]">
            <Link
              href="/signup"
              className="flex h-[59px] items-center justify-center bg-white px-[40px] py-[19px] text-[16px] font-bold leading-normal text-pign-black transition-colors hover:bg-grey-6"
            >
              Get started for free
            </Link>
            <Link
              href="/pricing"
              className="flex h-[59px] items-center justify-center border border-white px-[40px] py-[19px] text-[16px] font-bold text-white transition-colors hover:bg-white/10"
            >
              See pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
