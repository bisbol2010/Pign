"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DocumentViewer } from "@/components/document/DocumentViewer";
import { KnowledgeSidebar } from "@/components/document/KnowledgeSidebar";
import { AIChatSidebar } from "@/components/document/AIChatSidebar";
import { ArrowLeft, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { timeAgo } from "@/lib/utils";

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as Id<"documents">;
  const doc = useQuery(api.documents.getById, { id: documentId });
  const renameDoc = useMutation(api.documents.rename);
  const markOpened = useMutation(api.documents.markOpened);
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (doc) {
      setName(doc.name);
      markOpened({ id: documentId });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc?._id]);

  const handleRename = async () => {
    if (name.trim() && name !== doc?.name) {
      await renameDoc({ id: documentId, name: name.trim() });
    }
    setIsEditing(false);
  };

  if (!doc) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-grey-5 border-t-pign-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <KnowledgeSidebar documentId={documentId} />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-grey-6 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-grey-7 transition-colors"
            >
              <ArrowLeft size={18} className="text-grey-3" />
            </button>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename()}
                  onBlur={handleRename}
                  className="text-sm font-medium border border-grey-5 rounded px-2 py-1 focus:outline-none focus:border-pign-black"
                  autoFocus
                />
                <button onClick={handleRename}>
                  <Check size={16} className="text-grey-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm font-medium text-pign-black hover:underline"
              >
                {doc.name}
              </button>
            )}
          </div>
          <span className="text-xs text-grey-4">
            Saved {timeAgo(doc._creationTime)}
          </span>
        </header>
        <div className="flex-1 p-4">
          <DocumentViewer documentId={documentId} />
        </div>
      </div>
      <AIChatSidebar documentId={documentId} documentName={doc.name} />
    </div>
  );
}
