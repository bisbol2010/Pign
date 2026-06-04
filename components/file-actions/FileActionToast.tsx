"use client";

import { CloseIcon, DownloadIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useFileActionsContext } from "./FileActionsProvider";

const MESSAGES = {
  "link-copied": "Link copied",
  pinned: "Pinned to top",
  downloading: "Downloading...",
  downloaded: "Downloaded",
} as const;

/** Action feedback toast (Figma: Link copied / Pinned / Downloading / Downloaded). */
export function FileActionToastBanner() {
  const { toast, dismissToast } = useFileActionsContext();

  if (!toast) return null;

  const isBuiltIn =
    typeof toast === "string" && toast in MESSAGES;

  const showDownloadIcon =
    toast === "downloading" || toast === "downloaded";

  const messageText = isBuiltIn
    ? MESSAGES[toast as keyof typeof MESSAGES]
    : typeof toast === "string"
      ? toast
      : toast.message;

  const isError = typeof toast !== "string" && toast.type === "error";

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-[104px] z-50 flex justify-center px-[30px] lg:left-[300px]"
      aria-live="polite"
    >
      <div
        className={cn(
          "pointer-events-auto flex h-[56px] items-center gap-[12px] border border-white bg-pign-black px-[28px]",
          showDownloadIcon ? "min-w-[232px]" : "min-w-[170px]",
          isError && "border-verify-red/50 bg-[#2D1A1A] text-verify-red"
        )}
        role="status"
      >
        <p className={cn("text-[16px] font-medium text-white", isError && "text-verify-red")}>
          {messageText}
        </p>
        {showDownloadIcon && (
          <DownloadIcon size={24} className={cn("shrink-0 text-white", isError && "text-verify-red")} />
        )}
        <button
          type="button"
          onClick={dismissToast}
          className="ml-auto flex size-[34px] shrink-0 items-center justify-center text-white transition-opacity hover:opacity-70"
          aria-label="Dismiss"
        >
          <CloseIcon size={24} className={cn("rotate-45", isError && "text-verify-red")} />
        </button>
      </div>
    </div>
  );
}
