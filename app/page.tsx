import type { Metadata } from "next";
import { Benefits } from "@/components/landing/Benefits";
import { FAQ } from "@/components/landing/FAQ";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { Integrations } from "@/components/landing/Integrations";
import { JoinCTA } from "@/components/landing/JoinCTA";
import { MarketingFooter } from "@/components/landing/MarketingFooter";
import { SectionDivider } from "@/components/landing/SectionDivider";

export const metadata: Metadata = {
  title: "Pign — Your digital mailbox for important documents",
  description:
    "Store it. Verify it. Trust it. Keep your important documents encrypted, organised, and verifiable with Pign.",
  openGraph: {
    title: "Pign — Your digital mailbox for important documents",
    description:
      "Store, verify, and share important documents securely. Start for free.",
  },
};

/**
 * Marketing landing page — implements Figma node `1234:1440`
 * ("Landing Page 5") at 1440px design width.
 *
 * Order matches the Figma's vertical stack:
 *   Hero → Benefits → Features → Integrations → FAQ → JoinCTA → Footer
 *
 * Whole page sits on `#161616` (surface-ink token) with white type. Sections
 * pin to a max-width of 1440px and use the exact gutters from Figma. No
 * mobile re-design is specified in this node; sections gracefully reflow
 * but remain optimised for ≥ 1024px viewports.
 */
export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-ink text-white">
      <main className="flex flex-1 flex-col">
        <Hero />
        <SectionDivider />
        <Benefits />
        <SectionDivider />
        <Features />
        <SectionDivider />
        <Integrations />
        <SectionDivider />
        <FAQ />
        <SectionDivider />
        <JoinCTA />
      </main>
      <SectionDivider />
      <MarketingFooter />
    </div>
  );
}
