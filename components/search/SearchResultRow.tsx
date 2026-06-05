"use client";

import { useState } from "react";
import Link from "next/link";
import { formatFileSize, formatDate } from "@/lib/utils";
import {
  FileGlyphIcon,
  FolderGlyphIcon,
  VerifiedIcon,
} from "@/components/icons";
import { HighlightMatch } from "./highlight";
import type {
  SearchEmailHit,
  SearchFileHit,
  SearchFolderHit,
  SearchPeopleHit,
} from "./types";

type SearchResultRowProps = {
  query: string;
  kind: "file" | "folder" | "email" | "people";
  file?: SearchFileHit;
  folder?: SearchFolderHit;
  email?: SearchEmailHit;
  person?: SearchPeopleHit;
};

export function SearchResultRow({
  query,
  kind,
  file,
  folder,
  email,
  person,
}: SearchResultRowProps) {
  if (kind === "file" && file) {
    const { name, ext } = splitName(file.name);
    return (
      <Link
        href={`/document/${file._id}`}
        className="flex items-center gap-[16px] border-b border-grey-6 px-[30px] py-[13px] transition-colors hover:bg-grey-7"
      >
        <FileThumb file={file} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px]">
            <HighlightMatch text={name} query={query} />
            {ext ? <span className="text-grey-4"> {ext}</span> : null}
          </p>
          {file.snippet ? (
            <p className="mt-[4px] truncate text-[14px] text-grey-3">
              <HighlightMatch text={file.snippet} query={query} />
            </p>
          ) : null}
        </div>
        <span className="shrink-0 text-[14px] capitalize text-grey-4">files</span>
      </Link>
    );
  }

  if (kind === "folder" && folder) {
    return (
      <Link
        href={`/dashboard/folders/${folder._id}`}
        className="flex items-center gap-[16px] border-b border-grey-6 px-[30px] py-[13px] transition-colors hover:bg-grey-7"
      >
        <FolderGlyphIcon size={31} className="shrink-0 text-grey-2" />
        <p className="min-w-0 flex-1 truncate text-[16px] font-medium">
          <HighlightMatch text={folder.name} query={query} />
        </p>
        <span className="shrink-0 text-[14px] capitalize text-grey-4">
          folders
        </span>
      </Link>
    );
  }

  if (kind === "email" && email) {
    const label =
      email.subject?.trim() ||
      email.snippet ||
      email.recipientEmail ||
      "(no subject)";
    return (
      <Link
        href={`/emails/${email._id}`}
        className="flex items-center gap-[16px] border-b border-grey-6 px-[30px] py-[13px] transition-colors hover:bg-grey-7"
      >
        <div className="flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-[4px] bg-grey-7 text-[12px] text-grey-3">
          @
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] text-grey-3">
            <HighlightMatch text={label} query={query} />
          </p>
          {email.snippet && email.subject ? (
            <p className="mt-[4px] truncate text-[14px] text-grey-4">
              <HighlightMatch text={email.snippet} query={query} />
            </p>
          ) : null}
        </div>
        <span className="shrink-0 text-[14px] capitalize text-grey-4">
          emails
        </span>
      </Link>
    );
  }

  if (kind === "people" && person) {
    const content = (
      <>
        <div className="flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full bg-grey-7 text-[12px] text-grey-3">
          @
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-medium">
            <HighlightMatch text={person.email} query={query} />
          </p>
          {person.documentName ? (
            <p className="mt-[4px] truncate text-[14px] text-grey-3">
              Shared on {person.documentName}
            </p>
          ) : null}
        </div>
        <span className="shrink-0 text-[14px] capitalize text-grey-4">
          people
        </span>
      </>
    );

    if (person.documentId) {
      return (
        <Link
          href={`/document/${person.documentId}`}
          className="flex items-center gap-[16px] border-b border-grey-6 px-[30px] py-[13px] transition-colors hover:bg-grey-7"
        >
          {content}
        </Link>
      );
    }

    return (
      <div className="flex items-center gap-[16px] border-b border-grey-6 px-[30px] py-[13px]">
        {content}
      </div>
    );
  }

  return null;
}

function FileThumb({ file }: { file: SearchFileHit }) {
  const [hasError, setHasError] = useState(false);
  if (file.previewUrl && !hasError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={file.previewUrl}
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

export const SEARCH_FILE_GRID_COLS =
  "grid grid-cols-[1fr_96px_96px_130px] items-center pl-[30px] pr-[35px]";

/** File table row variant for list view with full columns (Figma file list). */
export function SearchFileTableRow({
  file,
  query,
  selected,
  onSelect,
}: {
  file: SearchFileHit;
  query: string;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const { name, ext } = splitName(file.name);

  return (
    <div
      role="row"
      aria-selected={selected}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (!onSelect) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`${SEARCH_FILE_GRID_COLS} cursor-pointer border-b border-grey-6 transition-colors hover:bg-grey-7 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pign-black ${
        selected ? "border border-grey-2 bg-grey-7/60" : ""
      }`}
    >
      <Link
        href={`/document/${file._id}`}
        onClick={(e) => e.stopPropagation()}
        className="flex min-w-0 items-center gap-[16px] py-[13px]"
      >
        <FileThumb file={file} />
        <div className="min-w-0">
          <p className="truncate text-[16px]">
            <HighlightMatch text={name} query={query} />
            {ext ? <span className="text-grey-4"> {ext}</span> : null}
          </p>
          {file.snippet ? (
            <p className="mt-[2px] truncate text-[14px] text-grey-3">
              <HighlightMatch text={file.snippet} query={query} />
            </p>
          ) : null}
        </div>
      </Link>
      <div className="text-center">
        {file.isVerified ? (
          <VerifiedIcon size={24} className="mx-auto text-grey-2" />
        ) : null}
      </div>
      <div className="text-center text-[16px] text-grey-2">
        {file.fileSize ? formatFileSize(file.fileSize) : "—"}
      </div>
      <div className="text-center text-[16px] text-grey-2">
        {formatDate(file._creationTime)}
      </div>
    </div>
  );
}
