"use client";

import { TopBar } from "@/components/layout/TopBar";
import { ComposeMail } from "@/components/mail";

export default function ComposeEmailPage() {
  return (
    <>
      <TopBar title="Emails" />
      <ComposeMail />
    </>
  );
}
