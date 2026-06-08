import { Doc } from "@/convex/_generated/dataModel";

export type FolderDoc = Doc<"folders"> & {
  documentCount: number;
  totalFileSize: number;
  lastUploadedAt: number;
};
