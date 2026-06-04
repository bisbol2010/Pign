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
import type { Id } from "@/convex/_generated/dataModel";
import { FileActionToastBanner } from "./FileActionToast";
import { MoveToFolderModal } from "./MoveToFolderModal";
import { RemoveUserModal } from "./RemoveUserModal";
import { ShareRecipientModal } from "./ShareRecipientModal";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import type {
  FileActionModal,
  FileActionToast,
  FileActionsContextValue,
  DeleteConfirmConfig,
} from "./types";

const FileActionsContext = createContext<FileActionsContextValue | null>(null);

export function FileActionsProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<Id<"documents"> | null>(null);
  const [toast, setToast] = useState<FileActionToast>(null);
  const [modal, setModal] = useState<FileActionModal>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(
    null
  );
  const [deleteConfirmConfig, setDeleteConfirmConfig] = useState<DeleteConfirmConfig | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((next: NonNullable<FileActionToast>) => {
    setToast(next);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
      toastTimer.current = null;
    }
    setToast(null);
  }, []);

  // Auto-dismiss toasts after a short delay. The transitional "downloading"
  // state is left alone so it can resolve into "downloaded".
  useEffect(() => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
      toastTimer.current = null;
    }
    if (!toast || toast === "downloading") return;
    toastTimer.current = setTimeout(() => setToast(null), 3500);
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
        toastTimer.current = null;
      }
    };
  }, [toast]);

  const openModal = useCallback((next: NonNullable<FileActionModal>) => {
    setModal(next);
    setMenuAnchor(null);
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const openMenu = useCallback((anchor: { x: number; y: number }) => {
    setMenuAnchor(anchor);
  }, []);

  const closeMenu = useCallback(() => setMenuAnchor(null), []);

  const openDeleteConfirm = useCallback((config: DeleteConfirmConfig) => {
    setDeleteConfirmConfig(config);
    setMenuAnchor(null);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setDeleteConfirmConfig(null);
  }, []);

  const value = useMemo(
    () => ({
      selectedId,
      setSelectedId,
      toast,
      showToast,
      dismissToast,
      modal,
      openModal,
      closeModal,
      menuAnchor,
      openMenu,
      closeMenu,
      openDeleteConfirm,
      closeDeleteConfirm,
    }),
    [
      selectedId,
      toast,
      showToast,
      dismissToast,
      modal,
      openModal,
      closeModal,
      menuAnchor,
      openMenu,
      closeMenu,
      openDeleteConfirm,
      closeDeleteConfirm,
    ]
  );

  return (
    <FileActionsContext.Provider value={value}>
      <FileActionToastBanner />
      {children}
      <MoveToFolderModal
        documentId={selectedId}
        open={modal === "move"}
        onClose={closeModal}
      />
      <RemoveUserModal
        documentId={selectedId}
        open={modal === "remove-user"}
        onClose={closeModal}
      />
      <ShareRecipientModal
        documentId={selectedId}
        open={modal === "share"}
        onClose={closeModal}
      />
      <DeleteConfirmDialog
        config={deleteConfirmConfig}
        onClose={closeDeleteConfirm}
      />
    </FileActionsContext.Provider>
  );
}

export function useFileActionsContext() {
  const ctx = useContext(FileActionsContext);
  if (!ctx) {
    throw new Error("useFileActionsContext must be used within FileActionsProvider");
  }
  return ctx;
}
