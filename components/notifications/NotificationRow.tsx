"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatNotificationTimestamp, notificationHref } from "./utils";
import type { NotificationRow } from "./types";

type NotificationRowProps = {
  notification: NotificationRow;
  onOpen?: (notification: NotificationRow) => void;
  compact?: boolean;
};

export function NotificationRowItem({
  notification,
  onOpen,
  compact = false,
}: NotificationRowProps) {
  const href = notificationHref(notification);
  const unread = !notification.isRead;

  const content = (
    <>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-[14px] leading-[149%]",
            unread ? "font-medium text-grey-2" : "text-grey-2"
          )}
        >
          <span className={cn(unread && "font-medium text-pign-black")}>
            {notification.title}
          </span>
          {notification.body ? (
            <span className="font-normal text-grey-2"> — {notification.body}</span>
          ) : null}
        </p>
      </div>
      <span
        className={cn(
          "shrink-0 text-[12px] tabular-nums",
          unread ? "text-grey-2" : "text-grey-3"
        )}
      >
        {formatNotificationTimestamp(notification._creationTime)}
      </span>
    </>
  );

  const className = cn(
    "flex w-full items-start justify-between gap-4 border-b border-grey-6 text-left transition-colors",
    compact ? "px-4 py-3" : "px-[30px] py-4",
    unread ? "bg-grey-7/60" : "bg-white",
    href && "hover:bg-grey-7/80"
  );

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        onClick={() => onOpen?.(notification)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => onOpen?.(notification)}
    >
      {content}
    </button>
  );
}
