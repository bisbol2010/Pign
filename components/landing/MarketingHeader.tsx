import Link from "next/link";

/**
 * Marketing header — Figma `1234:1600` top row.
 *
 * Three-column layout (111px tall) on top of the hero:
 *
 *   About | Pricing   ┃   Pign (logo)   ┃   Login   [Create storage]
 *
 * Column dividers (Lines 157 / 158) sit at x = 394 and x = 1046 in the
 * 1440px design canvas. The header is transparent so the hero's grid
 * backdrop reads through.
 */
export function MarketingHeader() {
  return (
    <header
      className="relative z-20 h-[111px] border-b border-white/10"
      aria-label="Primary"
    >
      <div className="relative mx-auto h-full w-full max-w-[1440px]">
        {/* Column dividers (match Figma Line 157 / Line 158 at x = 394, 1046) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-[394px] w-px bg-white/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-[1046px] w-px bg-white/10"
        />

        {/* Left column: About / Pricing links (Figma 2688:543 / 2688:542) */}
        <nav
          className="absolute left-[64px] top-1/2 -translate-y-1/2 flex items-center gap-[80px]"
          aria-label="Marketing links"
        >
          <Link
            href="#"
            aria-disabled
            title="Coming soon"
            className="text-base text-white/80 transition-colors hover:text-white"
          >
            About
          </Link>
          <Link
            href="#"
            aria-disabled
            title="Coming soon"
            className="text-base text-white/80 transition-colors hover:text-white"
          >
            Pricing
          </Link>
        </nav>

        {/* Center column: Pign logo (Figma 1234:1648), ~107×46 */}
        <Link
          href="/"
          aria-label="Pign — home"
          className="absolute left-1/2 top-[36px] -translate-x-1/2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- vector logo; Next/Image adds no value for SVGs and triggers spurious aspect-ratio warnings */}
          <img
            src="/pign-logo.svg"
            alt="Pign"
            width={107}
            height={46}
            className="invert"
          />
        </Link>

        {/* Right column: Login + Create storage CTA */}
        <div className="absolute right-[64px] top-1/2 -translate-y-1/2 flex items-center gap-[40px]">
          <Link
            href="/login"
            className="text-base text-white/80 transition-colors hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="flex h-[56px] items-center bg-white px-[43px] text-base font-bold text-pign-black transition-colors hover:bg-grey-6"
          >
            Create storage
          </Link>
        </div>
      </div>
    </header>
  );
}
