"use client";

import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { getVerificationBadge } from "./status";
import type { VerifiableDoc } from "./types";

const variantMap: Record<
  ReturnType<typeof getVerificationBadge>["variant"],
  BadgeVariant | null
> = {
  none: null,
  verified: "verified",
  pending: "pending",
  failed: "disputed",
  expired: "expired",
  disputed: "disputed",
  "duplicate-pending": "pending",
  "duplicate-received": "verified",
};

type VerificationBadgeProps = {
  doc: VerifiableDoc;
  className?: string;
};

export function VerificationBadge({ doc, className }: VerificationBadgeProps) {
  const { variant, label, title } = getVerificationBadge(doc);
  const badgeVariant = variantMap[variant];
  if (!badgeVariant || !label) return null;
  return (
    <Badge variant={badgeVariant} className={className} title={title}>
      {label}
    </Badge>
  );
}
