"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RotateCcw, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrashSelection } from "./types";
import { useFileActionsContext } from "@/components/file-actions";

type TrashContextMenuProps = {
  selection: TrashSelection;
  anchor: { x: number; y: number } | null;
  onClose: () => void;
  onActionComplete?: () => void;
};

export function TrashContextMenu({
  selection,
  anchor,
  onClose,
  onActionComplete,
}: TrashContextMenuProps) {
  const { openDeleteConfirm, showToast } = useFileActionsContext();
  const restoreDoc = useMutation(api.trash.restore);
  const restoreFolder = useMutation(api.trash.restoreFolder);
  const shredDoc = useMutation(api.trash.shred);
  const shredFolder = useMutation(api.trash.shredFolder);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!anchor) return;
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [anchor, onClose]);

  if (!anchor || !selection) return null;

  const handleRestore = async () => {
    onClose();
    try {
      if (selection.kind === "file") {
        await restoreDoc({ id: selection.id });
      } else {
        await restoreFolder({ id: selection.id });
      }
      showToast({ message: "Item restored successfully", type: "success" });
      onActionComplete?.();
    } catch {
      showToast({ message: "Failed to restore item.", type: "error" });
    }
  };

  const handleShred = () => {
    openDeleteConfirm({
      title: "Permanently Delete",
      message: "Are you sure you want to permanently delete this item? This action is irreversible.",
      confirmText: "Shred Item",
      onConfirm: async () => {
        onClose();
        try {
          if (selection.kind === "file") {
            await shredDoc({ id: selection.id });
          } else {
            await shredFolder({ id: selection.id });
          }
          showToast({ message: "Item permanently shredded", type: "success" });
          onActionComplete?.();
        } catch {
          showToast({ message: "Failed to delete item.", type: "error" });
        }
      },
    });
  };

  return (
    <div
      ref={ref}
      className="fixed z-50 w-[195px] border border-grey-2 bg-white py-[12px] shadow-[0_0_7px_0_#B3B3B3]"
      style={{ left: anchor.x, top: anchor.y }}
      role="menu"
    >
      <button
        type="button"
        role="menuitem"
        onClick={() => void handleRestore()}
        className="flex w-full items-center gap-[16px] px-[16px] py-[10px] text-left text-[16px] text-pign-black transition-colors hover:bg-grey-7"
      >
        <RotateCcw size={18} className="shrink-0 text-pign-black" />
        Restore
      </button>
      <div className="mx-[12px] border-t border-grey-6" />
      <button
        type="button"
        role="menuitem"
        onClick={() => void handleShred()}
        className={cn(
          "flex w-full items-center gap-[16px] px-[16px] py-[10px] text-left text-[16px] text-pign-black transition-colors hover:bg-grey-7"
        )}
      >
        <Scissors size={18} className="shrink-0 text-pign-black" />
        Delete permanently
      </button>
    </div>
  );
}
