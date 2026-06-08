"use client";

import { FOLDER_GRID_COLS } from "./FolderRow";

export function FoldersSkeleton({ viewMode }: { viewMode: "list" | "grid" }) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 gap-[32px] px-[30px] pt-[20px] sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex h-[84px] animate-pulse items-center gap-[16px] border border-grey-6 px-[16px]"
          >
            <div className="h-[31px] w-[31px] rounded bg-grey-6" />
            <div className="flex-1 space-y-2">
              <div className="h-[14px] w-40 rounded bg-grey-6" />
              <div className="h-[14px] w-28 rounded bg-grey-6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className={`h-[28px] bg-grey-7 ${FOLDER_GRID_COLS}`} />
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className={`border-b border-grey-6 ${FOLDER_GRID_COLS}`}
        >
          <div className="flex items-center gap-[16px] py-[13px]">
            <div className="h-[31px] w-[31px] shrink-0 animate-pulse rounded bg-grey-6" />
            <div className="h-[14px] w-48 animate-pulse rounded bg-grey-6" />
          </div>
          <div />
          <div />
          <div className="mx-auto h-[14px] w-12 animate-pulse rounded bg-grey-6" />
          <div className="mx-auto h-[14px] w-20 animate-pulse rounded bg-grey-6" />
        </div>
      ))}
    </div>
  );
}
