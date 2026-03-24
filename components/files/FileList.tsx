"use client";

import { FileRow } from "./FileRow";
import { Doc } from "@/convex/_generated/dataModel";

export function FileList({ documents }: { documents: Doc<"documents">[] }) {
  return (
    <div className="bg-white rounded-lg border border-grey-6">
      <div className="flex items-center px-4 py-2.5 border-b border-grey-6 text-xs font-medium text-grey-3 uppercase tracking-wider">
        <div className="flex-1">Name</div>
        <div className="w-20 text-center">Shared</div>
        <div className="w-24 text-center">Verified</div>
        <div className="w-20 text-right">Size</div>
        <div className="w-28 text-right">Last Uploaded</div>
      </div>
      {documents.map((doc) => (
        <FileRow key={doc._id} doc={doc} />
      ))}
    </div>
  );
}
