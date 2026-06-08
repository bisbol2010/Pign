"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { PermissionDenied } from "./PermissionDenied";
import { ViewerPreview } from "./ViewerPreview";
import { ViewerToolbar } from "./ViewerToolbar";
import type { ViewerQueryResult } from "./types";
import { useVerification } from "@/components/verification/VerificationProvider";
import { canVerifyDocument } from "@/components/verification";
import { useFileActionsContext } from "@/components/file-actions";

type DocumentViewerScreenProps = {
  documentId: Id<"documents">;
  shareToken?: string;
  backHref?: string;
};

export function DocumentViewerScreen({
  documentId,
  shareToken,
  backHref = "/dashboard",
}: DocumentViewerScreenProps) {
  const { showToast } = useFileActionsContext();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const viewer = useQuery(api.documents.getForViewer, {
    id: documentId,
    shareToken,
  }) as ViewerQueryResult | undefined;

  const fileUrl = useQuery(
    api.documents.getFileUrl,
    viewer?.status === "ok" && viewer.doc.fileId
      ? { documentId, shareToken }
      : "skip"
  );

  const { openVerify } = useVerification();
  const markOpened = useMutation(api.documents.markOpened);
  const ensureShareToken = useMutation(api.documents.ensureShareToken);

  useEffect(() => {
    if (viewer?.status === "ok") {
      void markOpened({ id: documentId, shareToken });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewer?.status === "ok" ? viewer.doc._id : null]);

  const toolbarMeta = useMemo(() => {
    if (viewer?.status === "ok") {
      return {
        fileName: viewer.doc.name,
        contentHash: viewer.doc.contentHash,
        isVerified: viewer.doc.isVerified,
        isShared: viewer.doc.isShared,
        access: viewer.access,
      };
    }
    if (viewer?.status === "denied") {
      return {
        fileName: viewer.name,
        contentHash: viewer.contentHash,
        isVerified: viewer.isVerified,
        isShared: viewer.isShared,
        access: undefined,
      };
    }
    return null;
  }, [viewer]);

  const handleBack = () => {
    router.push(backHref);
  };

  const handleDownload = async () => {
    if (!fileUrl || viewer?.status !== "ok") return;
    const anchor = document.createElement("a");
    anchor.href = fileUrl;
    anchor.download = viewer.doc.name;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const handleVerify = () => {
    if (viewer?.status !== "ok" || viewer.access.role !== "owner") return;
    if (!canVerifyDocument(viewer.doc)) return;
    openVerify(documentId);
  };

  const handleShare = async () => {
    if (viewer?.status !== "ok" || viewer.access.role !== "owner") return;
    try {
      const token = await ensureShareToken({ id: documentId });
      const url = `${window.location.origin}/s/${token}`;
      await navigator.clipboard.writeText(url);
      showToast("link-copied");
    } catch {
      showToast({ message: "Could not copy share link.", type: "error" });
    }
  };

  if (viewer === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center bg-grey-7">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-grey-5 border-t-pign-black" />
      </div>
    );
  }

  if (viewer.status === "not_found") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-[12px] bg-grey-7 px-[24px] text-center">
        <p className="text-[18px] font-medium text-pign-black">Document not found</p>
        <button
          type="button"
          onClick={handleBack}
          className="text-[14px] text-grey-3 transition-colors hover:text-pign-black"
        >
          Back to files
        </button>
      </div>
    );
  }

  const denied = viewer.status === "denied";

  return (
    <div className="flex flex-1 flex-col bg-grey-7 px-[30px] pb-[24px] pt-[20px]">
      <div className="mx-auto flex w-full max-w-[715px] flex-1 flex-col overflow-hidden rounded-[8px] bg-white shadow-sm">
        {toolbarMeta && (
          <ViewerToolbar
            fileName={toolbarMeta.fileName}
            contentHash={toolbarMeta.contentHash}
            isVerified={toolbarMeta.isVerified}
            isShared={toolbarMeta.isShared}
            access={toolbarMeta.access}
            onBack={handleBack}
            onDownload={handleDownload}
            onVerify={handleVerify}
            onShare={handleShare}
            canDownload={Boolean(fileUrl)}
            showDeniedChrome={denied}
          />
        )}

        <div className="relative flex-1">
          {denied ? (
            <>
              <div className="flex min-h-[420px] items-center justify-center border border-grey-6 bg-white" />
              <PermissionDenied
                onRequestPermission={() =>
                  showToast({ message: "Permission request is not available yet.", type: "info" })
                }
              />
            </>
          ) : (
            <ViewerPreview
              doc={viewer.doc}
              fileUrl={fileUrl}
              currentPage={currentPage}
              pageCount={viewer.pageCount ?? 1}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
