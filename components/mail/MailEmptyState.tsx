"use client";

import type { MailTab } from "./types";

const COPY: Record<MailTab, { title: string; body: string }> = {
  all: {
    title: "No emails yet",
    body: "Create an email to send documents to a Pign mailbox or external address.",
  },
  inbox: {
    title: "Inbox is empty",
    body: "Deliveries from other Pign users will appear here.",
  },
  outbox: {
    title: "Outbox is empty",
    body: "Sent and pending deliveries will appear here.",
  },
  drafts: {
    title: "No drafts",
    body: "Save a draft while composing to finish it later.",
  },
};

export function MailEmptyState({ tab }: { tab: MailTab }) {
  const { title, body } = COPY[tab];
  return (
    <div className="flex flex-col items-center justify-center px-[30px] py-[80px] text-center">
      <p className="text-[16px] font-medium text-pign-black">{title}</p>
      <p className="mt-2 max-w-[360px] text-[14px] text-grey-3">{body}</p>
    </div>
  );
}
