"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { FileGlyphIcon, CloseIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { ViewerDoc } from "./types";

type ViewerPreviewProps = {
  doc: ViewerDoc;
  fileUrl: string | null | undefined;
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export function ViewerPreview({
  doc,
  fileUrl,
  currentPage,
  pageCount,
  onPageChange,
}: ViewerPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isImage = doc.fileType?.startsWith("image/");
  const isPdf = doc.fileType === "application/pdf";
  const previewSrc = isImage ? (fileUrl ?? doc.previewUrl) : fileUrl;
  const iframeSrc = isPdf && previewSrc ? `${previewSrc}#page=${currentPage}` : previewSrc;

  useEffect(() => {
    if (!isMaximized) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMaximized(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMaximized]);

  if (previewSrc === undefined) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-grey-5 border-t-pign-black" />
      </div>
    );
  }

  if (!previewSrc) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-[16px] px-[24px] text-center">
        <FileGlyphIcon size={64} className="text-grey-4" />
        <p className="text-[14px] text-grey-3">No file attached</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative flex min-h-[420px] flex-col">
      <div className="relative flex flex-1 items-center justify-center px-[48px] py-[24px]">
        {isImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewSrc}
            alt={doc.name}
            className="max-h-[min(62vh,560px)] max-w-full object-contain"
          />
        )}
        {isPdf && (
          <iframe
            src={iframeSrc || undefined}
            title={doc.name}
            className="h-[min(62vh,560px)] w-full max-w-[593px] border border-grey-6 bg-white"
          />
        )}
        {!isImage && !isPdf && (
          <div className="flex flex-col items-center gap-[16px] text-center">
            <FileGlyphIcon size={64} className="text-grey-4" />
            <p className="text-[14px] text-grey-3">{doc.name}</p>
            <a
              href={previewSrc}
              download={doc.name}
              className="bg-pign-black px-[24px] py-[10px] text-[14px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Download file
            </a>
          </div>
        )}

        {isPdf && pageCount > 1 && (
          <>
            <NavArrow
              direction="left"
              currentPage={currentPage}
              pageCount={pageCount}
              onPageChange={onPageChange}
            />
            <NavArrow
              direction="right"
              currentPage={currentPage}
              pageCount={pageCount}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>

      {(isImage || isPdf) && (
        <div className="flex justify-end px-[16px] pb-[12px]">
          <button
            type="button"
            onClick={() => setIsMaximized(true)}
            className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] text-grey-3 transition-colors hover:bg-grey-7 hover:text-pign-black"
            aria-label="Maximize view"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      )}

      {/* Branded Custom Lightbox Overlay (C10) */}
      {isMaximized && (isImage || isPdf) && (
        <div
          className="fixed inset-0 z-[1000] flex flex-col bg-[#0B0B0B] p-[24px]"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-[16px] text-white">
            <span className="text-[16px] font-semibold tracking-wide truncate pr-4">
              {doc.name}
            </span>
            <button
              type="button"
              onClick={() => setIsMaximized(false)}
              className="flex size-[36px] items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close custom view"
            >
              <CloseIcon size={20} className="rotate-45" />
            </button>
          </div>

          {/* Main content lightbox viewer area */}
          <div className="relative flex flex-1 items-center justify-center py-[24px]">
            {isImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewSrc}
                alt={doc.name}
                className="max-h-[80vh] max-w-full object-contain shadow-2xl select-none"
              />
            )}
            {isPdf && (
              <iframe
                src={iframeSrc || undefined}
                title={doc.name}
                className="h-[80vh] w-full max-w-[900px] border border-white/10 bg-white shadow-2xl rounded"
              />
            )}

            {isPdf && pageCount > 1 && (
              <>
                <NavArrow
                  direction="left"
                  currentPage={currentPage}
                  pageCount={pageCount}
                  onPageChange={onPageChange}
                />
                <NavArrow
                  direction="right"
                  currentPage={currentPage}
                  pageCount={pageCount}
                  onPageChange={onPageChange}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NavArrow({
  direction,
  currentPage,
  pageCount,
  onPageChange,
}: {
  direction: "left" | "right";
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  const isPrevious = direction === "left";
  const disabled = isPrevious ? currentPage <= 1 : currentPage >= pageCount;

  const handleClick = () => {
    if (disabled) return;
    onPageChange(isPrevious ? currentPage - 1 : currentPage + 1);
  };

  return (
    <div
      className={cn(
        "absolute top-1/2 flex -translate-y-1/2 flex-col items-center gap-[6px]",
        direction === "left" ? "left-[8px]" : "right-[8px]"
      )}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "flex h-[40px] w-[40px] items-center justify-center rounded-full bg-pign-black text-white transition-opacity shadow-md",
          disabled ? "opacity-20 cursor-not-allowed" : "opacity-80 hover:opacity-100"
        )}
        aria-label={isPrevious ? "Previous page" : "Next page"}
      >
        <Icon size={20} />
      </button>
      <span className="text-[12px] font-medium text-grey-2 bg-white/80 px-[6px] py-[2px] rounded select-none shadow-sm">
        {currentPage}/{pageCount}
      </span>
    </div>
  );
}
