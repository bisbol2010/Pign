"use client";

import { useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { FileDoc } from "@/components/files/types";
import { useFileActionsContext } from "./FileActionsProvider";

export function useFileActions(doc: FileDoc | null) {
  const { showToast, openModal } = useFileActionsContext();
  const ensureShareToken = useMutation(api.documents.ensureShareToken);
  const togglePin = useMutation(api.documents.togglePin);
  const moveDocument = useMutation(api.folders.moveDocument);
  const revokeAccess = useMutation(api.shared.revokeAccess);
  const revokeAll = useMutation(api.shared.revokeAllForDocument);

  const fileUrl = useQuery(
    api.documents.getFileUrl,
    doc?.fileId ? { documentId: doc._id } : "skip"
  );

  const collaborators = useQuery(
    api.shared.listByDocument,
    doc ? { documentId: doc._id } : "skip"
  );

  const copyLink = useCallback(async () => {
    if (!doc) return;
    try {
      const token = await ensureShareToken({ id: doc._id });
      const url = `${window.location.origin}/s/${token}`;
      await navigator.clipboard.writeText(url);
      showToast("link-copied");
    } catch {
      showToast({ message: "Could not copy link.", type: "error" });
    }
  }, [doc, ensureShareToken, showToast]);

  const download = useCallback(async () => {
    if (!doc || !fileUrl) return;
    showToast("downloading");
    try {
      const anchor = document.createElement("a");
      anchor.href = fileUrl;
      anchor.download = doc.name;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      showToast("downloaded");
    } catch {
      showToast({ message: "Download failed.", type: "error" });
    }
  }, [doc, fileUrl, showToast]);

  const pin = useCallback(async () => {
    if (!doc) return;
    try {
      const pinned = await togglePin({ id: doc._id });
      if (pinned) showToast("pinned");
    } catch {
      showToast({ message: "Could not pin document.", type: "error" });
    }
  }, [doc, togglePin, showToast]);

  const moveToFolder = useCallback(
    async (folderId: Id<"folders"> | null) => {
      if (!doc) return;
      await moveDocument({ documentId: doc._id, folderId });
    },
    [doc, moveDocument]
  );

  const removeCollaborator = useCallback(
    async (accessId: Id<"sharedAccess">) => {
      await revokeAccess({ id: accessId });
    },
    [revokeAccess]
  );

  const removeAllCollaborators = useCallback(async () => {
    if (!doc) return;
    await revokeAll({ documentId: doc._id });
  }, [doc, revokeAll]);

  return {
    copyLink,
    download,
    pin,
    moveToFolder,
    removeCollaborator,
    removeAllCollaborators,
    openMoveModal: () => openModal("move"),
    openRemoveUserModal: () => openModal("remove-user"),
    openShareModal: () => openModal("share"),
    collaborators: collaborators ?? [],
    canDownload: Boolean(doc?.fileId && fileUrl),
  };
}
