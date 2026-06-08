"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  SettingsTabs,
  type SettingsTab,
} from "./SettingsTabs";
import { SettingsProfileTab } from "./SettingsProfileTab";
import { SettingsBillingTab } from "./SettingsBillingTab";
import { SettingsInfoTab } from "./SettingsInfoTab";

export function AccountSettingsView() {
  const user = useCurrentUser();
  const searchParams = useSearchParams();
  const billingParam = searchParams.get("billing");
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    billingParam ? "Billing" : "Profile"
  );
  // Adjust the active tab during render when the billing param changes (e.g.
  // navigating here from the "Upgrade plan" action). This avoids a setState
  // inside an effect, per the React docs' "adjust state on prop change" pattern.
  const [seenBillingParam, setSeenBillingParam] = useState(billingParam);
  if (billingParam && billingParam !== seenBillingParam) {
    setSeenBillingParam(billingParam);
    setActiveTab("Billing");
  }

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-grey-5 border-t-pign-black" />
      </div>
    );
  }

  const displayName = user?.name ?? "User";
  const displayEmail = user?.email ?? "";

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="border-b border-grey-6 bg-white/60 px-[30px] pb-0 pt-[25px] shadow-[0px_4px_4px_-2px_rgba(26,26,26,0.2)]">
        <div className="max-w-[1106px]">
          <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      <div className="px-[30px] py-8">
        <div className="max-w-[1106px]">
          {billingParam === "success" && activeTab === "Billing" ? (
            <div className="mb-[20px] border border-verify-green/40 bg-verify-green/10 px-[16px] py-[12px] text-[14px] text-verify-green">
              Payment successful. Your plan will update shortly.
            </div>
          ) : null}
          {activeTab === "Profile" && user ? (
            <SettingsProfileTab
              displayName={displayName}
              displayEmail={displayEmail}
              pignHandle={user.pignHandle}
              avatarUrl={user.avatarUrl}
              language={user.language}
              dateFormat={user.dateFormat}
              timezone={user.timezone}
              timezoneAuto={user.timezoneAuto}
            />
          ) : null}
          {activeTab === "Billing" ? <SettingsBillingTab /> : null}
          {activeTab !== "Profile" && activeTab !== "Billing" ? (
            <SettingsInfoTab tab={activeTab} displayEmail={displayEmail} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
