"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { NotificationList } from "./NotificationList";
import type { NotificationRow } from "./types";

type NotificationDropdownProps = {
  notifications: NotificationRow[];
  onClose: () => void;
  onOpenNotification: (notification: NotificationRow) => void;
  loading?: boolean;
};

export function NotificationDropdown({
  notifications,
  onClose,
  onOpenNotification,
  loading = false,
}: NotificationDropdownProps) {
  const isEmpty = !loading && notifications.length === 0;

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-[378px] overflow-hidden rounded-[4px] border border-grey-6 bg-white shadow-[0px_4px_7px_0px_rgba(179,179,179,0.3)]">
      <div className="flex items-center justify-between border-b border-grey-6 px-4 py-3">
        <p className="text-[18px] font-medium text-pign-black">Notification</p>
        <button
          type="button"
          onClick={onClose}
          className="flex size-6 items-center justify-center text-pign-black transition-opacity hover:opacity-70"
          aria-label="Close notifications"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      {loading ? (
        <div className="px-4 py-3" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="size-[36px] shrink-0 animate-pulse rounded-full bg-grey-6" />
              <div className="min-w-0 flex-1">
                <div className="mb-2 h-[12px] w-1/2 animate-pulse rounded bg-grey-6" />
                <div className="h-[10px] w-3/4 animate-pulse rounded bg-grey-6" />
              </div>
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        <p className="px-4 py-8 text-center text-[14px] text-grey-3">
          No notifications yet
        </p>
      ) : (
        <div className="max-h-[420px] overflow-y-auto">
          <NotificationList
            notifications={notifications}
            onOpen={onOpenNotification}
            compact
          />
        </div>
      )}

      <div className="border-t border-grey-6 px-4 py-3 text-right">
        <Link
          href="/notifications"
          onClick={onClose}
          className="text-[14px] text-grey-2 transition-colors hover:text-pign-black"
        >
          View all
        </Link>
      </div>
    </div>
  );
}
