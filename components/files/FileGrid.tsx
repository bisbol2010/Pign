"use client";

import Link from "next/link";
import { useState } from "react";
import { formatFileSize, formatDate } from "@/lib/utils";
import {
  VerifiedIcon,
  SharedCellIcon,
  MoreVerticalIcon,
} from "@/components/icons";
import { FileTypeGlyph } from "./FileTypeGlyph";
import type { FileDoc } from "./types";
import type { Id } from "@/convex/_generated/dataModel";
import { useFileActionsContext } from "@/components/file-actions";
import { cn } from "@/lib/utils";

type FileGridProps = {
  documents: FileDoc[];
  selectedId?: Id<"documents"> | null;
  onSelect?: (id: Id<"documents">) => void;
};

export function FileGrid({
  documents,
  selectedId,
  onSelect,
}: FileGridProps) {
  const { openMenu, setSelectedId } = useFileActionsContext();

  return (
    <div className="grid grid-cols-2 gap-[32px] px-[30px] pt-[20px] sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {documents.map((doc) => {
          const { name, ext } = splitName(doc.name);
          const selected = selectedId === doc._id;
          return (
            <div
              key={doc._id}
              className={cn(
                "group relative overflow-hidden",
                selected && "ring-2 ring-grey-2"
              )}
            >
              <Link
                href={`/document/${doc._id}`}
                className="block"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex h-[136px] items-center justify-center bg-grey-7">
                  <GridThumb doc={doc} />
                </div>
                <div className="bg-grey-2 px-[10px] py-[8px]">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[14px] text-white">
                      {name}
                      <span className="text-grey-5"> {ext}</span>
                    </p>
                    <div className="flex shrink-0 items-center gap-[6px] text-white">
                      {doc.isShared && <SharedCellIcon size={18} />}
                      {doc.isVerified && <VerifiedIcon size={18} />}
                    </div>
                  </div>
                  <div className="mt-[4px] flex items-center gap-[14px] text-[14px] text-white">
                    <span>{doc.fileSize ? formatFileSize(doc.fileSize) : ""}</span>
                    <span>{formatDate(doc._creationTime)}</span>
                  </div>
                </div>
              </Link>
              <button
                type="button"
                aria-label="File actions"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedId(doc._id);
                  onSelect?.(doc._id);
                  const rect = e.currentTarget.getBoundingClientRect();
                  openMenu({ x: rect.left, y: rect.bottom + 4 });
                }}
                className="absolute right-[8px] top-[8px] bg-pign-black/70 p-[4px] text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreVerticalIcon size={18} />
              </button>
            </div>
          );
        })}
    </div>
  );
}

function splitName(full: string) {
  const lastDot = full.lastIndexOf(".");
  return lastDot > 0
    ? { name: full.substring(0, lastDot), ext: full.substring(lastDot) }
    : { name: full, ext: "" };
}

function GridThumb({ doc }: { doc: FileDoc }) {
  const [hasError, setHasError] = useState(false);

  if (doc.previewUrl && !hasError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={doc.previewUrl}
        alt=""
        onError={() => setHasError(true)}
        className="h-full w-full object-cover"
      />
    );
  }
  return <FileTypeGlyph name={doc.name} fileType={doc.fileType} size={48} />;
}
