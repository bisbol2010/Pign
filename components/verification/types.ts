import type { Doc, Id } from "@/convex/_generated/dataModel";

export type DocumentVerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "failed";

export type VerificationBadgeVariant =
  | "none"
  | "verified"
  | "pending"
  | "failed"
  | "expired"
  | "disputed"
  | "duplicate-pending"
  | "duplicate-received";

export type VerifiableDoc = Pick<
  Doc<"documents">,
  | "_id"
  | "name"
  | "isVerified"
  | "verificationStatus"
  | "verifiedAt"
  | "duplicateStatus"
  | "duplicateOfId"
  | "issuerEntityId"
  | "verificationFailedReason"
> & {
  issuerName?: string | null;
  previewUrl?: string | null;
};

export type VerifyModalTarget = {
  documentId: Id<"documents">;
  /** Pre-filled when opening from upload success. */
  step?: "details";
};
