"use client";

import { TopBar } from "@/components/layout/TopBar";
import { RecentFiles } from "@/components/files/RecentFiles";
import { FileList } from "@/components/files/FileList";
import { FileGrid } from "@/components/files/FileGrid";
import { EmptyState } from "@/components/files/EmptyState";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { LayoutList, LayoutGrid, Link2, UserPlus, Trash2, MoreVertical } from "lucide-react";

export default function DashboardPage() {
  const documents = useQuery(api.documents.list);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeTab, setActiveTab] = useState<"files" | "folders">("files");

  const isLoading = documents === undefined;
  const isEmpty = documents !== undefined && documents.length === 0;

  return (
    <>
      <TopBar title="All files" />
      <div className="flex-1 p-6 overflow-y-auto">
        {!isEmpty && <RecentFiles />}

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("files")}
              className={`text-sm pb-1 border-b-2 transition-colors ${
                activeTab === "files"
                  ? "text-pign-black border-pign-black font-medium"
                  : "text-grey-3 border-transparent hover:text-pign-black"
              }`}
            >
              Files
            </button>
            <button
              onClick={() => setActiveTab("folders")}
              className={`text-sm pb-1 border-b-2 transition-colors ${
                activeTab === "folders"
                  ? "text-pign-black border-pign-black font-medium"
                  : "text-grey-3 border-transparent hover:text-pign-black"
              }`}
            >
              Folders
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-grey-7 transition-colors">
              <Link2 size={16} className="text-grey-3" />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-grey-7 transition-colors">
              <UserPlus size={16} className="text-grey-3" />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-grey-7 transition-colors">
              <Trash2 size={16} className="text-grey-3" />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-grey-7 transition-colors">
              <MoreVertical size={16} className="text-grey-3" />
            </button>
            <div className="w-px h-5 bg-grey-6 mx-1" />
            <button
              onClick={() => setViewMode("list")}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                viewMode === "list" ? "bg-grey-7" : "hover:bg-grey-7"
              }`}
            >
              <LayoutList
                size={16}
                className={viewMode === "list" ? "text-pign-black" : "text-grey-3"}
              />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                viewMode === "grid" ? "bg-grey-7" : "hover:bg-grey-7"
              }`}
            >
              <LayoutGrid
                size={16}
                className={viewMode === "grid" ? "text-pign-black" : "text-grey-3"}
              />
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-grey-5 border-t-pign-black rounded-full animate-spin" />
          </div>
        )}

        {isEmpty && <EmptyState />}

        {documents && documents.length > 0 && (
          <>
            {viewMode === "list" ? (
              <FileList documents={documents} />
            ) : (
              <FileGrid documents={documents} />
            )}
          </>
        )}
      </div>
    </>
  );
}
