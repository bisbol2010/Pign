"use client";

import { TopBar } from "@/components/layout/TopBar";
import { RecentFiles } from "@/components/files/RecentFiles";
import { FileList } from "@/components/files/FileList";
import { FileGrid } from "@/components/files/FileGrid";
import { FilesEmptyState, FilesTableHeader } from "@/components/empty";
import { UploadProgressPanel } from "@/components/upload";
import { FoldersView } from "@/components/folders";
import {
  FileContextMenu,
  FilePropertiesPanel,
  useFileActionsContext,
} from "@/components/file-actions";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { ViewListIcon, ViewGridIcon, FolderPlusIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { FILE_GRID_COLS } from "@/components/files/FileRow";
import type { FileDoc } from "@/components/files/types";
import type { Id } from "@/convex/_generated/dataModel";

export default function DashboardPage() {
  return <DashboardFilesContent />;
}

function DashboardFilesContent() {
  const documents = useQuery(api.documents.list) as FileDoc[] | undefined;
  const { selectedId, setSelectedId } = useFileActionsContext();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeTab, setActiveTab] = useState<"files" | "folders">("files");
  const [createFolderOpen, setCreateFolderOpen] = useState(false);

  const isLoading = documents === undefined;
  const isEmpty = documents !== undefined && documents.length === 0;
  const showRecent = activeTab === "files" && !isEmpty && !isLoading;
  const selectedDoc =
    documents?.find((d) => d._id === selectedId) ?? null;
  const showProperties =
    activeTab === "files" &&
    viewMode === "list" &&
    selectedDoc &&
    !isEmpty &&
    !isLoading;

  const handleSelect = (id: Id<"documents">) => {
    setSelectedId(selectedId === id ? null : id);
  };

  return (
    <>
      <TopBar title="All files" />
      <UploadProgressPanel />
      <div className="flex flex-1 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-y-auto pb-10">
          {showRecent && <RecentFiles />}

          <div className="mt-[28px] flex items-center justify-between pl-[30px] pr-[35px]">
            <div className="flex items-center gap-[18px]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("files");
                  setSelectedId(null);
                }}
                className={cn(
                  "text-[18px] transition-colors",
                  activeTab === "files"
                    ? "font-medium text-pign-black"
                    : "text-grey-5 hover:text-grey-3"
                )}
              >
                Files
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("folders");
                  setSelectedId(null);
                }}
                className={cn(
                  "text-[18px] transition-colors",
                  activeTab === "folders"
                    ? "font-medium text-pign-black"
                    : "text-grey-5 hover:text-grey-3"
                )}
              >
                Folders
              </button>
            </div>

            <div className="flex items-center gap-[16px]">
              {activeTab === "folders" && (
                <button
                  type="button"
                  onClick={() => setCreateFolderOpen(true)}
                  aria-label="Create folder"
                  className="text-pign-black transition-opacity hover:opacity-70"
                >
                  <FolderPlusIcon size={24} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <ViewListIcon
                  size={24}
                  className={cn(
                    "text-pign-black transition-opacity",
                    viewMode === "list" ? "opacity-100" : "opacity-20"
                  )}
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode("grid");
                  setSelectedId(null);
                }}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <ViewGridIcon
                  size={24}
                  className={cn(
                    "text-pign-black transition-opacity",
                    viewMode === "grid" ? "opacity-100" : "opacity-20"
                  )}
                />
              </button>
            </div>
          </div>

          <div className="mt-[16px]">
            {activeTab === "files" && isLoading && <FilesSkeleton />}

            {activeTab === "files" && isEmpty && (
              <>
                <FilesTableHeader />
                <FilesEmptyState />
              </>
            )}

            {activeTab === "folders" && (
              <FoldersView
                viewMode={viewMode}
                createOpen={createFolderOpen}
                onCreateOpen={() => setCreateFolderOpen(true)}
                onCreateClose={() => setCreateFolderOpen(false)}
              />
            )}

            {activeTab === "files" && documents && documents.length > 0 && (
              <>
                {viewMode === "list" ? (
                  <FileList
                    documents={documents}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                  />
                ) : (
                  <FileGrid
                    documents={documents}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {showProperties && selectedDoc && (
          <FilePropertiesPanel doc={selectedDoc} />
        )}
      </div>
      {selectedDoc && <FileContextMenu doc={selectedDoc} />}
    </>
  );
}

function FilesSkeleton() {
  return (
    <div>
      <div className={`h-[28px] bg-grey-7 text-[14px] text-grey-3 ${FILE_GRID_COLS}`}>
        <span>NAME</span>
        <span className="text-center">SHARED</span>
        <span className="text-center">VERIFIED</span>
        <span className="text-center">SIZE</span>
        <span className="text-center">LAST UPLOADED</span>
        <span />
      </div>
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className={`border-b border-grey-6 ${FILE_GRID_COLS}`}
        >
          <div className="flex items-center gap-[16px] py-[13px]">
            <div className="h-[31px] w-[31px] shrink-0 animate-pulse rounded-[4px] bg-grey-6" />
            <div className="h-[14px] w-48 animate-pulse rounded bg-grey-6" />
          </div>
          <div />
          <div />
          <div className="mx-auto h-[14px] w-12 animate-pulse rounded bg-grey-6" />
          <div className="mx-auto h-[14px] w-20 animate-pulse rounded bg-grey-6" />
          <div />
        </div>
      ))}
    </div>
  );
}
