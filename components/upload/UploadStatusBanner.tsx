"use client";

import { CloseIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useUpload } from "./UploadProvider";

/** Success / failed toast centered under the top bar (Figma upload-success / upload-failed). */
export function UploadStatusBanner() {
  const {
    toast,
    dismissToast,
    retryFailed,
    verifyLastUpload,
    lastDocumentId,
  } = useUpload();

  if (!toast) return null;

  const isSuccess = toast === "success";

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-[104px] z-40 flex justify-center px-[30px] lg:left-[300px]"
      aria-live="polite"
    >
      <div
        className={cn(
          "pointer-events-auto flex h-[56px] items-center gap-[16px] border border-white bg-pign-black px-[28px]",
          isSuccess ? "min-w-[302px]" : "min-w-[290px]"
        )}
        role="status"
      >
        <p className="text-[16px] text-white">
          {isSuccess ? (
            <>
              <span className="font-normal">Upload Success.</span>
              {lastDocumentId ? (
                <button
                  type="button"
                  onClick={() => void verifyLastUpload()}
                  className="ml-[8px] font-medium underline-offset-2 hover:underline"
                >
                  Verify now
                </button>
              ) : null}
            </>
          ) : (
            <>
              <span className="font-normal">Upload failed.</span>
              <button
                type="button"
                onClick={retryFailed}
                className="ml-[4px] font-medium underline-offset-2 hover:underline"
              >
                Retry now
              </button>
            </>
          )}
        </p>
        <button
          type="button"
          onClick={dismissToast}
          className="ml-auto flex size-[34px] shrink-0 items-center justify-center text-white transition-opacity hover:opacity-70"
          aria-label="Dismiss"
        >
          <CloseIcon size={24} className="rotate-45" />
        </button>
      </div>
    </div>
  );
}
