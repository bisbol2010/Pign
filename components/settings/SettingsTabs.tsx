"use client";

import { cn } from "@/lib/utils";

export const SETTINGS_TABS = [
  "Profile",
  "Billing",
  "Data and privacy",
  "Security",
  "Email",
  "Notification",
] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number];

type SettingsTabsProps = {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
};

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="flex gap-[24px] overflow-x-auto border-b border-grey-6 sm:gap-[37px]">
      {SETTINGS_TABS.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={cn(
              "relative shrink-0 whitespace-nowrap pb-3 text-[16px] transition-colors",
              isActive
                ? "font-medium text-pign-black"
                : "text-grey-4 hover:text-pign-black"
            )}
          >
            {tab}
            {isActive ? (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-pign-black" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
