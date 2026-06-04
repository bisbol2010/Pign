import type { VerifiableDoc, VerificationBadgeVariant } from "./types";

export function resolveDocVerificationStatus(
  doc: Pick<VerifiableDoc, "isVerified" | "verificationStatus">
): "unverified" | "pending" | "verified" | "failed" {
  if (doc.verificationStatus) return doc.verificationStatus;
  return doc.isVerified ? "verified" : "unverified";
}

export function getVerificationBadge(
  doc: VerifiableDoc,
  issuerRevoked?: boolean
): {
  variant: VerificationBadgeVariant;
  label: string;
  title?: string;
} {
  if (doc.duplicateStatus === "declined") {
    return {
      variant: "disputed",
      label: "Disputed",
      title: "The verified owner declined this copy as unauthorized.",
    };
  }
  if (doc.duplicateStatus === "pending") {
    return {
      variant: "duplicate-pending",
      label: "Possible duplicate",
      title: "Awaiting review by the verified issuer.",
    };
  }
  if (
    doc.duplicateStatus === "approved" ||
    doc.duplicateStatus === "auto_approved"
  ) {
    const by = doc.issuerName ? `Verified by ${doc.issuerName}` : "Verified";
    return {
      variant: "duplicate-received",
      label: by,
      title: "The issuer confirmed you received this document.",
    };
  }

  const status = resolveDocVerificationStatus(doc);
  if (status === "pending") {
    return {
      variant: "pending",
      label: "Pending",
      title: "Verification in progress.",
    };
  }
  if (status === "failed") {
    return {
      variant: "failed",
      label: "Failed",
      title: doc.verificationFailedReason ?? "Verification could not complete.",
    };
  }
  if (status === "verified" || doc.isVerified) {
    if (issuerRevoked) {
      const by = doc.issuerName ?? "issuer";
      return {
        variant: "expired",
        label: `${by} (expired)`,
        title: "Issuer verification has since been revoked.",
      };
    }
    const by = doc.issuerName
      ? `Verified by ${doc.issuerName}`
      : "Verified";
    return {
      variant: "verified",
      label: by,
      title: "Document fingerprint registered with Pign.",
    };
  }
  return { variant: "none", label: "" };
}

export function canVerifyDocument(doc: VerifiableDoc): boolean {
  const status = resolveDocVerificationStatus(doc);
  return status === "unverified" || status === "failed";
}
