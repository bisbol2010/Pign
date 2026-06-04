"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { MailAvatar } from "./MailAvatar";
import {
  deliverySnippet,
  formatMailTimestamp,
  rowPerspective,
} from "./utils";
import type { DeliveryRow } from "./types";
import type { Id } from "@/convex/_generated/dataModel";

type MailRowProps = {
  delivery: DeliveryRow;
  userId?: Id<"users">;
  striped?: boolean;
};

export function MailRow({ delivery, userId, striped }: MailRowProps) {
  const perspective = rowPerspective(delivery, userId);
  const unread = !delivery.isRead && perspective === "inbox";
  const counterparty =
    delivery.counterparty ??
    (perspective === "outbox" || perspective === "drafts"
      ? delivery.recipientEmail || "Draft"
      : delivery.recipientEmail);
  const displayName =
    counterparty.length > 18
      ? `${counterparty.slice(0, 15)}...`
      : counterparty;
  const ts = delivery.deliveredAt ?? delivery._creationTime;

  return (
    <Link
      href={`/emails/${delivery._id}`}
      className={cn(
        "flex h-[56px] items-center gap-[26px] border-b border-grey-6 px-[30px] transition-colors hover:bg-grey-7/80",
        striped && "bg-grey-7/60"
      )}
    >
      <MailAvatar label={counterparty} unread={unread} />
      <span
        className={cn(
          "w-[200px] shrink-0 truncate text-[16px]",
          unread ? "font-medium text-pign-black" : "text-grey-3"
        )}
      >
        {displayName}
      </span>
      <p
        className={cn(
          "min-w-0 flex-1 truncate text-[14px]",
          unread ? "text-grey-2" : "text-grey-3"
        )}
      >
        {deliverySnippet(delivery)}
      </p>
      <span
        className={cn(
          "shrink-0 text-right text-[12px] tabular-nums",
          unread ? "text-grey-2" : "text-grey-3"
        )}
      >
        {formatMailTimestamp(ts)}
      </span>
    </Link>
  );
}
