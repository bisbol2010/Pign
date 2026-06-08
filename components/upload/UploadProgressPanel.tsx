"use client";

import { cn } from "@/lib/utils";
import { CloseIcon, PauseIcon } from "@/components/icons";
import { useUpload } from "./UploadProvider";

/** In-progress upload rows below the page header (Figma `dashboard/upload-on-click`). */
export function UploadProgressPanel() {
  const { items, cancelUpload } = useUpload();
  const active = items.filter((i) => i.status === "uploading");

  if (active.length === 0) return null;

  return (
    <div className="px-[30px] pr-[35px] pt-[18px]">
      {active.length > 1 && (
        <p className="mb-[12px] text-[18px] font-medium text-pign-black">
          Verify all
        </p>
      )}
      <ul className="flex flex-col gap-[12px]">
        {active.map((item) => (
          <li key={item.id}>
            <div
              className="relative flex h-[46px] w-full items-stretch overflow-hidden border border-grey-5"
              role="progressbar"
              aria-valuenow={item.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Uploading ${item.file.name}`}
            >
              <div
                className="flex min-w-[140px] max-w-[85%] items-center bg-grey-2 transition-[width] duration-150"
                style={{ width: `${Math.max(item.progress, 12)}%` }}
              >
                <span className="shrink-0 px-[24px] text-[16px] font-medium text-white">
                  Uploading
                </span>
              </div>
              <div className="flex min-w-0 flex-1 items-center bg-grey-7 px-[16px]">
                <span className="truncate text-[18px] text-pign-black">
                  {item.file.name}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-[12px] bg-grey-7 pr-[16px]">
                <button
                  type="button"
                  className="text-grey-4 transition-opacity hover:opacity-70"
                  aria-label="Pause upload"
                  disabled
                  title="Pause not available"
                >
                  <PauseIcon size={24} />
                </button>
                <button
                  type="button"
                  onClick={() => cancelUpload(item.id)}
                  className="text-grey-4 transition-opacity hover:opacity-70"
                  aria-label="Cancel upload"
                >
                  <CloseIcon size={24} />
                </button>
                <span
                  className={cn(
                    "inline-flex h-[29px] min-w-[104px] items-center justify-center bg-grey-7 px-[12px]",
                    "text-[14px] text-grey-2"
                  )}
                >
                  Verify now
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
