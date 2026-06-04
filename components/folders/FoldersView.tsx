"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FolderList } from "./FolderList";
import { FolderGrid } from "./FolderGrid";
import { FoldersSkeleton } from "./FoldersSkeleton";
import { CreateFolderModal } from "./CreateFolderModal";
import {
  FoldersEmptyState,
  FoldersTableHeader,
} from "@/components/empty";
import { RenameFolderModal } from "./RenameFolderModal";
import {
  FolderContextMenu,
  type FolderMenuState,
} from "./FolderContextMenu";
import type { FolderDoc } from "./types";
import { useFileActionsContext } from "@/components/file-actions";

function nextUntitledName(existing: FolderDoc[]): string {
  const used = new Set(
    existing
      .map((f) => f.name.match(/^Untitled (\d+)$/)?.[1])
      .filter(Boolean)
      .map(Number)
  );
  let n = 1;
  while (used.has(n)) n++;
  return `Untitled ${n}`;
}

type FoldersViewProps = {
  viewMode: "list" | "grid";
  createOpen: boolean;
  onCreateOpen: () => void;
  onCreateClose: () => void;
};

export function FoldersView({
  viewMode,
  createOpen,
  onCreateOpen,
  onCreateClose,
}: FoldersViewProps) {
  const { openDeleteConfirm, showToast } = useFileActionsContext();
  const folders = useQuery(api.folders.list) as FolderDoc[] | undefined;
  const moveFolderToTrash = useMutation(api.trash.moveFolderToTrash);
  const [renameTarget, setRenameTarget] = useState<FolderDoc | null>(null);
  const [menuState, setMenuState] = useState<FolderMenuState | null>(null);

  const defaultName = useMemo(
    () => nextUntitledName(folders ?? []),
    [folders]
  );

  const isLoading = folders === undefined;
  const isEmpty = folders !== undefined && folders.length === 0;

  const handleDelete = (folder: FolderDoc) => {
    if (folder.isSystem) return;
    openDeleteConfirm({
      title: "Move folder to trash",
      message: `Move "${folder.name}" and its files to Trash? You can restore it later.`,
      confirmText: "Move to trash",
      onConfirm: async () => {
        try {
          await moveFolderToTrash({ id: folder._id });
          showToast({
            message: `Folder "${folder.name}" moved to trash`,
            type: "success",
          });
        } catch {
          showToast({ message: "Could not move folder to trash.", type: "error" });
        }
      },
    });
  };

  const handleRename = (folder: FolderDoc) => {
    if (!folder.isSystem) setRenameTarget(folder);
  };

  return (
    <>
      <div>
        {isLoading && <FoldersSkeleton viewMode={viewMode} />}

        {isEmpty && (
          <>
            <FoldersTableHeader />
            <FoldersEmptyState onCreateFolder={onCreateOpen} />
          </>
        )}

        {folders && folders.length > 0 && (
          <>
            {viewMode === "list" ? (
              <FolderList
                folders={folders}
                onRename={handleRename}
                onDelete={(f) => {
                  if (!f.isSystem) handleDelete(f);
                }}
                onMenu={setMenuState}
              />
            ) : (
              <FolderGrid folders={folders} onMenu={setMenuState} />
            )}
          </>
        )}
      </div>

      <FolderContextMenu
        state={menuState}
        onClose={() => setMenuState(null)}
        onRename={handleRename}
        onDelete={handleDelete}
      />

      <CreateFolderModal
        open={createOpen}
        onClose={onCreateClose}
        defaultName={defaultName}
      />
      <RenameFolderModal
        open={renameTarget !== null}
        folderId={renameTarget?._id ?? null}
        initialName={renameTarget?.name ?? ""}
        onClose={() => setRenameTarget(null)}
      />
    </>
  );
}
