import Link from "next/link";

export function MarketingHeader() {
  return (
    <header
      className="relative z-20 border-b border-white/10 bg-transparent"
      aria-label="Primary"
    >
      {/* Desktop ≥1440: Figma three-column layout */}
      <div className="relative mx-auto hidden h-[111px] w-full max-w-[1440px] min-[1440px]:block">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-[394px] w-px bg-white/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-[1046px] w-px bg-white/10"
        />

        <nav
          className="absolute left-[64px] top-1/2 flex -translate-y-1/2 items-center gap-[80px]"
          aria-label="Marketing links"
        >
          <Link href="/about" className="text-base text-white/80 transition-colors hover:text-white">
            About
          </Link>
          <Link href="/pricing" className="text-base text-white/80 transition-colors hover:text-white">
            Pricing
          </Link>
        </nav>

        <Link
          href="/"
          aria-label="Pign — home"
          className="absolute left-1/2 top-[36px] -translate-x-1/2"
        >
          <img
            src="/pign-logo.svg"
            alt="Pign"
            width={107}
            height={46}
            className="invert"
          />
        </Link>

        <div className="absolute right-[64px] top-1/2 flex -translate-y-1/2 items-center gap-[40px]">
          <Link
            href="/login"
            className="text-base font-medium text-white/80 transition-colors hover:text-white"
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

      {/* Below 1440: wrapped header */}
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 py-4 min-[1440px]:hidden">
        <nav
          className="flex items-center gap-6"
          aria-label="Marketing links"
        >
          <Link href="/about" className="text-sm text-white/80 transition-colors hover:text-white">
            About
          </Link>
          <Link href="/pricing" className="text-sm text-white/80 transition-colors hover:text-white">
            Pricing
          </Link>
        </nav>

        <Link href="/" aria-label="Pign — home">
          <img
            src="/pign-logo.svg"
            alt="Pign"
            width={107}
            height={46}
            className="invert"
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-white/80 transition-colors hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="flex h-12 items-center bg-white px-6 text-sm font-bold text-pign-black"
          >
            Create storage
          </Link>
        </div>
      </div>
    </header>
  );
}
