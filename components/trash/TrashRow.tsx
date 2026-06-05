"use client";

import { useState } from "react";
import { formatFileSize, formatDate, cn } from "@/lib/utils";
import { FileGlyphIcon, FolderGlyphIcon, MoreVerticalIcon } from "@/components/icons";
import type { TrashRowItem, TrashSelection } from "./types";
import { TRASH_GRID_ALL, TRASH_GRID_FILTERED } from "./TrashTableHeader";

type TrashRowProps = {
  row: TrashRowItem;
  showType?: boolean;
  selected?: boolean;
  onSelect?: (selection: TrashSelection) => void;
  onOpenMenu?: (anchor: { x: number; y: number }) => void;
};

export function TrashRow({
  row,
  showType = false,
  selected,
  onSelect,
  onOpenMenu,
}: TrashRowProps) {
  const cols = showType ? TRASH_GRID_ALL : TRASH_GRID_FILTERED;
  const selection: TrashSelection =
    row.kind === "file"
      ? { kind: "file", id: row.item._id }
      : { kind: "folder", id: row.item._id };

  const sizeLabel =
    row.kind === "file"
      ? row.item.fileSize
        ? formatFileSize(row.item.fileSize)
        : "—"
      : row.item.totalFileSize > 0
        ? formatFileSize(row.item.totalFileSize)
        : "—";

  const uploadedAt =
    row.kind === "file" ? row.item._creationTime : row.item.lastUploadedAt;

  const { name, ext } =
    row.kind === "file"
      ? splitName(row.item.name)
      : { name: row.item.name, ext: "" };

  return (
    <div
      role="row"
      aria-selected={selected}
      tabIndex={onSelect ? 0 : undefined}
      onClick={() => onSelect?.(selection)}
      onKeyDown={(e) => {
        if (!onSelect) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(selection);
        }
      }}
      className={cn(
        "group cursor-pointer border-b border-grey-6 transition-colors hover:bg-grey-7 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pign-black",
        selected && "border border-grey-2 bg-grey-7/60",
        cols
      )}
    >
      <div className="flex min-w-0 items-center gap-[16px] py-[13px]">
        {row.kind === "file" ? (
          <FileThumb previewUrl={row.item.previewUrl} />
        ) : (
          <FolderGlyphIcon size={31} className="shrink-0" />
        )}
        <p className="truncate text-[16px]">
          <span className="font-medium text-pign-black">{name}</span>
          {ext ? <span className="text-grey-4"> {ext}</span> : null}
        </p>
      </div>

      {showType ? (
        <div className="text-center text-[16px] text-grey-2">
          {row.kind === "file" ? "File" : "Folder"}
        </div>
      ) : null}

      <div className="text-center text-[16px] text-grey-2">{sizeLabel}</div>

      <div className="text-center text-[16px] text-grey-2">
        {formatDate(uploadedAt)}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          aria-label="Trash actions"
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(selection);
            const rect = e.currentTarget.getBoundingClientRect();
            onOpenMenu?.({ x: rect.right - 195, y: rect.bottom + 4 });
          }}
          className="text-pign-black opacity-0 transition-opacity group-hover:opacity-100 data-[visible=true]:opacity-100"
          data-visible={selected}
        >
          <MoreVerticalIcon size={20} />
        </button>
      </div>
    </div>
  );
}

function FileThumb({ previewUrl }: { previewUrl: string | null }) {
  const [hasError, setHasError] = useState(false);
  if (previewUrl && !hasError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={previewUrl}
        alt=""
        onError={() => setHasError(true)}
        className="h-[31px] w-[31px] shrink-0 rounded-[4px] object-cover"
      />
    );
  }
  return <FileGlyphIcon size={31} className="shrink-0" />;
}

function splitName(full: string) {
  const lastDot = full.lastIndexOf(".");
  return lastDot > 0
    ? { name: full.substring(0, lastDot), ext: full.substring(lastDot) }
    : { name: full, ext: "" };
}
