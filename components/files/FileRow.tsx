"use client";

import { CheckCircle, Plus, Users } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";

export function FileRow({ doc }: { doc: Doc<"documents"> }) {
  const verifyDoc = useMutation(api.documents.verify);

  return (
    <Link
      href={`/document/${doc._id}`}
      className="flex items-center px-4 py-3 hover:bg-grey-7 transition-colors border-b border-grey-6 group"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded bg-grey-7 flex items-center justify-center flex-shrink-0">
          <FileIcon fileType={doc.fileType} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-pign-black truncate">
            <span className="font-medium">{getFileName(doc.name)}</span>
            <span className="text-grey-3"> {getFileExtension(doc.name)}</span>
          </p>
        </div>
      </div>

      <div className="w-20 flex justify-center">
        {doc.isShared ? (
          <Users size={16} className="text-grey-3" />
        ) : (
          <span className="text-grey-5">—</span>
        )}
      </div>

      <div className="w-24 flex justify-center">
        {doc.isVerified ? (
          <CheckCircle size={16} className="text-pign-black" />
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              verifyDoc({ id: doc._id });
            }}
            className="text-xs text-grey-3 hover:text-pign-black flex items-center gap-1 transition-colors"
          >
            <Plus size={12} />
            Verify now
          </button>
        )}
      </div>

      <div className="w-20 text-right">
        <span className="text-sm text-grey-3">
          {doc.fileSize ? formatFileSize(doc.fileSize) : "—"}
        </span>
      </div>

      <div className="w-28 text-right">
        <span className="text-sm text-grey-3">
          {formatDate(doc._creationTime)}
        </span>
      </div>
    </Link>
  );
}

function getFileName(name: string) {
  const lastDot = name.lastIndexOf(".");
  return lastDot > 0 ? name.substring(0, lastDot) : name;
}

function getFileExtension(name: string) {
  const lastDot = name.lastIndexOf(".");
  return lastDot > 0 ? name.substring(lastDot) : "";
}

function FileIcon({ fileType }: { fileType?: string }) {
  if (fileType?.startsWith("image/")) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-grey-3">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-grey-3">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}
