"use client";

import { TopBar } from "@/components/layout/TopBar";
import { DocumentViewerScreen } from "@/components/viewer";
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function DocumentViewerContent() {
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

export default function DocumentViewerPage() {
  return (
    <Suspense
      fallback={
        <>
          <TopBar title="All files" />
          <div className="flex flex-1 items-center justify-center bg-grey-7">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-grey-5 border-t-pign-black" />
          </div>
        </>
      }
    >
      <DocumentViewerContent />
    </Suspense>
  );
}
