"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { UploadFileGlyphIcon } from "@/components/icons";
import { useUpload } from "./UploadProvider";
import { DocumentFileInput } from "./DocumentFileInput";

/** Sidebar drag-and-drop upload area (Phase 1 shell + Phase 4 wiring). */
export function SidebarUploadZone() {
  const { openFilePicker, uploadFiles, fileInputRef } = useUpload();
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      uploadFiles(e.dataTransfer.files);
    },
    [uploadFiles]
  );

  return (
    <div className="pl-[21px] pr-[25px] pt-[40px]">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex h-[267px] flex-col items-center border border-dashed px-[15px] pb-[16px] pt-[61px] transition-colors",
          isDragging ? "border-pign-black bg-grey-7" : "border-pign-black"
        )}
      >
        <UploadFileGlyphIcon className="text-grey-5" />
        <p className="mt-[25px] text-center text-[14px] leading-[1.4] text-pign-black">
          Drag and drop your
          <br />
          documents and images here
        </p>
        <DocumentFileInput ref={fileInputRef} onFiles={uploadFiles} />
        <button
          type="button"
          onClick={openFilePicker}
          className="mt-auto h-[56px] w-full bg-pign-black text-[16px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
