"use client";

import { forwardRef } from "react";

type DocumentFileInputProps = {
  onFiles: (files: FileList | null) => void;
};

export const DocumentFileInput = forwardRef<
  HTMLInputElement,
  DocumentFileInputProps
>(function DocumentFileInput({ onFiles }, ref) {
  return (
    <input
      ref={ref}
      type="file"
      multiple
      className="hidden"
      onChange={(e) => {
        onFiles(e.target.files);
        e.target.value = "";
      }}
    />
  );
});
