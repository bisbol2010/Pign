"use client";

import { useState } from "react";
import { formatFileSize, formatDate, cn } from "@/lib/utils";
import Link from "next/link";
import {
  SharedCellIcon,
  MoreVerticalIcon,
} from "@/components/icons";
import { FileTypeGlyph } from "./FileTypeGlyph";
import type { FileDoc } from "./types";
import { useFileActionsContext } from "@/components/file-actions";
import { VerificationCell } from "@/components/verification";
import { useVerification } from "@/components/verification/VerificationProvider";
import type { Id } from "@/convex/_generated/dataModel";

/** Shared 5-column grid template so the header strip and rows stay aligned. */
export const FILE_GRID_COLS =
  "grid grid-cols-[1fr_96px_96px_96px_130px_40px] items-center pl-[30px] pr-[35px]";

type FileRowProps = {
  doc: FileDoc;
  selected?: boolean;
  onSelect?: (id: Id<"documents">) => void;
};

export function FileRow({ doc, selected, onSelect }: FileRowProps) {
  const { openVerify } = useVerification();
  const { openMenu, setSelectedId } = useFileActionsContext();
  const { name, ext } = splitName(doc.name);

  return (
    <div
      role="row"
      aria-selected={selected}
      tabIndex={onSelect ? 0 : undefined}
      onClick={() => onSelect?.(doc._id)}
      onKeyDown={(e) => {
        if (!onSelect) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(doc._id);
        }
      }}
      className={cn(
        "group cursor-pointer border-b border-grey-6 transition-colors hover:bg-grey-7 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pign-black",
        selected && "border border-grey-2 bg-grey-7/60",
        FILE_GRID_COLS
      )}
    >
      <Link
        href={`/document/${doc._id}`}
        onClick={(e) => e.stopPropagation()}
        className="flex min-w-0 items-center gap-[16px] py-[13px]"
      >
        <Thumb doc={doc} />
        <p className="truncate text-[16px]">
          <span className="font-medium text-pign-black">{name}</span>
          <span className="text-grey-4"> {ext}</span>
        </p>
      </Link>

      <div className="flex justify-center">
        {doc.isShared && <SharedCellIcon size={24} className="text-grey-2" />}
      </div>

      <VerificationCell doc={doc} onVerify={() => openVerify(doc._id)} />

      <div className="text-center text-[16px] text-grey-2">
        {doc.fileSize ? formatFileSize(doc.fileSize) : "—"}
      </div>

      <div className="text-center text-[16px] text-grey-2">
        {formatDate(doc._creationTime)}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          aria-label="File actions"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId(doc._id);
            onSelect?.(doc._id);
            const rect = e.currentTarget.getBoundingClientRect();
            openMenu({ x: rect.right - 195, y: rect.bottom + 4 });
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

function Thumb({ doc }: { doc: FileDoc }) {
  const [hasError, setHasError] = useState(false);

  if (doc.previewUrl && !hasError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={doc.previewUrl}
        alt=""
        onError={() => setHasError(true)}
        className="h-[31px] w-[31px] shrink-0 rounded-[4px] object-cover"
      />
    );
  }
  return <FileTypeGlyph name={doc.name} fileType={doc.fileType} size={31} />;
}

function splitName(full: string) {
  const lastDot = full.lastIndexOf(".");
  return lastDot > 0
    ? { name: full.substring(0, lastDot), ext: full.substring(lastDot) }
    : { name: full, ext: "" };
}
