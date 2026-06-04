import type { NotificationRow } from "./types";

export function groupNotificationsByTime(items: NotificationRow[]) {
  const now = Date.now();
  const day = 86400000;
  const groups: { label: string; items: NotificationRow[] }[] = [];
  const today: NotificationRow[] = [];
  const thisWeek: NotificationRow[] = [];
  const thisMonth: NotificationRow[] = [];
  const older: NotificationRow[] = [];

  for (const item of items) {
    const ts = item._creationTime;
    const diff = now - ts;
    if (diff < day) today.push(item);
    else if (diff < day * 7) thisWeek.push(item);
    else if (diff < day * 30) thisMonth.push(item);
    else older.push(item);
  }

  if (today.length) groups.push({ label: "Today", items: today });
  if (thisWeek.length) groups.push({ label: "This week", items: thisWeek });
  if (thisMonth.length) groups.push({ label: "This month", items: thisMonth });
  if (older.length) groups.push({ label: "Older", items: older });
  return groups;
}

export function formatNotificationTimestamp(ts: number) {
  const now = new Date();
  const d = new Date(ts);
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return time.toLowerCase();

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function notificationHref(notification: NotificationRow): string | null {
  if (notification.linkedDocumentId) {
    return `/document/${notification.linkedDocumentId}`;
  }
  if (notification.linkedDeliveryId) {
    return `/emails/${notification.linkedDeliveryId}`;
  }
  return null;
}
