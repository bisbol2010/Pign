"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function EmptyState() {
  const fileInput = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const createDocument = useMutation(api.documents.create);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    setUploadError("");
    try {
      for (const file of Array.from(files)) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        await createDocument({
          name: file.name,
          fileId: storageId,
          fileType: file.type,
          fileSize: file.size,
        });
      }
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-40 h-40 mb-6">
        <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
          <path
            d="M40 120V50a8 8 0 018-8h40l12 12h12a8 8 0 018 8v58a8 8 0 01-8 8H48a8 8 0 01-8-8z"
            fill="#E5E5E5"
            stroke="#B3B3B3"
            strokeWidth="2"
          />
          <path d="M100 40l-8-8" stroke="#B3B3B3" strokeWidth="2" strokeLinecap="round" />
          <circle cx="72" cy="90" r="3" fill="#808080" />
          <circle cx="88" cy="90" r="3" fill="#808080" />
          <path d="M68 100a12 12 0 0124 0" stroke="#808080" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-pign-black mb-1">
        It&apos;s quite empty here
      </h3>
      <p className="text-sm text-grey-3 mb-6">
        Why not upload a file or two?
      </p>
      <p className="text-xs text-grey-4 mb-4">Drag and drop your file here</p>
      <input
        ref={fileInput}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />
      <button
        onClick={() => fileInput.current?.click()}
        disabled={uploading}
        className="bg-pign-black text-white px-8 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {uploading ? "Uploading…" : "Upload"}
      </button>
      {uploadError && (
        <p className="text-sm text-red-500 mt-2">{uploadError}</p>
      )}
    </div>
  );
}
