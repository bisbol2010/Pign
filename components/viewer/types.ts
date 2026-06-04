import type { FileDoc } from "@/components/files/types";

export type ViewerAccess =
  | { role: "owner"; permission: "edit" }
  | { role: "shared"; permission: "view" | "edit" }
  | { role: "link"; permission: "view" };

export type ViewerDoc = FileDoc;

export type ViewerQueryOk = {
  status: "ok";
  doc: ViewerDoc;
  access: ViewerAccess;
  pageCount?: number | null;
};

export type ViewerQueryDenied = {
  status: "denied";
  name: string;
  isVerified: boolean;
  isShared: boolean;
  contentHash: string | null;
};

export type ViewerQueryResult =
  | ViewerQueryOk
  | ViewerQueryDenied
  | { status: "not_found" };

export function splitFileName(full: string) {
  const lastDot = full.lastIndexOf(".");
  return lastDot > 0
    ? { name: full.substring(0, lastDot), ext: full.substring(lastDot) }
    : { name: full, ext: "" };
}

export function canEditDocument(access: ViewerAccess | undefined) {
  return access?.role === "owner" || access?.permission === "edit";
}

export function isViewOnly(access: ViewerAccess | undefined) {
  if (!access) return false;
  return access.role === "shared" && access.permission === "view";
}
