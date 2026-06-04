import type { Doc } from "@/convex/_generated/dataModel";

export type MailTab = "all" | "inbox" | "outbox" | "drafts";

export type DeliveryRow = Doc<"deliveries"> & {
  counterparty?: string;
};

export type DeliveryDetail = DeliveryRow & {
  documents: Array<
    Doc<"documents"> & { previewUrl: string | null }
  >;
  senderEmail: string;
  senderName?: string;
  recipientDisplay: string;
  recipientName?: string;
  perspective: "inbox" | "outbox";
};
