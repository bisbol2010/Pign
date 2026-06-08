import type { Id } from "@/convex/_generated/dataModel";

export type FileActionToast =
  | "link-copied"
  | "pinned"
  | "downloading"
  | "downloaded"
  | string
  | { message: string; type?: "success" | "error" | "info" }
  | null;

export type FileActionModal = "move" | "remove-user" | "share" | "delete-confirm" | null;

export type DeleteConfirmConfig = {
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void | Promise<void>;
};

export type FileActionsContextValue = {
  selectedId: Id<"documents"> | null;
  setSelectedId: (id: Id<"documents"> | null) => void;
  toast: FileActionToast;
  showToast: (toast: NonNullable<FileActionToast>) => void;
  dismissToast: () => void;
  modal: FileActionModal;
  openModal: (modal: NonNullable<FileActionModal>) => void;
  closeModal: () => void;
  menuAnchor: { x: number; y: number } | null;
  openMenu: (anchor: { x: number; y: number }) => void;
  closeMenu: () => void;
  openDeleteConfirm: (config: DeleteConfirmConfig) => void;
  closeDeleteConfirm: () => void;
};
