"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PinIcon, TrashIcon, UserAddIcon } from "@/components/icons";
import type { TeamDoc } from "./types";
import { useFileActionsContext } from "@/components/file-actions";

type TeamContextMenuProps = {
  team: TeamDoc;
  anchor: { x: number; y: number } | null;
  onClose: () => void;
  onActionComplete?: () => void;
  onAddMemberRequested?: () => void;
};

export function TeamContextMenu({
  team,
  anchor,
  onClose,
  onActionComplete,
  onAddMemberRequested,
}: TeamContextMenuProps) {
  const { openDeleteConfirm, showToast } = useFileActionsContext();
  const togglePinMutation = useMutation(api.teams.togglePin);
  const removeTeamMutation = useMutation(api.teams.remove);
  
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

  if (!anchor) return null;

  const handleTogglePin = async () => {
    onClose();
    try {
      const isPinned = await togglePinMutation({ id: team._id });
      showToast({
        message: isPinned ? `Pinned "${team.name}" to top` : `Unpinned "${team.name}"`,
        type: "success",
      });
      onActionComplete?.();
    } catch {
      showToast({ message: "Could not toggle team pin.", type: "error" });
    }
  };

  const handleAddMember = () => {
    onClose();
    onAddMemberRequested?.();
  };

  const handleDelete = () => {
    onClose();
    openDeleteConfirm({
      title: "Move Team to Trash",
      message: `Are you sure you want to move the team "${team.name}" to the trash folder?`,
      confirmText: "Move to Trash",
      onConfirm: async () => {
        try {
          await removeTeamMutation({ id: team._id });
          showToast({ message: `Moved "${team.name}" to trash`, type: "success" });
          onActionComplete?.();
        } catch {
          showToast({ message: "Could not delete team.", type: "error" });
        }
      },
    });
  };

  const items = [
    { key: "pin", label: team.isPinned ? "Unpin team" : "Pin team", Icon: PinIcon, action: handleTogglePin },
    { key: "add-member", label: "Add member", Icon: UserAddIcon, action: handleAddMember },
    { key: "delete", label: "Move to trash", Icon: TrashIcon, action: handleDelete },
  ] as const;

  return (
    <div
      ref={ref}
      className="fixed z-50 w-[195px] border border-grey-2 bg-white py-[12px] shadow-[0_0_7px_0_#B3B3B3]"
      style={{ left: anchor.x, top: anchor.y }}
      role="menu"
    >
      {items.map(({ key, label, Icon, action }, index) => (
        <div key={key}>
          {index > 0 && <div className="mx-[12px] border-t border-grey-6" />}
          <button
            type="button"
            role="menuitem"
            onClick={action}
            className="flex w-full items-center gap-[16px] px-[16px] py-[10px] text-left text-[16px] text-pign-black transition-colors hover:bg-grey-7"
          >
            <Icon size={18} className="shrink-0 text-pign-black" />
            {label}
          </button>
        </div>
      ))}
    </div>
  );
}
