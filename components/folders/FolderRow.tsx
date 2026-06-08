"use client";

import Link from "next/link";
import { formatFileSize, formatDate } from "@/lib/utils";
import { FolderGlyphIcon } from "@/components/icons";
import { FILE_GRID_COLS } from "@/components/files/FileRow";
import { FolderMenuButton, type FolderMenuState } from "./FolderContextMenu";
import type { FolderDoc } from "./types";

export { FILE_GRID_COLS as FOLDER_GRID_COLS };

type FolderRowProps = {
  folder: FolderDoc;
  onRename?: (folder: FolderDoc) => void;
  onDelete?: (folder: FolderDoc) => void;
  onMenu?: (state: FolderMenuState) => void;
};

export function FolderRow({ folder, onMenu }: FolderRowProps) {
  const sizeLabel =
    folder.documentCount === 0
      ? "—"
      : folder.totalFileSize > 0
        ? formatFileSize(folder.totalFileSize)
        : `${folder.documentCount} file${folder.documentCount === 1 ? "" : "s"}`;

  return (
    <div
      className={`group border-b border-grey-6 transition-colors hover:bg-grey-7 ${FILE_GRID_COLS}`}
      onContextMenu={(e) => {
        if (folder.isSystem || !onMenu) return;
        e.preventDefault();
        onMenu({ folder, x: e.clientX, y: e.clientY });
      }}
    >
      <Link
        href={`/dashboard/folders/${folder._id}`}
        className="flex min-w-0 items-center gap-[16px] py-[13px]"
      >
        <FolderGlyphIcon size={31} className="shrink-0" />
        <p className="truncate text-[16px] font-medium text-pign-black">
          {folder.name}
        </p>
      </Link>

      <div className="flex justify-center" />

      <div className="flex justify-center" />

      <div className="text-center text-[16px] text-grey-2 opacity-80">
        {sizeLabel}
      </div>

      <div className="flex items-center justify-center gap-2 text-center text-[16px] text-grey-2 opacity-80">
        <span>{formatDate(folder.lastUploadedAt)}</span>
        {!folder.isSystem && onMenu && (
          <FolderMenuButton
            folder={folder}
            onOpen={onMenu}
            className="ml-1 flex shrink-0 items-center text-grey-3 opacity-0 transition-opacity hover:text-pign-black group-hover:opacity-100"
          />
        )}
      </div>
    </div>
  );
}
