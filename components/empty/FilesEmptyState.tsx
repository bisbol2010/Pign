"use client";

import { FolderDuotone } from "@/components/illustrations";
import { EmptyStateLayout } from "./EmptyStateLayout";
import { useDocumentUpload } from "./useDocumentUpload";

export function FilesEmptyState() {
  const { uploading, uploadError, openFilePicker } = useDocumentUpload();

  return (
    <>
      <EmptyStateLayout
        illustration={
          <FolderDuotone className="h-[200px] w-[200px] text-pign-black" />
        }
        title="It's quite empty here"
        subtitle="Why not upload a file or two?"
        hint="Drag and drop your file here"
        action={
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={openFilePicker}
              disabled={uploading}
              className="h-[56px] w-[224px] bg-pign-black text-[16px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
            {uploadError ? (
              <p className="mt-2 text-[14px] text-red-600">{uploadError}</p>
            ) : null}
          </div>
        }
      />
    </>
  );
}
