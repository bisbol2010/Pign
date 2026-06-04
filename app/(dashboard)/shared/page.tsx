"use client";

import { TopBar } from "@/components/layout/TopBar";
import {
  SharedEmptyState,
  SharedFileGrid,
  SharedFileList,
  SharedSkeleton,
  SharedTableHeader,
  type SharedByMeDoc,
  type SharedWithMeDoc,
} from "@/components/shared";
import {
  FileActionsProvider,
  FileContextMenu,
  FilePropertiesPanel,
  useFileActionsContext,
} from "@/components/file-actions";
import { ViewGridIcon, ViewListIcon } from "@/components/icons";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

type SharedTab = "withMe" | "byMe";

export default function SharedPage() {
  return <SharedPageContent />;
}

function SharedPageContent() {
  const sharedWithMe = useQuery(api.shared.listSharedWithMe) as
    | SharedWithMeDoc[]
    | undefined;
  const sharedByMe = useQuery(api.shared.listSharedByMe) as
    | SharedByMeDoc[]
    | undefined;
  const { selectedId, setSelectedId } = useFileActionsContext();
  const [activeTab, setActiveTab] = useState<SharedTab>("withMe");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const documents = activeTab === "withMe" ? sharedWithMe : sharedByMe;
  const isLoading = documents === undefined;
  const isEmpty = documents !== undefined && documents.length === 0;
  const canManage = activeTab === "byMe";
  const selectedDoc = documents?.find((d) => d._id === selectedId) ?? null;
  const showProperties =
    activeTab === "byMe" &&
    viewMode === "list" &&
    selectedDoc &&
    !isEmpty &&
    !isLoading;

  const handleSelect = (id: Id<"documents">) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const switchTab = (tab: SharedTab) => {
    setActiveTab(tab);
    setSelectedId(null);
  };

  return (
    <>
      <TopBar title="Shared" />
      <div className="flex flex-1 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-y-auto pb-10">
          <div className="mt-[28px] flex items-center justify-between pl-[30px] pr-[35px]">
            <div className="flex items-center gap-[18px]">
              <button
                type="button"
                onClick={() => switchTab("withMe")}
                className={cn(
                  "text-[18px] transition-colors",
                  activeTab === "withMe"
                    ? "font-medium text-pign-black"
                    : "text-grey-5 hover:text-grey-3"
                )}
              >
                Shared with me
              </button>
              <button
                type="button"
                onClick={() => switchTab("byMe")}
                className={cn(
                  "text-[18px] transition-colors",
                  activeTab === "byMe"
                    ? "font-medium text-pign-black"
                    : "text-grey-5 hover:text-grey-3"
                )}
              >
                Shared by me
              </button>
            </div>

            <div className="flex items-center gap-[16px]">
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
            {isLoading && (
              <>
                <SharedTableHeader />
                <SharedSkeleton />
              </>
            )}

            {isEmpty && (
              <>
                <SharedTableHeader />
                <SharedEmptyState tab={activeTab} />
              </>
            )}

            {documents && documents.length > 0 && (
              <>
                {viewMode === "list" ? (
                  <>
                    <SharedTableHeader />
                    <SharedFileList
                      documents={documents}
                      selectedId={selectedId}
                      onSelect={handleSelect}
                      canManage={canManage}
                    />
                  </>
                ) : (
                  <SharedFileGrid
                    documents={documents}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                    canManage={canManage}
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
      {canManage && selectedDoc && <FileContextMenu doc={selectedDoc} />}
    </>
  );
}
