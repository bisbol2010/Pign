"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TopBar } from "@/components/layout/TopBar";
import { FILE_GRID_COLS } from "@/components/files/FileRow";
import {
  FileGlyphIcon,
  SharedCellIcon,
  VerifiedIcon,
} from "@/components/icons";
import { formatDate, formatFileSize, cn } from "@/lib/utils";
import { VerificationCell } from "./VerificationCell";
import { useVerification } from "./VerificationProvider";
import type { DocumentVerificationStatus } from "./types";

const TABS: { id: DocumentVerificationStatus; label: string }[] = [
  { id: "verified", label: "Verified" },
  { id: "pending", label: "Pending" },
  { id: "unverified", label: "Unverified" },
  { id: "failed", label: "Failed" },
];

type VerifiedFilesViewProps = {
  initialTab?: DocumentVerificationStatus;
};

export function VerifiedFilesView({
  initialTab = "unverified",
}: VerifiedFilesViewProps) {
  const [tab, setTab] = useState<DocumentVerificationStatus>(initialTab);
  const { openVerify } = useVerification();
  const documents = useQuery(api.verification.listForVerificationHub, {
    filter: tab,
  });

  const isLoading = documents === undefined;
  const isEmpty = documents !== undefined && documents.length === 0;

  return (
    <>
      <TopBar title="Verification" />
      <div className="flex-1 overflow-y-auto pb-10">
        <div className="mt-[28px] flex items-center gap-[24px] border-b border-grey-6 pl-[30px] pr-[35px]">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "pb-3 text-[18px] transition-colors",
                tab === id
                  ? "border-b-2 border-pign-black font-medium text-pign-black"
                  : "text-grey-5 hover:text-grey-3"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-[16px]">
          <div
            className={`h-[28px] bg-grey-7 text-[14px] text-grey-3 ${FILE_GRID_COLS}`}
          >
            <span>NAME</span>
            <span className="text-center">SHARED</span>
            <span className="text-center">VERIFIED</span>
            <span className="text-center">SIZE</span>
            <span className="text-center">DATE VERIFIED</span>
            <span />
          </div>

          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`border-b border-grey-6 ${FILE_GRID_COLS} py-[13px]`}
              >
                <div className="h-[14px] w-48 animate-pulse rounded bg-grey-6" />
              </div>
            ))}

          {isEmpty && <VerificationEmptyState tab={tab} />}

          {documents?.map((doc) => {
            const { name, ext } = splitName(doc.name);
            return (
              <div
                key={doc._id}
                className={`group border-b border-grey-6 hover:bg-grey-7 ${FILE_GRID_COLS}`}
              >
                <Link
                  href={`/document/${doc._id}`}
                  className="flex min-w-0 items-center gap-[16px] py-[13px]"
                >
                  <Thumb doc={doc} />
                  <p className="truncate text-[16px]">
                    <span className="font-medium text-pign-black">{name}</span>
                    <span className="text-grey-4"> {ext}</span>
                  </p>
                </Link>
                <div className="flex justify-center">
                  {doc.isShared && (
                    <SharedCellIcon size={24} className="text-grey-2" />
                  )}
                </div>
                <VerificationCell
                  doc={doc}
                  onVerify={() => openVerify(doc._id)}
                />
                <div className="text-center text-[16px] text-grey-2">
                  {doc.fileSize ? formatFileSize(doc.fileSize) : "—"}
                </div>
                <div className="text-center text-[16px] text-grey-2">
                  {doc.verifiedAt
                    ? formatDate(doc.verifiedAt)
                    : doc.verificationStatus === "verified"
                      ? formatDate(doc._creationTime)
                      : "—"}
                </div>
                <div />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

const EMPTY_COPY: Record<
  DocumentVerificationStatus,
  { title: string; body: string }
> = {
  verified: {
    title: "No verified documents yet",
    body: "Verify a file to lock it to your identity. Verified files appear here with a tamper-proof record.",
  },
  pending: {
    title: "Nothing pending",
    body: "Documents you submit for verification will show here while they are being processed.",
  },
  unverified: {
    title: "All caught up",
    body: "Upload a document and verify it to prove it is the genuine, unaltered original.",
  },
  failed: {
    title: "No failed verifications",
    body: "If a verification can't be completed, it will show up here so you can retry.",
  },
};

function VerificationEmptyState({
  tab,
}: {
  tab: DocumentVerificationStatus;
}) {
  const copy = EMPTY_COPY[tab];
  return (
    <div className="flex flex-col items-center justify-center px-[30px] py-20 text-center">
      <div className="flex size-[72px] items-center justify-center rounded-full bg-grey-7">
        <VerifiedIcon size={36} className="text-grey-3" />
      </div>
      <p className="mt-5 text-[18px] font-medium text-pign-black">
        {copy.title}
      </p>
      <p className="mt-2 max-w-[420px] text-[15px] text-grey-3">{copy.body}</p>
      {tab === "unverified" ? (
        <Link
          href="/dashboard"
          className="mt-6 flex h-[44px] items-center bg-pign-black px-[20px] text-[15px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Go to My files
        </Link>
      ) : null}
    </div>
  );
}

function splitName(full: string) {
  const lastDot = full.lastIndexOf(".");
  return lastDot > 0
    ? { name: full.substring(0, lastDot), ext: full.substring(lastDot) }
    : { name: full, ext: "" };
}

function Thumb({
  doc,
}: {
  doc: { previewUrl?: string | null; name: string; fileType?: string };
}) {
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
  return <FileGlyphIcon size={31} className="shrink-0" />;
}
