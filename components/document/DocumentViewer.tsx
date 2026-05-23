"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function DocumentViewer({ documentId }: { documentId: Id<"documents"> }) {
  const doc = useQuery(api.documents.getById, { id: documentId });
  const fileUrl = useQuery(
    api.documents.getFileUrl,
    doc?.fileId ? { documentId } : "skip"
  );

  if (doc === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-grey-5 border-t-pign-black rounded-full animate-spin" />
      </div>
    );
  }

  if (doc === null) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-grey-3 text-sm">Document not found.</p>
      </div>
    );
  }

  const isImage = doc.fileType?.startsWith("image/");
  const isPdf = doc.fileType === "application/pdf";

  return (
    <div className="flex-1 bg-grey-7 rounded-xl p-6 overflow-auto flex items-start justify-center">
      {fileUrl === undefined ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-grey-5 border-t-pign-black rounded-full animate-spin" />
        </div>
      ) : fileUrl ? (
        <>
          {isImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fileUrl}
              alt={doc.name}
              className="max-w-full max-h-[70vh] rounded-lg shadow-sm"
            />
          )}
          {isPdf && (
            <iframe
              src={fileUrl}
              title={doc.name}
              className="w-full h-[70vh] rounded-lg border-0"
            />
          )}
          {!isImage && !isPdf && (
            <div className="text-center py-12">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-grey-4 mx-auto mb-4">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
              <p className="text-grey-3 mb-4">{doc.name}</p>
              <a
                href={fileUrl}
                download={doc.name}
                className="inline-block bg-pign-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Download file
              </a>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-grey-4 mx-auto mb-4">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
          <p className="text-grey-3">No file attached</p>
        </div>
      )}
    </div>
  );
}
