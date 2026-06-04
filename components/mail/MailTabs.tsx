"use client";

import { cn } from "@/lib/utils";
import type { MailTab } from "./types";

const TABS: { id: MailTab; label: string; dot?: boolean }[] = [
  { id: "all", label: "All" },
  { id: "inbox", label: "Inbox", dot: true },
  { id: "outbox", label: "Outbox" },
  { id: "drafts", label: "Drafts" },
];

type MailTabsProps = {
  activeTab: MailTab;
  onTabChange: (tab: MailTab) => void;
};

export function MailTabs({ activeTab, onTabChange }: MailTabsProps) {
  return (
    <div className="flex items-center gap-[18px]">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative text-[18px] transition-colors",
            activeTab === tab.id
              ? "font-medium text-pign-black"
              : "text-grey-5 hover:text-grey-3"
          )}
        >
          {tab.label}
          {tab.dot && activeTab !== "inbox" && (
            <span
              className="absolute -right-[10px] top-[2px] size-[10px] rounded-full bg-pign-black"
              aria-hidden
            />
          )}
          {tab.dot && activeTab === "inbox" && (
            <span
              className="absolute -right-[10px] top-[2px] size-[10px] rounded-full bg-pign-black"
              aria-hidden
            />
          )}
        </button>
      ))}
    </div>
  );
}
