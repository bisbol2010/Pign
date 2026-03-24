"use client";

import { TopBar } from "@/components/layout/TopBar";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trash2, RotateCcw, Scissors } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils";

export default function TrashPage() {
  const trashedDocs = useQuery(api.trash.list);
  const restoreDoc = useMutation(api.trash.restore);
  const shredDoc = useMutation(api.trash.shred);

  return (
    <>
      <TopBar title="Trash" />
      <div className="flex-1 p-6 overflow-y-auto">
        <p className="text-sm text-grey-3 mb-6">
          Trashed documents. Shred to permanently delete.
        </p>

        {trashedDocs === undefined ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-grey-5 border-t-pign-black rounded-full animate-spin" />
          </div>
        ) : trashedDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Trash2 size={48} className="text-grey-5 mb-4" />
            <h3 className="text-lg font-medium text-pign-black mb-1">
              Trash is empty
            </h3>
            <p className="text-sm text-grey-3">
              Deleted documents will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-grey-6">
            <div className="flex items-center px-4 py-2.5 border-b border-grey-6 text-xs font-medium text-grey-3 uppercase tracking-wider">
              <div className="flex-1">Name</div>
              <div className="w-20 text-right">Size</div>
              <div className="w-28 text-right">Deleted</div>
              <div className="w-24" />
            </div>
            {trashedDocs.map((doc) => (
              <div
                key={doc._id}
                className="flex items-center px-4 py-3 border-b border-grey-6 last:border-0 hover:bg-grey-7 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded bg-grey-7 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-grey-3">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <path d="M14 2v6h6" />
                    </svg>
                  </div>
                  <p className="text-sm text-pign-black truncate">{doc.name}</p>
                </div>
                <div className="w-20 text-right">
                  <span className="text-sm text-grey-3">
                    {doc.fileSize ? formatFileSize(doc.fileSize) : "—"}
                  </span>
                </div>
                <div className="w-28 text-right">
                  <span className="text-sm text-grey-3">
                    {doc.trashedAt ? formatDate(doc.trashedAt) : "—"}
                  </span>
                </div>
                <div className="w-24 flex justify-end gap-1">
                  <button
                    onClick={() => restoreDoc({ id: doc._id })}
                    className="w-7 h-7 rounded flex items-center justify-center hover:bg-white transition-colors"
                    title="Restore"
                  >
                    <RotateCcw size={14} className="text-grey-3" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Permanently delete this document? This cannot be undone.")) {
                        shredDoc({ id: doc._id });
                      }
                    }}
                    className="w-7 h-7 rounded flex items-center justify-center hover:bg-red-50 transition-colors"
                    title="Shred permanently"
                  >
                    <Scissors size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
