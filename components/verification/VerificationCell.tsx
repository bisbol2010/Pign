"use client";

import { VerifiedIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { canVerifyDocument, resolveDocVerificationStatus } from "./status";
import { VerificationBadge } from "./VerificationBadge";
import type { VerifiableDoc } from "./types";

type VerificationCellProps = {
  doc: VerifiableDoc;
  onVerify?: () => void;
  className?: string;
};

export function VerificationCell({
  doc,
  onVerify,
  className,
}: VerificationCellProps) {
  const status = resolveDocVerificationStatus(doc);

  if (status === "verified" || doc.isVerified) {
    return (
      <div className={cn("flex justify-center", className)}>
        <VerifiedIcon size={24} className="text-grey-2" aria-label="Verified" />
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className={cn("flex justify-center", className)}>
        <VerificationBadge doc={doc} />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className={cn("flex flex-col items-center gap-1", className)}>
        <VerificationBadge doc={doc} />
        {canVerifyDocument(doc) && onVerify && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onVerify();
            }}
            className="text-[14px] text-grey-4 transition-colors hover:text-pign-black"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (!canVerifyDocument(doc) || !onVerify) {
    return <div className={cn("flex justify-center", className)}>—</div>;
  }

  return (
    <div className={cn("flex justify-center", className)}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onVerify();
        }}
        className="text-[14px] text-grey-4 transition-colors hover:text-pign-black"
        aria-label="Verify document"
      >
        Verify now
      </button>
    </div>
  );
}
