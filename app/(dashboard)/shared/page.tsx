"use client";

import { TopBar } from "@/components/layout/TopBar";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Share2, X } from "lucide-react";

export default function SharedPage() {
  const sharedByMe = useQuery(api.shared.listSharedByMe);
  const revokeAccess = useMutation(api.shared.revokeAccess);

  return (
    <>
      <TopBar title="Shared" />
      <div className="flex-1 p-6 overflow-y-auto">
        <p className="text-sm text-grey-3 mb-6">
          Documents you have shared with others.
        </p>

        {sharedByMe === undefined ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-grey-5 border-t-pign-black rounded-full animate-spin" />
          </div>
        ) : sharedByMe.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Share2 size={48} className="text-grey-5 mb-4" />
            <h3 className="text-lg font-medium text-pign-black mb-1">
              No shared documents
            </h3>
            <p className="text-sm text-grey-3">
              Share a document from the All Files view to see it here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-grey-6">
            <div className="flex items-center px-4 py-2.5 border-b border-grey-6 text-xs font-medium text-grey-3 uppercase tracking-wider">
              <div className="flex-1">Shared With</div>
              <div className="w-24 text-center">Permission</div>
              <div className="w-16" />
            </div>
            {sharedByMe.map((item) => (
              <div
                key={item._id}
                className="flex items-center px-4 py-3 border-b border-grey-6 last:border-0"
              >
                <div className="flex-1">
                  <p className="text-sm text-pign-black">
                    {item.sharedWithEmail}
                  </p>
                </div>
                <div className="w-24 text-center">
                  <span className="text-xs text-grey-3 bg-grey-7 px-2 py-0.5 rounded">
                    {item.permission}
                  </span>
                </div>
                <div className="w-16 flex justify-end">
                  <button
                    onClick={() => revokeAccess({ id: item._id })}
                    className="w-7 h-7 rounded flex items-center justify-center hover:bg-grey-7 transition-colors"
                  >
                    <X size={14} className="text-grey-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
