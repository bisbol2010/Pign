"use client";

import { FolderRow, FOLDER_GRID_COLS } from "./FolderRow";
import type { FolderMenuState } from "./FolderContextMenu";
import type { FolderDoc } from "./types";

type FolderListProps = {
  folders: FolderDoc[];
  onRename?: (folder: FolderDoc) => void;
  onDelete?: (folder: FolderDoc) => void;
  onMenu?: (state: FolderMenuState) => void;
};

export function FolderList({ folders, onRename, onDelete, onMenu }: FolderListProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[680px]">
        <div
          className={`h-[28px] bg-grey-7 text-[14px] text-grey-3 ${FOLDER_GRID_COLS}`}
        >
          <span>NAME</span>
          <span className="text-center">SHARED</span>
          <span className="text-center">VERIFIED</span>
          <span className="text-center">SIZE</span>
          <span className="text-center">LAST UPLOADED</span>
        </div>
        {folders.map((folder) => (
          <FolderRow
            key={folder._id}
            folder={folder}
            onRename={onRename}
            onDelete={onDelete}
            onMenu={onMenu}
          />
        ))}
      </div>
    </div>
  );
}
