"use client";

import Link from "next/link";
import { CheckCircle, Users } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";

export function FileGrid({ documents }: { documents: Doc<"documents">[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {documents.map((doc) => (
        <Link
          key={doc._id}
          href={`/document/${doc._id}`}
          className="rounded-xl overflow-hidden border border-grey-6 hover:shadow-md transition-shadow bg-white group"
        >
          <div className="aspect-[4/3] bg-grey-7 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-grey-4">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div className="p-3">
            <p className="text-xs font-medium text-pign-black truncate mb-1">
              {doc.name}
            </p>
            <div className="flex items-center gap-2 mb-1">
              {doc.isVerified && (
                <CheckCircle size={12} className="text-pign-black" />
              )}
              {doc.isShared && <Users size={12} className="text-grey-3" />}
            </div>
            <div className="flex items-center justify-between">
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
  );
}
