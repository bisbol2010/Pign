"use client";

import { TopBar } from "@/components/layout/TopBar";
import { DocumentViewerScreen } from "@/components/viewer";
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useSearchParams } from "next/navigation";

export default function DocumentViewerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const documentId =
    typeof params.id === "string" ? (params.id as Id<"documents">) : null;
  const shareToken = searchParams.get("share") ?? undefined;

  if (!documentId) {
    return (
      <>
        <TopBar title="All files" />
        <div className="flex flex-1 flex-col items-center justify-center gap-[12px] bg-grey-7 px-[24px] text-center">
          <p className="text-[18px] font-medium text-pign-black">
            Document not found
          </p>
          <a
            href="/dashboard"
            className="text-[14px] text-grey-3 transition-colors hover:text-pign-black"
          >
            Back to files
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="All files" />
      <DocumentViewerScreen documentId={documentId} shareToken={shareToken} />
    </>
  );
}
