"use client";

import { cn } from "@/lib/utils";
import { NotificationRowItem } from "./NotificationRow";
import { groupNotificationsByTime } from "./utils";
import type { NotificationRow } from "./types";

type NotificationListProps = {
  notifications: NotificationRow[];
  onOpen?: (notification: NotificationRow) => void;
  compact?: boolean;
};

export function NotificationList({
  notifications,
  onOpen,
  compact = false,
}: NotificationListProps) {
  const groups = groupNotificationsByTime(notifications);

  return (
    <div>
      {groups.map((group) => (
        <section key={group.label}>
          <div
            className={cn(
              "border-b border-grey-6 bg-grey-7/60",
              compact ? "px-4 py-2" : "px-[30px] py-[6px]"
            )}
          >
            <p className="text-[12px] font-medium text-grey-3">{group.label}</p>
          </div>
          {group.items.map((notification) => (
            <NotificationRowItem
              key={notification._id}
              notification={notification}
              onOpen={onOpen}
              compact={compact}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
