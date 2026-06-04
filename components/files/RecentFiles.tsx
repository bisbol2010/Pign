"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useState } from "react";
import { formatFileSize, formatDate } from "@/lib/utils";
import {
  ChevronDownIcon,
  VerifiedIcon,
  SharedCellIcon,
} from "@/components/icons";
import { FileTypeGlyph } from "./FileTypeGlyph";
import type { FileDoc } from "./types";

export function RecentFiles() {
  const recentDocs = useQuery(api.documents.getRecent) as
    | FileDoc[]
    | undefined;
  const [collapsedOverride, setCollapsedOverride] = useState<boolean | null>(
    null
  );

  if (recentDocs === undefined) return null;

  const hasRecent = recentDocs.length > 0;
  const collapsed = collapsedOverride ?? !hasRecent;

  return (
    <section className="pt-[10px]">
      <div className="flex items-center justify-between pl-[30px] pr-[35px]">
        <h2 className="text-[18px] text-pign-black">Recent</h2>
        <button
          type="button"
          onClick={() =>
            setCollapsedOverride((prev) => !(prev ?? !hasRecent))
          }
          aria-label={collapsed ? "Expand recent" : "Collapse recent"}
          aria-expanded={!collapsed}
          className="text-pign-black transition-transform"
        >
          <ChevronDownIcon
            size={24}
            className={collapsed ? "" : "rotate-180"}
          />
        </button>
      </div>

      {hasRecent && !collapsed && (
        <div className="mt-[14px] w-full overflow-x-auto bg-pign-black px-[30px] py-[24px]">
          <div className="flex gap-[32px]">
            {recentDocs.map((doc) => (
              <RecentCard key={doc._id} doc={doc} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function RecentCard({ doc }: { doc: FileDoc }) {
  const { name, ext } = splitName(doc.name);
  const [hasError, setHasError] = useState(false);
  return (
    <Link
      href={`/document/${doc._id}`}
      className="block w-[245px] shrink-0 overflow-hidden"
    >
      <div className="flex h-[136px] items-center justify-center bg-grey-7">
        {doc.previewUrl && !hasError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={doc.previewUrl}
            alt=""
            onError={() => setHasError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <FileTypeGlyph name={doc.name} fileType={doc.fileType} size={48} />
        )}
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
  );
}

function splitName(full: string) {
  const lastDot = full.lastIndexOf(".");
  return lastDot > 0
    ? { name: full.substring(0, lastDot), ext: full.substring(lastDot) }
    : { name: full, ext: "" };
}
