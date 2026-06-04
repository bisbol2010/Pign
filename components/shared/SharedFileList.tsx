"use client";

import { SharedFileRow } from "./SharedFileRow";
import type { FileDoc } from "@/components/files/types";
import type { Id } from "@/convex/_generated/dataModel";

type SharedFileListProps = {
  documents: FileDoc[];
  selectedId?: Id<"documents"> | null;
  onSelect?: (id: Id<"documents">) => void;
  canManage?: boolean;
};

export function SharedFileList({
  documents,
  selectedId,
  onSelect,
  canManage = true,
}: SharedFileListProps) {
  return (
    <div>
      {documents.map((doc) => (
        <SharedFileRow
          key={doc._id}
          doc={doc}
          selected={selectedId === doc._id}
          onSelect={onSelect}
          canManage={canManage}
        />
      ))}
    </div>
  );
}
