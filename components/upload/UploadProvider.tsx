"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { uploadToStorage } from "./uploadToStorage";
import type { UploadItem, UploadToast } from "./types";
import { useVerificationOptional } from "@/components/verification/VerificationProvider";
import { generateThumbnail } from "@/lib/thumbnails";

type UploadContextValue = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  items: UploadItem[];
  toast: UploadToast;
  lastDocumentId: Id<"documents"> | null;
  openFilePicker: () => void;
  uploadFiles: (files: FileList | null) => void;
  cancelUpload: (id: string) => void;
  dismissToast: () => void;
  retryFailed: () => void;
  verifyLastUpload: () => Promise<void>;
};

const UploadContext = createContext<UploadContextValue | null>(null);

function makeId() {
  return `upload-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function UploadProvider({ children }: { children: ReactNode }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllers = useRef(new Map<string, AbortController>());
  const failedFiles = useRef<File[]>([]);
  // Tracks the per-item auto-removal timers so we can clear them on unmount
  // (or when an item is removed early) instead of leaking pending timeouts.
  const removalTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const verification = useVerificationOptional();
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const createDocument = useMutation(api.documents.create);

  const [items, setItems] = useState<UploadItem[]>([]);
  const [toast, setToast] = useState<UploadToast>(null);
  const [lastDocumentId, setLastDocumentId] = useState<Id<"documents"> | null>(
    null
  );

  const updateItem = useCallback((id: string, patch: Partial<UploadItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    abortControllers.current.delete(id);
    const timer = removalTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      removalTimers.current.delete(id);
    }
  }, []);

  // Clear any pending auto-removal timers if the provider unmounts.
  useEffect(() => {
    const timers = removalTimers.current;
    return () => {
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
    };
  }, []);

  const uploadOne = useCallback(
    async (file: File) => {
      const id = makeId();
      const controller = new AbortController();
      abortControllers.current.set(id, controller);

      setItems((prev) => [
        ...prev,
        { id, file, progress: 0, status: "uploading" },
      ]);
      setToast(null);

      try {
        const postUrl = await generateUploadUrl();
        const { storageId } = await uploadToStorage(
          postUrl,
          file,
          (progress) => updateItem(id, { progress }),
          controller.signal
        );

        // Best-effort thumbnail: render a small preview (image downscale or
        // PDF page 1) and upload it as a separate blob. Failures are ignored.
        let thumbnailId: Id<"_storage"> | undefined;
        try {
          const thumb = await generateThumbnail(file);
          if (thumb) {
            const thumbPostUrl = await generateUploadUrl();
            const res = await fetch(thumbPostUrl, {
              method: "POST",
              headers: { "Content-Type": thumb.type },
              body: thumb,
            });
            if (res.ok) {
              const { storageId: thumbStorageId } = await res.json();
              thumbnailId = thumbStorageId as Id<"_storage">;
            }
          }
        } catch {
          /* thumbnail is optional */
        }

        const documentId = await createDocument({
          name: file.name,
          fileId: storageId as Id<"_storage">,
          fileType: file.type,
          fileSize: file.size,
          thumbnailId,
        });

        updateItem(id, {
          progress: 100,
          status: "success",
          documentId,
        });
        setLastDocumentId(documentId);
        setToast("success");

        const timer = setTimeout(() => removeItem(id), 4000);
        removalTimers.current.set(id, timer);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Upload failed. Please try again.";
        if (message === "Upload cancelled") {
          removeItem(id);
          return;
        }
        updateItem(id, {
          status: "error",
          error: message.includes("Storage limit")
            ? message
            : "Upload failed. Please try again.",
        });
        failedFiles.current = [file, ...failedFiles.current.filter((f) => f !== file)];
        setToast("failed");
      }
    },
    [
      createDocument,
      generateUploadUrl,
      removeItem,
      updateItem,
    ]
  );

  const uploadFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;
      failedFiles.current = [];
      void Promise.all(Array.from(files).map((file) => uploadOne(file)));
    },
    [uploadOne]
  );

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const cancelUpload = useCallback((id: string) => {
    abortControllers.current.get(id)?.abort();
    removeItem(id);
  }, [removeItem]);

  const dismissToast = useCallback(() => setToast(null), []);

  // Auto-dismiss the success toast; the "failed" toast persists so the user
  // can still hit Retry.
  useEffect(() => {
    if (toast !== "success") return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const retryFailed = useCallback(() => {
    setItems((prev) => {
      const errored = prev.filter((i) => i.status === "error");
      const toRetry =
        failedFiles.current.length > 0
          ? [...failedFiles.current]
          : errored.map((i) => i.file);
      failedFiles.current = [];
      if (toRetry.length) {
        const list = new DataTransfer();
        toRetry.forEach((f) => list.items.add(f));
        queueMicrotask(() => uploadFiles(list.files));
      }
      return prev.filter((i) => i.status !== "error");
    });
    setToast(null);
  }, [uploadFiles]);

  const verifyLastUpload = useCallback(async () => {
    if (!lastDocumentId) return;
    verification?.openVerify(lastDocumentId);
    dismissToast();
  }, [dismissToast, lastDocumentId, verification]);

  const value = useMemo(
    () => ({
      fileInputRef,
      items,
      toast,
      lastDocumentId,
      openFilePicker,
      uploadFiles,
      cancelUpload,
      dismissToast,
      retryFailed,
      verifyLastUpload,
    }),
    [
      items,
      toast,
      lastDocumentId,
      openFilePicker,
      uploadFiles,
      cancelUpload,
      dismissToast,
      retryFailed,
      verifyLastUpload,
    ]
  );

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
}

export function useUpload() {
  const ctx = useContext(UploadContext);
  if (!ctx) {
    throw new Error("useUpload must be used within UploadProvider");
  }
  return ctx;
}
