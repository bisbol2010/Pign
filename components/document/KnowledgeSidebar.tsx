"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Plus, X, BookOpen } from "lucide-react";
import { useFileActionsContext } from "@/components/file-actions";

export function KnowledgeSidebar({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const knowledge = useQuery(api.knowledge.listByDocument, { documentId });
  const addKnowledge = useMutation(api.knowledge.add);
  const removeKnowledge = useMutation(api.knowledge.remove);
  const { showToast } = useFileActionsContext();
  const [newEntry, setNewEntry] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newEntry.trim()) return;
    try {
      await addKnowledge({ documentId, content: newEntry.trim() });
      setNewEntry("");
      setIsAdding(false);
    } catch {
      showToast({ message: "Failed to add knowledge entry.", type: "error" });
    }
  };

  return (
    <div className="w-72 border-r border-grey-6 bg-white flex flex-col h-full">
      <div className="p-4 border-b border-grey-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-grey-3" />
            <h3 className="text-sm font-medium">Knowledge</h3>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-grey-7 transition-colors"
            aria-label="Add knowledge"
          >
            <Plus size={14} className="text-grey-3" />
          </button>
        </div>
        <p className="text-xs text-grey-4 mt-1">
          Add context for the AI to understand this document better.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isAdding && (
          <div className="border border-grey-5 rounded-lg p-3">
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="Add knowledge about this document..."
              className="w-full text-sm resize-none h-24 focus:outline-none placeholder:text-grey-4"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleAdd}
                className="bg-pign-black text-white text-xs px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewEntry("");
                }}
                className="text-xs text-grey-3 px-3 py-1.5 hover:text-pign-black transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {knowledge?.map((entry) => (
          <div
            key={entry._id}
            className="bg-grey-7 rounded-lg p-3 group relative"
          >
            <p className="text-xs text-grey-2 leading-relaxed pr-5">
              {entry.content}
            </p>
            <button
              onClick={() => removeKnowledge({ id: entry._id })}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              aria-label="Remove knowledge entry"
            >
              <X size={12} className="text-grey-4 hover:text-pign-black" />
            </button>
          </div>
        ))}

        {knowledge === undefined && (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-grey-5 border-t-pign-black rounded-full animate-spin" />
          </div>
        )}

        {knowledge !== undefined && knowledge.length === 0 && !isAdding && (
          <div className="text-center py-8">
            <p className="text-xs text-grey-4">
              No knowledge added yet. Click + to add context.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
