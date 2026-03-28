"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { CheckCircle, Users } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils";

export function RecentFiles() {
  const recentDocs = useQuery(api.documents.getRecent);

  if (recentDocs === undefined) return null;
  if (recentDocs.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-sm font-medium text-grey-3 mb-3">Recent</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {recentDocs.map((doc) => (
          <Link
            key={doc._id}
            href={`/document/${doc._id}`}
            className="flex-shrink-0 w-44 rounded-xl overflow-hidden border border-grey-6 hover:shadow-md transition-shadow bg-white group"
          >
            <div className="h-24 bg-grey-7 flex items-center justify-center">
              <FileThumb fileType={doc.fileType} />
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-pign-black truncate">
                {doc.name}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                {doc.isVerified && (
                  <CheckCircle size={12} className="text-pign-black" />
                )}
                {doc.isShared && (
                  <Users size={12} className="text-grey-3" />
                )}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-grey-4">
                  {doc.fileSize ? formatFileSize(doc.fileSize) : ""}
                </span>
                <span className="text-[10px] text-grey-4">
                  {formatDate(doc._creationTime)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FileThumb({ fileType }: { fileType?: string }) {
  if (fileType?.startsWith("image/")) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-grey-6 to-grey-5 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-grey-3">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-full h-full bg-grey-7 flex items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-grey-3">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    </div>
  );
}
