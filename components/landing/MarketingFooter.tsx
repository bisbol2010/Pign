"use client";

import Link from "next/link";
import { ComingSoonStub } from "./ComingSoonStub";
import { Instagram, Twitter, Facebook, Slack, Linkedin, ArrowUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Social = { label: string; icon: LucideIcon };

const links = [
  { label: "Pricing", href: "/pricing" },
  { label: "Terms of use", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Help & support", href: "/help" },
];

const socials: Social[] = [
  { label: "Instagram", icon: Instagram },
  { label: "Twitter", icon: Twitter },
  { label: "Facebook", icon: Facebook },
  { label: "Slack", icon: Slack },
  { label: "LinkedIn", icon: Linkedin },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function MarketingFooter() {
  return (
    <footer className="relative bg-surface-ink text-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-8 min-[1440px]:h-[136px] min-[1440px]:px-0 min-[1440px]:py-0">
        <div className="flex flex-col gap-8 min-[1440px]:grid min-[1440px]:h-[136px] min-[1440px]:grid-cols-[1fr_auto_auto] min-[1440px]:items-center">
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-6 min-[1440px]:gap-[40px] min-[1440px]:pl-[57px]"
          >
            {links.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[20px] font-medium leading-none text-white transition-colors hover:text-white/80"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-8 border-white/30 min-[1440px]:h-full min-[1440px]:gap-[40px] min-[1440px]:border-l min-[1440px]:px-[57px]">
            {socials.map(({ label, icon: Icon }) => (
              <ComingSoonStub
                key={label}
                className="flex h-[24px] w-[24px] cursor-default items-center justify-center text-white"
              >
                <Icon size={20} strokeWidth={1.75} aria-hidden />
                <span className="sr-only">{label}</span>
              </ComingSoonStub>
            ))}
          </div>

          <div className="flex items-center min-[1440px]:h-full min-[1440px]:border-l min-[1440px]:border-white/30 min-[1440px]:px-[57px]">
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
            >
              <ArrowUp size={22} strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
