"use client";

import Link from "next/link";
import { SettingsFieldRow } from "./SettingsFieldRow";

type InfoTab = "Data and privacy" | "Security" | "Email" | "Notification";

type SettingsInfoTabProps = {
  tab: InfoTab;
  displayEmail: string;
};

/**
 * Honestly-scoped settings panels for areas that do not yet have dedicated
 * backends. Each panel surfaces the real account state and links to the
 * existing flows instead of showing fake toggles.
 */
export function SettingsInfoTab({ tab, displayEmail }: SettingsInfoTabProps) {
  if (tab === "Data and privacy") {
    return (
      <Panel
        title="Data and privacy"
        description="Your documents are private to your account. Verification records are stored alongside each file so you can prove authenticity later."
      >
        <SettingsFieldRow label="Account email:">
          <span className="break-all">{displayEmail || "—"}</span>
        </SettingsFieldRow>
        <SettingsFieldRow label="Your files:">
          <span className="font-normal text-grey-2">
            Manage and export individual documents from{" "}
            <Link href="/dashboard" className="text-pign-black underline">
              My files
            </Link>
            .
          </span>
        </SettingsFieldRow>
        <SettingsFieldRow label="Deleted items:">
          <span className="font-normal text-grey-2">
            Removed files stay recoverable in{" "}
            <Link href="/trash" className="text-pign-black underline">
              Trash
            </Link>{" "}
            until you empty it.
          </span>
        </SettingsFieldRow>
      </Panel>
    );
  }

  if (tab === "Security") {
    return (
      <Panel
        title="Security"
        description="Pign uses a secure email-based sign-in. Keep access to your inbox to keep your account safe."
      >
        <SettingsFieldRow label="Sign-in method:">
          <span className="font-normal text-grey-2">Email magic link</span>
        </SettingsFieldRow>
        <SettingsFieldRow label="Account email:">
          <span className="break-all">{displayEmail || "—"}</span>
        </SettingsFieldRow>
        <SettingsFieldRow label="Sessions:">
          <span className="font-normal text-grey-2">
            You are signed in on this device. Signing out ends this session
            everywhere it is no longer active.
          </span>
        </SettingsFieldRow>
      </Panel>
    );
  }

  if (tab === "Email") {
    return (
      <Panel
        title="Email"
        description="Send verified documents and track deliveries from your Pign mailbox."
      >
        <SettingsFieldRow label="Mailbox:">
          <span className="font-normal text-grey-2">
            Open your{" "}
            <Link href="/emails" className="text-pign-black underline">
              inbox and sent items
            </Link>
            .
          </span>
        </SettingsFieldRow>
        <SettingsFieldRow label="Compose:">
          <span className="font-normal text-grey-2">
            Start a new message from{" "}
            <Link
              href="/emails/compose"
              className="text-pign-black underline"
            >
              Compose
            </Link>
            .
          </span>
        </SettingsFieldRow>
        <SettingsFieldRow label="From address:">
          <span className="break-all">{displayEmail || "—"}</span>
        </SettingsFieldRow>
      </Panel>
    );
  }

  return (
    <Panel
      title="Notification"
      description="You are notified when documents are shared with you and when verifications complete."
    >
      <SettingsFieldRow label="In-app:">
        <span className="font-normal text-grey-2">
          Review everything in your{" "}
          <Link href="/notifications" className="text-pign-black underline">
            notifications
          </Link>
          .
        </span>
      </SettingsFieldRow>
      <SettingsFieldRow label="Share alerts:">
        <span className="font-normal text-grey-2">
          On — you receive a notification each time a file is shared with you.
        </span>
      </SettingsFieldRow>
      <SettingsFieldRow label="Email alerts:">
        <span className="font-normal text-grey-2">
          Delivered to {displayEmail || "your account email"}.
        </span>
      </SettingsFieldRow>
    </Panel>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-1 text-[18px] font-medium text-pign-black">{title}</h2>
      <p className="mb-4 max-w-[640px] text-[14px] text-grey-3">{description}</p>
      <div className="border-t border-grey-6">{children}</div>
    </section>
  );
}
