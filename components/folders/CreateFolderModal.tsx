"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Modal } from "@/components/ui/Modal";

type CreateFolderModalProps = {
  open: boolean;
  onClose: () => void;
  defaultName: string;
};

export function CreateFolderModal({
  open,
  onClose,
  defaultName,
}: CreateFolderModalProps) {
  const createFolder = useMutation(api.folders.create);
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(defaultName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(defaultName);
      setError("");
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [open, defaultName]);

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      await createFolder({ name });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create folder.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      dismissible={!saving}
      title="New folder"
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
            {saving ? "Creating…" : "Create folder"}
          </button>
        </div>
    </Modal>
  );
}
