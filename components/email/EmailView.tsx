"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowLeft, CheckSquare, Star, Download, Share, Archive } from "lucide-react";
import Link from "next/link";

export function EmailDetailView({ email }: { email: Doc<"emails"> }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/emails"
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-grey-7 transition-colors"
          aria-label="Back to emails"
        >
          <ArrowLeft size={18} className="text-grey-3" />
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-grey-7 transition-colors" aria-label="Mark complete">
            <CheckSquare size={16} className="text-grey-3" />
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-grey-7 transition-colors" aria-label="Star email">
            <Star size={16} className="text-grey-3" />
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-grey-7 transition-colors" aria-label="Archive email">
            <Archive size={16} className="text-grey-3" />
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-grey-7 transition-colors" aria-label="Share email">
            <Share size={16} className="text-grey-3" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-grey-3">
          {email.folder === "outbox" ? "Sent to" : "From"}{" "}
          <span className="text-pign-black font-medium">
            {email.folder === "outbox" ? email.toAddress : email.fromAddress}
          </span>
        </p>
      </div>

      <div className="bg-white rounded-xl border border-grey-6 p-6 mb-6">
        <div className="prose prose-sm max-w-none text-grey-2 leading-relaxed whitespace-pre-wrap">
          {email.body}
        </div>
      </div>

      {email.attachmentIds && email.attachmentIds.length > 0 && (
        <div>
          <button className="flex items-center gap-2 bg-grey-7 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-grey-6 transition-colors mb-4">
            <Download size={14} aria-hidden />
            Download all
          </button>
          <div className="flex gap-3 flex-wrap">
            {email.attachmentIds.map((id) => (
              <AttachmentCard key={id} emailId={email._id} fileId={id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AttachmentCard({
  emailId,
  fileId,
}: {
  emailId: Id<"emails">;
  fileId: Id<"_storage">;
}) {
  const url = useQuery(api.emails.getAttachmentUrl, { emailId, fileId });

  return (
    <div className="w-40 rounded-xl overflow-hidden border border-grey-6">
      <div className="h-24 bg-grey-7 flex items-center justify-center">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="w-full h-full object-cover" />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-grey-4">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
        )}
      </div>
    </div>
  );
}
