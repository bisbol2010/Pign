"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import type { DeleteConfirmConfig } from "./types";

type DeleteConfirmDialogProps = {
  config: DeleteConfirmConfig | null;
  onClose: () => void;
};

export function DeleteConfirmDialog({
  config,
  onClose,
}: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!config) return;
    setLoading(true);
    try {
      await config.onConfirm();
      onClose();
    } catch (err) {
      console.error("Confirmation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={config !== null}
      onClose={onClose}
      dismissible={!loading}
      overlayClassName="z-[100]"
      className="flex w-[422px] max-w-[422px] flex-col gap-[20px]"
      title={config?.title}
    >
      <div className="flex flex-col gap-[8px]">
        <p className="text-[14px] leading-relaxed text-grey-2">
          {config?.message}
        </p>
      </div>

      <div className="flex items-center justify-end gap-[16px]">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-[16px] py-[10px] text-[14px] font-medium text-grey-2 hover:bg-grey-7 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void handleConfirm()}
          disabled={loading}
          className="flex items-center gap-[8px] bg-verify-red px-[16px] py-[10px] text-[14px] font-medium text-white transition-colors hover:bg-verify-red/90 disabled:opacity-50"
        >
          {loading && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          )}
          {config?.confirmText || "Delete"}
        </button>
      </div>
    </Modal>
  );
}
