"use client";

import { FileRow, FILE_GRID_COLS } from "./FileRow";
import type { FileDoc } from "./types";
import type { Id } from "@/convex/_generated/dataModel";

type FileListProps = {
  documents: FileDoc[];
  selectedId?: Id<"documents"> | null;
  onSelect?: (id: Id<"documents">) => void;
};

export function FileList({
  documents,
  selectedId,
  onSelect,
}: FileListProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[680px]">
        <div
          className={`h-[28px] bg-grey-7 text-[14px] text-grey-3 ${FILE_GRID_COLS}`}
        >
          <span>NAME</span>
          <span className="text-center">SHARED</span>
          <span className="text-center">VERIFIED</span>
          <span className="text-center">SIZE</span>
          <span className="text-center">LAST UPLOADED</span>
          <span />
        </div>
        {documents.map((doc) => (
          <FileRow
            key={doc._id}
            doc={doc}
            selected={selectedId === doc._id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
