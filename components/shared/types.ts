import type { FileDoc } from "@/components/files/types";
import type { Id } from "@/convex/_generated/dataModel";

/** Shared file row with owner or sharee metadata from `convex/shared.ts`. */
export type SharedWithMeDoc = FileDoc & {
  permission: "view" | "edit";
  accessId: Id<"sharedAccess">;
  ownerName: string | null;
  ownerEmail: string | null;
};

export type SharedByMeDoc = FileDoc & {
  sharedWithCount: number;
  sharedWithEmails: string[];
};
