"use client";

import { useEffect, useRef } from "react";
import {
  DownloadIcon,
  MoveIcon,
  PinIcon,
  RemoveUserIcon,
  SharedIcon,
  VerifiedIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import type { FileDoc } from "@/components/files/types";
import { useFileActionsContext } from "./FileActionsProvider";
import { useFileActions } from "./useFileActions";
import { useVerification } from "@/components/verification/VerificationProvider";

type FileContextMenuProps = {
  doc: FileDoc;
};

const ITEMS = [
  { key: "share", label: "Share", Icon: SharedIcon },
  { key: "download", label: "Download", Icon: DownloadIcon },
  { key: "remove-user", label: "Remove user", Icon: RemoveUserIcon },
  { key: "move", label: "Move", Icon: MoveIcon },
  { key: "pin", label: "Pin to top", Icon: PinIcon },
  { key: "verify", label: "Verify", Icon: VerifiedIcon },
] as const;

export function FileContextMenu({ doc }: FileContextMenuProps) {
  const { menuAnchor, closeMenu, setSelectedId } = useFileActionsContext();
  const { openVerify } = useVerification();
  const {
    download,
    pin,
    openMoveModal,
    openRemoveUserModal,
    openShareModal,
    canDownload,
  } = useFileActions(doc);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuAnchor) return;
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuAnchor, closeMenu]);

  if (!menuAnchor) return null;

  const handleAction = async (key: (typeof ITEMS)[number]["key"]) => {
    setSelectedId(doc._id);
    closeMenu();
    switch (key) {
      case "share":
        openShareModal();
        break;
      case "download":
        if (canDownload) await download();
        break;
      case "remove-user":
        openRemoveUserModal();
        break;
      case "move":
        openMoveModal();
        break;
      case "pin":
        await pin();
        break;
      case "verify":
        openVerify(doc._id);
        break;
    }
  };

  return (
    <div
      ref={ref}
      className="fixed z-50 w-[195px] border border-grey-2 bg-white py-[12px] shadow-[0_0_7px_0_#B3B3B3]"
      style={{ left: menuAnchor.x, top: menuAnchor.y }}
      role="menu"
    >
      {ITEMS.map(({ key, label, Icon }, index) => (
        <div key={key}>
          {index > 0 && <div className="mx-[12px] border-t border-grey-6" />}
          <button
            type="button"
            role="menuitem"
            onClick={() => void handleAction(key)}
            disabled={key === "download" && !canDownload}
            className={cn(
              "flex w-full items-center gap-[16px] px-[16px] py-[10px] text-left text-[16px] text-pign-black transition-colors hover:bg-grey-7",
              key === "download" && !canDownload && "opacity-40"
            )}
          >
            <Icon size={18} className="shrink-0 text-pign-black" />
            {label}
          </button>
        </div>
      ))}
    </div>
  );
}
