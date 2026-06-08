"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Modal } from "@/components/ui/Modal";
import type { Id } from "@/convex/_generated/dataModel";

type RenameFolderModalProps = {
  open: boolean;
  folderId: Id<"folders"> | null;
  initialName: string;
  onClose: () => void;
};

export function RenameFolderModal({
  open,
  folderId,
  initialName,
  onClose,
}: RenameFolderModalProps) {
  const renameFolder = useMutation(api.folders.rename);
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(initialName);
      setError("");
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [open, initialName]);

  const handleSubmit = async () => {
    if (!folderId) return;
    setSaving(true);
    setError("");
    try {
      await renameFolder({ id: folderId, name });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not rename folder.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open && folderId !== null}
      onClose={onClose}
      dismissible={!saving}
      title="Rename folder"
      className="w-[422px] max-w-[422px]"
    >
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void handleSubmit();
            if (e.key === "Escape") onClose();
          }}
          className="mt-[28px] h-[46px] w-full border border-pign-black/60 px-[12px] text-[16px] text-pign-black focus:outline-none focus:ring-1 focus:ring-pign-black"
          aria-label="Folder name"
        />
        {error && (
          <p className="mt-2 text-[14px] text-red-600">{error}</p>
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
            onClick={() => void handleSubmit()}
            disabled={saving || !name.trim()}
            className="text-[16px] font-medium text-pign-black/90 transition-opacity hover:opacity-70 disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
    </Modal>
  );
}
