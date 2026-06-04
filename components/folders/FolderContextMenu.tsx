"use client";

import { useEffect, useRef } from "react";
import { TrashIcon } from "@/components/icons";
import { Pencil } from "lucide-react";
import type { FolderDoc } from "./types";

export type FolderMenuState = {
  folder: FolderDoc;
  x: number;
  y: number;
};

type FolderContextMenuProps = {
  state: FolderMenuState | null;
  onClose: () => void;
  onRename: (folder: FolderDoc) => void;
  onDelete: (folder: FolderDoc) => void;
};

export function FolderContextMenu({
  state,
  onClose,
  onRename,
  onDelete,
}: FolderContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state) return;
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
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
  }, [state, onClose]);

  if (!state) return null;

  return (
    <div
      ref={ref}
      className="fixed z-50 w-[195px] border border-grey-2 bg-white py-[12px] shadow-[0_0_7px_0_#B3B3B3]"
      style={{ left: state.x, top: state.y }}
      role="menu"
    >
      <button
        type="button"
        role="menuitem"
        onClick={() => {
          onRename(state.folder);
          onClose();
        }}
        className="flex w-full items-center gap-[16px] px-[16px] py-[10px] text-left text-[16px] text-pign-black transition-colors hover:bg-grey-7"
      >
        <Pencil size={18} className="shrink-0" />
        Rename
      </button>
      <div className="mx-[12px] border-t border-grey-6" />
      <button
        type="button"
        role="menuitem"
        onClick={() => {
          onDelete(state.folder);
          onClose();
        }}
        className="flex w-full items-center gap-[16px] px-[16px] py-[10px] text-left text-[16px] text-pign-black transition-colors hover:bg-grey-7"
      >
        <TrashIcon size={18} className="shrink-0" />
        Move to trash
      </button>
    </div>
  );
}

/** Shared 3-dot trigger used by folder rows and cards. */
export function FolderMenuButton({
  folder,
  onOpen,
  className,
}: {
  folder: FolderDoc;
  onOpen: (state: FolderMenuState) => void;
  className?: string;
}) {
  if (folder.isSystem) return null;
  return (
    <button
      type="button"
      aria-label="Folder actions"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        onOpen({ folder, x: rect.left - 160, y: rect.bottom + 4 });
      }}
      className={className}
    >
      <MoreVerticalDots />
    </button>
  );
}

function MoreVerticalDots() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}
