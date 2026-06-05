"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { FolderGlyphIcon, FilesIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { useFileActions } from "./useFileActions";
import type { FileDoc } from "@/components/files/types";

const ROOT = "__root__" as const;

type MoveToFolderModalProps = {
  documentId: Id<"documents"> | null;
  open: boolean;
  onClose: () => void;
};

export function MoveToFolderModal({
  documentId,
  open,
  onClose,
}: MoveToFolderModalProps) {
  const folders = useQuery(api.folders.list, open ? {} : "skip");
  const doc = useQuery(
    api.documents.getById,
    open && documentId ? { id: documentId } : "skip"
  ) as FileDoc | null | undefined;
  const { moveToFolder } = useFileActions(
    doc && doc !== undefined ? (doc as FileDoc) : null
  );
  const [selectedId, setSelectedId] = useState<Id<"folders"> | typeof ROOT | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentFolderId = doc?.folderId ?? null;

  useEffect(() => {
    if (open) {
      setSelectedId(null);
      setSaving(false);
      setError(null);
    }
  }, [open]);

  const handleMove = async () => {
    if (!selectedId) return;
    setSaving(true);
    setError(null);
    try {
      await moveToFolder(selectedId === ROOT ? null : selectedId);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not move file.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      dismissible={!saving}
      title="Move to folder"
      className="w-[422px] max-w-[422px]"
    >
      <div className="mt-[28px] max-h-[240px] overflow-y-auto">
        {currentFolderId && (
          <button
            type="button"
            onClick={() => setSelectedId(ROOT)}
            className={cn(
              "flex w-full items-center gap-[16px] py-[14px] text-left transition-colors",
              selectedId === ROOT && "bg-grey-7"
            )}
          >
            <FilesIcon size={31} className="shrink-0" />
            <span className="text-[16px] font-medium text-pign-black">
              All files (no folder)
            </span>
          </button>
        )}
        {folders === undefined ? (
          <p className="text-[14px] text-grey-3">Loading folders…</p>
        ) : folders.length === 0 ? (
          <p className="text-[14px] text-grey-3">No folders yet.</p>
        ) : (
          folders.map((folder, index) => (
            <div key={folder._id}>
              {(index > 0 || currentFolderId) && (
                <div className="border-t border-grey-6" />
              )}
              <button
                type="button"
                disabled={folder._id === currentFolderId}
                onClick={() => setSelectedId(folder._id)}
                className={cn(
                  "flex w-full items-center gap-[16px] py-[14px] text-left transition-colors disabled:opacity-40",
                  selectedId === folder._id && "bg-grey-7"
                )}
              >
                <FolderGlyphIcon size={31} className="shrink-0" />
                <span className="text-[16px] font-medium text-pign-black">
                  {folder.name}
                  {folder._id === currentFolderId && (
                    <span className="ml-[8px] text-[12px] text-grey-4">
                      Current
                    </span>
                  )}
                </span>
              </button>
            </div>
          ))
        )}
      </div>
      {error && (
        <p className="mt-[16px] text-[12px] font-medium text-verify-red">
          {error}
        </p>
      )}
      <div className="mt-[28px] flex items-center justify-end gap-[24px]">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="text-[16px] text-pign-black/90 transition-opacity hover:opacity-70 disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void handleMove()}
          disabled={saving || !selectedId}
          className={cn(
            "text-[16px] font-medium transition-opacity hover:opacity-70 disabled:opacity-40 flex items-center gap-[8px]",
            selectedId ? "text-pign-black/90" : "text-grey-4"
          )}
        >
          {saving && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-pign-black/30 border-t-pign-black" />
          )}
          {saving ? "Moving…" : "Move"}
        </button>
      </div>
    </Modal>
  );
}
