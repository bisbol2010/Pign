import type { Id } from "@/convex/_generated/dataModel";

export type UploadItemStatus = "uploading" | "success" | "error" | "cancelled";

export type UploadItem = {
  id: string;
  file: File;
  progress: number;
  status: UploadItemStatus;
  documentId?: Id<"documents">;
  error?: string;
};

export type UploadToast = "success" | "failed" | null;
