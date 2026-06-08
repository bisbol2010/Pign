"use client";

import { DocumentViewerScreen } from "@/components/viewer";
import type { Id } from "@/convex/_generated/dataModel";

/** @deprecated Use `DocumentViewerScreen` from `@/components/viewer`. */
export function DocumentViewer({
  documentId,
  shareToken,
}: {
  documentId: Id<"documents">;
  shareToken?: string;
}) {
  return (
    <DocumentViewerScreen
      documentId={documentId}
      shareToken={shareToken}
      backHref="/dashboard"
    />
  );
}
