"use client";

import { TopBar } from "@/components/layout/TopBar";
import {
  NotificationEmptyState,
  NotificationHeader,
  NotificationList,
} from "@/components/notifications";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { NotificationRow } from "@/components/notifications";
import { useFileActionsContext } from "@/components/file-actions";

export default function NotificationsPage() {
  const notifications = useQuery(api.notifications.list, { limit: 50 });
  const unreadCount = useQuery(api.notifications.unreadCount);
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const { showToast } = useFileActionsContext();

  const handleOpen = async (notification: NotificationRow) => {
    if (notification.isRead) return;
    try {
      await markRead({ id: notification._id });
    } catch {
      showToast({ message: "Couldn't update notification.", type: "error" });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      showToast({ message: "All notifications marked read", type: "success" });
    } catch {
      showToast({ message: "Couldn't mark all as read.", type: "error" });
    }
  };

  const isLoading = notifications === undefined;
  const isEmpty = notifications !== undefined && notifications.length === 0;

  return (
    <>
      <TopBar title="Notifications" />
      <div className="flex flex-1 flex-col overflow-y-auto pb-10">
        <NotificationHeader
          showMarkAllRead={(unreadCount ?? 0) > 0}
          onMarkAllRead={handleMarkAllRead}
        />
        <div className="mt-[16px] max-w-[870px]">
          {isLoading ? <NotificationListSkeleton /> : null}
          {isEmpty ? <NotificationEmptyState /> : null}
          {notifications && notifications.length > 0 ? (
            <NotificationList
              notifications={notifications}
              onOpen={handleOpen}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}

function NotificationListSkeleton() {
  return (
    <div className="px-[30px]" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-[16px] border-b border-grey-6 py-[18px]"
        >
          <div className="size-[40px] shrink-0 animate-pulse rounded-full bg-grey-6" />
          <div className="min-w-0 flex-1">
            <div className="mb-[8px] h-[14px] w-1/3 animate-pulse rounded bg-grey-6" />
            <div className="h-[12px] w-2/3 animate-pulse rounded bg-grey-6" />
          </div>
        </div>
      ))}
    </div>
  );
}
