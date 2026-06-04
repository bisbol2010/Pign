"use client";

import Link from "next/link";
import { formatFileSize, formatDate } from "@/lib/utils";
import { FolderGlyphIcon } from "@/components/icons";
import { FolderMenuButton, type FolderMenuState } from "./FolderContextMenu";
import type { FolderDoc } from "./types";

type FolderGridProps = {
  folders: FolderDoc[];
  onMenu?: (state: FolderMenuState) => void;
};

export function FolderGrid({ folders, onMenu }: FolderGridProps) {
  return (
    <div className="grid grid-cols-1 gap-[32px] px-[30px] pt-[20px] sm:grid-cols-2 xl:grid-cols-3">
      {folders.map((folder) => {
        const sizeLabel =
          folder.documentCount === 0
            ? ""
            : folder.totalFileSize > 0
              ? formatFileSize(folder.totalFileSize)
              : `${folder.documentCount} file${folder.documentCount === 1 ? "" : "s"}`;

        return (
          <div
            key={folder._id}
            className="group relative"
            onContextMenu={(e) => {
              if (folder.isSystem || !onMenu) return;
              e.preventDefault();
              onMenu({ folder, x: e.clientX, y: e.clientY });
            }}
          >
            <Link
              href={`/dashboard/folders/${folder._id}`}
              className="flex h-[84px] items-center gap-[16px] border border-grey-6 px-[16px] pr-[44px] transition-colors hover:bg-grey-7"
            >
              <FolderGlyphIcon size={31} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium text-pign-black">
                  {folder.name}
                </p>
                <div className="mt-[6px] flex items-center gap-[14px] text-[14px] text-grey-2">
                  <span>{formatDate(folder.lastUploadedAt)}</span>
                  {sizeLabel && <span>{sizeLabel}</span>}
                </div>
              </div>
            </Link>
            {!folder.isSystem && onMenu && (
              <FolderMenuButton
                folder={folder}
                onOpen={onMenu}
                className="absolute right-[12px] top-[12px] flex items-center text-grey-3 opacity-0 transition-opacity hover:text-pign-black group-hover:opacity-100"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
