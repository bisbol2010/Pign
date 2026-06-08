import type { Id } from "@/convex/_generated/dataModel";

export type TrashTab = "all" | "files" | "folders";

export type TrashFileDoc = {
  _id: Id<"documents">;
  _creationTime: number;
  name: string;
  fileType?: string;
  fileSize?: number;
  trashedAt?: number;
  previewUrl: string | null;
};

export type TrashFolderDoc = {
  _id: Id<"folders">;
  _creationTime: number;
  name: string;
  trashedAt?: number;
  totalFileSize: number;
  lastUploadedAt: number;
};

export type TrashRowItem =
  | { kind: "file"; item: TrashFileDoc }
  | { kind: "folder"; item: TrashFolderDoc };

export type TrashSelection =
  | { kind: "file"; id: Id<"documents"> }
  | { kind: "folder"; id: Id<"folders"> }
  | null;
