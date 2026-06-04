"use client";

import { TopBar } from "@/components/layout/TopBar";
import { FileList } from "@/components/files/FileList";
import { FileGrid } from "@/components/files/FileGrid";
import { FILE_GRID_COLS } from "@/components/files/FileRow";
import {
  FileActionsProvider,
  FileContextMenu,
  FilePropertiesPanel,
  useFileActionsContext,
} from "@/components/file-actions";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/Button";
import { resolveDocVerificationStatus } from "@/components/verification";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ViewListIcon, ViewGridIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";
import type { FileDoc } from "@/components/files/types";
import { FilesEmptyState, FilesTableHeader } from "@/components/empty";

export default function FolderDetailPage() {
  return <FolderDetailContent />;
}

function FolderDetailContent() {
  const params = useParams();
  const folderId = params.folderId as Id<"folders">;
  const data = useQuery(api.folders.getWithDocuments, { folderId });
  const bulkVerify = useMutation(api.verification.bulkVerifyFolder);
  const { selectedId, setSelectedId, openDeleteConfirm, showToast } = useFileActionsContext();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [bulkBusy, setBulkBusy] = useState(false);

  const isLoading = data === undefined;
  const folder = data?.folder;
  const documents = (data?.documents ?? []) as FileDoc[];
  const isEmpty = data !== undefined && documents.length === 0;
  const selectedDoc = documents.find((d) => d._id === selectedId) ?? null;
  const showProperties =
    viewMode === "list" && selectedDoc && !isEmpty && !isLoading;

  const handleSelect = (id: Id<"documents">) => {
    setSelectedId(selectedId === id ? null : id);
  };

  return (
    <>
      <TopBar title={folder?.name ?? (isLoading ? "…" : "Folder")} />
      <div className="flex flex-1 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-y-auto pb-10">
        <div className="mt-[28px] flex items-center justify-between pl-[30px] pr-[35px]">
          {folder && documents.some(
            (d) => resolveDocVerificationStatus(d) !== "verified"
          ) && (
            <Button
              size="sm"
              variant="secondary"
              disabled={bulkBusy}
              onClick={() => {
                openDeleteConfirm({
                  title: "Verify folder files",
                  message: `Are you sure you want to verify all ${documents.length} file(s) in this folder?`,
                  confirmText: "Verify all",
                  onConfirm: async () => {
                    setBulkBusy(true);
                    try {
                      const result = await bulkVerify({ folderId });
                      showToast({
                        message: `Verified ${result.verified} of ${result.total} file(s).`,
                        type: "success",
                      });
                    } catch (e) {
                      showToast({
                        message: e instanceof Error ? e.message : "Could not verify folder.",
                        type: "error",
                      });
                    } finally {
                      setBulkBusy(false);
                    }
                  },
                });
              }}
            >
              Verify all
            </Button>
          )}
          <div className="ml-auto flex items-center gap-[16px]">
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
          {isLoading && <FolderFilesSkeleton viewMode={viewMode} />}

          {!isLoading && !folder && (
            <p className="px-[30px] py-10 text-[14px] text-grey-3">
              Folder not found.
            </p>
          )}

          {folder && isEmpty && (
            <>
              <FilesTableHeader />
              <FilesEmptyState />
            </>
          )}

          {folder && documents.length > 0 && (
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

function FolderFilesSkeleton({ viewMode }: { viewMode: "list" | "grid" }) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-2 gap-[32px] px-[30px] pt-[20px] sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[8px]">
            <div className="h-[136px] animate-pulse bg-grey-6" />
            <div className="h-[52px] animate-pulse bg-grey-5" />
          </div>
        ))}
      </div>
    );
  }

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
      {Array.from({ length: 5 }).map((_, i) => (
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
