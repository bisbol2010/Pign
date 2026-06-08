"use client";

import { Suspense } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { AccountSettingsView } from "@/components/settings";

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Account Settings" />
      <Suspense fallback={null}>
        <AccountSettingsView />
      </Suspense>
    </>
  );
}
