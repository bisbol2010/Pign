"use client";

import { FolderDuotone } from "@/components/illustrations";
import { FolderPlusIcon } from "@/components/icons";
import { EmptyStateLayout } from "./EmptyStateLayout";

type FoldersEmptyStateProps = {
  onCreateFolder: () => void;
};

export function FoldersEmptyState({ onCreateFolder }: FoldersEmptyStateProps) {
  return (
    <EmptyStateLayout
      illustration={
        <FolderDuotone className="h-[200px] w-[200px] text-pign-black" />
      }
      title="It's quite empty here"
      subtitle="Why not upload a file or two?"
      hint="Drag and drop your file here"
      action={
        <button
          type="button"
          onClick={onCreateFolder}
          className="flex h-[56px] w-[224px] items-center justify-center gap-[10px] bg-pign-black text-[16px] font-medium text-white transition-opacity hover:opacity-90"
        >
          <FolderPlusIcon size={24} className="text-white" />
          Create folder
        </button>
      }
    />
  );
}
