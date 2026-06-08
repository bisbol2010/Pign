"use client";

import { useUpload } from "@/components/upload/UploadProvider";

/** @deprecated Prefer `useUpload` from `@/components/upload`. */
export function useDocumentUpload() {
  const { fileInputRef, items, toast, openFilePicker, uploadFiles } = useUpload();
  const uploading = items.some((i) => i.status === "uploading");
  const uploadError =
    toast === "failed" ? "Upload failed. Please try again." : "";
  return {
    fileInputRef,
    uploading,
    uploadError,
    uploadFiles,
    openFilePicker,
  };
}
