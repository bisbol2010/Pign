import type { ReactNode } from "react";
import { MarketingHeader } from "@/components/landing/MarketingHeader";
import { MarketingFooter } from "@/components/landing/MarketingFooter";
import { GridBackdrop } from "@/components/landing/GridBackdrop";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative bg-surface-ink text-white font-sans antialiased">
      {/* Top-anchored grid backdrop — matches the homepage hero exactly: the
          grid sits at the top of the page, scrolls away with the content (it is
          absolute, not fixed), and fades into the surface via the same gradient.
          This is a single grid that behaves identically to the homepage. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100svh] overflow-hidden">
        <GridBackdrop />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(48,48,48,0) 34%, var(--surface-ink) 94%)",
          }}
        />
      </div>
      <div className="relative z-10 flex min-h-dvh flex-col">
        <MarketingHeader />
        <main className="flex-1 flex flex-col">{children}</main>
        <MarketingFooter />
      </div>
    </div>
  );
}
