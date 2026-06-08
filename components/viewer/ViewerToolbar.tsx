"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import {
  DownloadIcon,
  SharedCellIcon,
  VerifiedIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import type { ViewerAccess } from "./types";
import { canEditDocument, isViewOnly, splitFileName } from "./types";
import { useFileActionsContext } from "@/components/file-actions";

type ViewerToolbarProps = {
  fileName: string;
  contentHash?: string | null;
  isVerified: boolean;
  isShared: boolean;
  access?: ViewerAccess;
  onBack: () => void;
  onDownload?: () => void;
  onVerify?: () => void;
  onShare?: () => void;
  canDownload?: boolean;
  showDeniedChrome?: boolean;
};

export function ViewerToolbar({
  fileName,
  contentHash,
  isVerified,
  isShared,
  access,
  onBack,
  onDownload,
  onVerify,
  onShare,
  canDownload,
  showDeniedChrome,
}: ViewerToolbarProps) {
  const { showToast } = useFileActionsContext();
  const { name, ext } = splitFileName(fileName);
  const [printOpen, setPrintOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const viewOnly = isViewOnly(access);
  const canEdit = canEditDocument(access);

  useEffect(() => {
    if (!printOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (printRef.current && !printRef.current.contains(e.target as Node)) {
        setPrintOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [printOpen]);

  const handlePrint = (withVerification: boolean) => {
    setPrintOpen(false);
    if (withVerification && !isVerified) {
      showToast({ message: "This document is not verified yet.", type: "error" });
      return;
    }
    window.print();
  };

  return (
    <div className="flex items-center gap-[12px] border-b border-grey-6 px-[20px] py-[14px]">
      <button
        type="button"
        onClick={onBack}
        className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] text-grey-3 transition-colors hover:bg-grey-7 hover:text-pign-black"
        aria-label="Go back"
      >
        <ArrowLeft size={18} />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-[8px]">
        <p className="truncate text-[14px]">
          <span className="font-medium text-pign-black">{name}</span>
          {ext && <span className="text-grey-4">{ext}</span>}
        </p>
        {viewOnly && (
          <span className="shrink-0 rounded bg-grey-7 px-[8px] py-[2px] text-[12px] text-grey-2">
            View only
          </span>
        )}
      </div>

      {contentHash && (
        <p className="hidden max-w-[140px] truncate text-[14px] text-grey-4 sm:block">
          {contentHash.slice(0, 16)}
        </p>
      )}

      <div className="flex shrink-0 items-center gap-[10px]">
        {isShared && (
          <SharedCellIcon size={20} className="text-grey-2" aria-label="Shared" />
        )}
        {isVerified && (
          <VerifiedIcon size={20} className="text-grey-2" aria-label="Verified" />
        )}

        {!showDeniedChrome && canDownload && onDownload && (
          <button
            type="button"
            onClick={onDownload}
            className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] text-pign-black transition-colors hover:bg-grey-7"
            aria-label="Download"
          >
            <DownloadIcon size={20} />
          </button>
        )}

        {!showDeniedChrome && (
          <div ref={printRef} className="relative">
            <button
              type="button"
              onClick={() => setPrintOpen((open) => !open)}
              className={cn(
                "flex h-[32px] w-[32px] items-center justify-center rounded-[8px] text-pign-black transition-colors hover:bg-grey-7",
                printOpen && "bg-grey-7"
              )}
              aria-label="Print"
              aria-expanded={printOpen}
            >
              <Printer size={18} />
            </button>
            {printOpen && (
              <div className="absolute right-0 top-full z-20 mt-[6px] w-[186px] bg-white py-[8px] shadow-[0px_10px_15px_-4px_rgba(179,179,179,0.3)]">
                <button
                  type="button"
                  onClick={() => handlePrint(true)}
                  className="block w-full px-[14px] py-[6px] text-left text-[14px] text-grey-2 transition-colors hover:bg-grey-7"
                >
                  Print with verification
                </button>
                <button
                  type="button"
                  onClick={() => handlePrint(false)}
                  className="block w-full px-[14px] py-[6px] text-left text-[14px] text-grey-2 transition-colors hover:bg-grey-7"
                >
                  Print without verification
                </button>
              </div>
            )}
          </div>
        )}

        {!showDeniedChrome && canEdit && !isVerified && onVerify && (
          <button
            type="button"
            onClick={onVerify}
            className="hidden text-[14px] text-grey-4 transition-colors hover:text-pign-black sm:inline"
          >
            Verify
          </button>
        )}

        {!showDeniedChrome && access?.role === "owner" && onShare && (
          <button
            type="button"
            onClick={onShare}
            className="hidden text-[14px] text-grey-4 transition-colors hover:text-pign-black sm:inline"
          >
            Share
          </button>
        )}
      </div>
    </div>
  );
}
