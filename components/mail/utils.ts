import type { DeliveryRow } from "./types";

export function groupDeliveriesByTime(items: DeliveryRow[]) {
  const now = Date.now();
  const day = 86400000;
  const groups: { label: string; items: DeliveryRow[] }[] = [];
  const today: DeliveryRow[] = [];
  const thisWeek: DeliveryRow[] = [];
  const thisMonth: DeliveryRow[] = [];
  const older: DeliveryRow[] = [];

  for (const item of items) {
    const ts = item.deliveredAt ?? item._creationTime;
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

export function formatMailTimestamp(ts: number, shortToday = true) {
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

  if (isToday && shortToday) return time.toLowerCase();

  const date = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${date}  ${time.toLowerCase()}`;
}

export function deliveryCounterparty(
  delivery: DeliveryRow,
  perspective: "inbox" | "outbox" | "drafts" | "all"
): string {
  if (perspective === "outbox" || delivery.folder === "outbox" || delivery.folder === "pending") {
    return delivery.recipientEmail;
  }
  return delivery.recipientEmail;
}

export function deliverySnippet(delivery: DeliveryRow): string {
  const text = delivery.body?.trim() || delivery.subject?.trim() || "";
  if (!text) return "No message";
  return text.length > 90 ? `${text.slice(0, 90)}...` : text;
}

export function rowPerspective(
  delivery: DeliveryRow,
  userId: string | undefined
): "inbox" | "outbox" | "drafts" {
  if (delivery.folder === "drafts") return "drafts";
  if (delivery.recipientUserId === userId && delivery.folder === "inbox") {
    return "inbox";
  }
  return "outbox";
}
