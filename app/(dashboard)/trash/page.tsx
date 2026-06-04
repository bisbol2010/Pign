"use client";

import { TopBar } from "@/components/layout/TopBar";
import {
  TrashContextMenu,
  TrashEmptyState,
  TrashFileList,
  TrashSkeleton,
  type TrashRowItem,
  type TrashSelection,
  type TrashTab,
} from "@/components/trash";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useFileActionsContext } from "@/components/file-actions";

const TABS: { id: TrashTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "files", label: "Files" },
  { id: "folders", label: "Folders" },
];

export default function TrashPage() {
  const { openDeleteConfirm, showToast } = useFileActionsContext();
  const trashData = useQuery(api.trash.list);
  const emptyAll = useMutation(api.trash.emptyAll);
  const [activeTab, setActiveTab] = useState<TrashTab>("all");
  const [selection, setSelection] = useState<TrashSelection>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(
    null
  );

  const rows = useMemo(() => {
    if (!trashData) return undefined;
    const fileRows: TrashRowItem[] = trashData.files.map((item) => ({
      kind: "file",
      item,
    }));
    const folderRows: TrashRowItem[] = trashData.folders.map((item) => ({
      kind: "folder",
      item,
    }));

    if (activeTab === "files") return fileRows;
    if (activeTab === "folders") return folderRows;
    return [...fileRows, ...folderRows].sort(
      (a, b) =>
        (b.item.trashedAt ?? b.item._creationTime) -
        (a.item.trashedAt ?? a.item._creationTime)
    );
  }, [trashData, activeTab]);

  const isLoading = trashData === undefined;
  const isEmpty = rows !== undefined && rows.length === 0;
  const showType = activeTab === "all";
  const hasAnyTrash =
    trashData !== undefined &&
    (trashData.files.length > 0 || trashData.folders.length > 0);

  const switchTab = (tab: TrashTab) => {
    setActiveTab(tab);
    setSelection(null);
    setMenuAnchor(null);
  };

  const handleEmptyTrash = () => {
    openDeleteConfirm({
      title: "Empty Trash",
      message: "Are you sure you want to permanently delete everything in the trash? This action is irreversible.",
      confirmText: "Empty Trash",
      onConfirm: async () => {
        try {
          await emptyAll({});
          setSelection(null);
          setMenuAnchor(null);
          showToast({ message: "Trash emptied successfully", type: "success" });
        } catch {
          showToast({ message: "Failed to empty trash.", type: "error" });
        }
      },
    });
  };

  return (
    <>
      <TopBar title="Trash" />
      <div className="min-w-0 flex-1 overflow-y-auto pb-10">
        <div className="mt-[28px] flex items-center justify-between pl-[30px] pr-[35px]">
          <div className="flex items-center gap-[18px]">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => switchTab(id)}
                className={cn(
                  "text-[18px] transition-colors",
                  activeTab === id
                    ? "font-medium text-pign-black"
                    : "text-grey-5 hover:text-grey-3"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {hasAnyTrash ? (
            <button
              type="button"
              onClick={() => void handleEmptyTrash()}
              className="text-[14px] text-grey-3 transition-colors hover:text-pign-black"
            >
              Empty trash
            </button>
          ) : null}
        </div>

        <div className="mt-[16px]">
          {isLoading && <TrashSkeleton showType={showType} />}

          {isEmpty && <TrashEmptyState tab={activeTab} />}

          {rows && rows.length > 0 && (
            <TrashFileList
              rows={rows}
              showType={showType}
              selected={selection}
              onSelect={setSelection}
              onOpenMenu={setMenuAnchor}
            />
          )}
        </div>
      </div>

      <TrashContextMenu
        selection={selection}
        anchor={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        onActionComplete={() => setSelection(null)}
      />
    </>
  );
}
