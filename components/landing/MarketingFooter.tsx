"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Twitter, Facebook, Slack, Linkedin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Marketing footer — Figma node `1240:526` (1440 × 136).
 *
 * Three columns separated by two vertical white rules (Lines 174):
 *
 *   ┌──────────────────────────┬──────────────┬──────┐
 *   │ Pricing  Terms  Privacy  │ ◯ ◯ ◯ ◯ ◯   │  ↑   │
 *   │  Help & support          │ socials      │ top  │
 *   └──────────────────────────┴──────────────┴──────┘
 *
 * Implemented with grid to preserve the Figma column proportions at 1440px
 * while still reflowing on narrower viewports.
 */

type Social = { href: string; label: string; icon: LucideIcon };

const links = [
  { href: "#", label: "Pricing" },
  { href: "#", label: "Terms of use" },
  { href: "#", label: "Privacy" },
  { href: "#", label: "Help & support" },
];

const socials: Social[] = [
  { href: "#", label: "Instagram", icon: Instagram },
  { href: "#", label: "Twitter", icon: Twitter },
  { href: "#", label: "Facebook", icon: Facebook },
  { href: "#", label: "Slack", icon: Slack },
  { href: "#", label: "LinkedIn", icon: Linkedin },
];

function scrollToTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export function MarketingFooter() {
  return (
    <footer className="relative bg-surface-ink text-white">
      <div className="mx-auto grid h-[136px] w-full max-w-[1440px] grid-cols-1 items-center md:grid-cols-[1fr_auto_auto] md:gap-x-0">
        {/* Left: link row */}
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-[40px] pl-[57px]"
        >
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-[20px] font-medium leading-[1] text-white transition-colors hover:opacity-80"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Middle: social icons (with leading divider on md+) */}
        <div className="hidden h-full items-center gap-[40px] border-l border-white/30 px-[57px] md:flex">
          {socials.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className="flex h-[24px] w-[24px] items-center justify-center text-white transition-colors hover:opacity-80"
            >
              <Icon size={20} strokeWidth={1.75} aria-hidden />
            </Link>
          ))}
        </div>

        {/* Right: scroll-to-top arrow (with leading divider on md+) */}
        <div className="hidden h-full items-center border-l border-white/30 px-[57px] md:flex">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex h-[57px] w-[37px] items-center justify-center text-white transition-opacity hover:opacity-80"
          >
            <Image
              src="/landing/footer-up-arrow.svg"
              alt=""
              aria-hidden
              width={37}
              height={57}
              className="h-full w-auto rotate-90"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
