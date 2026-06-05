"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AccountIcon, DownloadIcon } from "@/components/icons";
import { formatFileSize } from "@/lib/utils";
import { Archive, CheckSquare, Share2, Star, Trash2 } from "lucide-react";
import type { DeliveryDetail } from "./types";
import type { Id } from "@/convex/_generated/dataModel";
import { useFileActionsContext } from "@/components/file-actions";

type MailDetailProps = {
  delivery: DeliveryDetail;
};

export function MailDetail({ delivery }: MailDetailProps) {
  const router = useRouter();
  const { openDeleteConfirm, showToast } = useFileActionsContext();
  const toggleStar = useMutation(api.deliveries.toggleStar);
  const toggleArchive = useMutation(api.deliveries.toggleArchive);
  const toggleComplete = useMutation(api.deliveries.toggleComplete);
  const remove = useMutation(api.deliveries.remove);

  const isOutbox =
    delivery.perspective === "outbox" ||
    delivery.folder === "outbox" ||
    delivery.folder === "pending";
  const counterparty = isOutbox
    ? delivery.recipientDisplay
    : delivery.senderEmail;
  // Archive lives on the recipient copy only (the mutation rejects senders).
  const canArchive = delivery.perspective === "inbox";

  const handleComplete = async () => {
    try {
      await toggleComplete({ id: delivery._id });
      showToast({
        message: delivery.isComplete ? "Marked incomplete" : "Marked complete",
        type: "success",
      });
    } catch {
      showToast({ message: "Couldn't update email.", type: "error" });
    }
  };

  const handleStar = async () => {
    try {
      await toggleStar({ id: delivery._id });
      showToast({
        message: delivery.isStarred ? "Removed star" : "Starred",
        type: "success",
      });
    } catch {
      showToast({ message: "Couldn't update email.", type: "error" });
    }
  };

  const handleArchive = async () => {
    try {
      await toggleArchive({ id: delivery._id });
      showToast({
        message: delivery.isArchived ? "Email unarchived" : "Email archived",
        type: "success",
      });
    } catch {
      showToast({ message: "Couldn't archive email.", type: "error" });
    }
  };

  const handleShare = async () => {
    const subject = delivery.subject?.trim() || "Pign email";
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/emails/${delivery._id}`
        : "";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: subject,
          text: delivery.body?.slice(0, 200) || subject,
          url: shareUrl,
        });
        return;
      }
      if (navigator?.clipboard && shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        showToast({ message: "Link copied", type: "success" });
        return;
      }
      showToast({ message: "Sharing isn't available here.", type: "error" });
    } catch {
      // User dismissed the native share sheet; nothing to report.
    }
  };

  const handleDelete = () => {
    openDeleteConfirm({
      title: "Delete Email",
      message: "Are you sure you want to permanently delete this email? This action cannot be undone.",
      confirmText: "Delete Email",
      onConfirm: async () => {
        try {
          await remove({ id: delivery._id });
          showToast({ message: "Email deleted successfully", type: "success" });
          router.push("/emails");
        } catch {
          showToast({ message: "Failed to delete email.", type: "error" });
        }
      },
    });
  };

  return (
    <div className="pb-10">
      <div className="flex items-center justify-end gap-[16px] px-[30px] pt-[4px] text-pign-black">
        <button
          type="button"
          onClick={() => void handleComplete()}
          className="flex size-[24px] items-center justify-center hover:opacity-70"
          aria-label={delivery.isComplete ? "Mark incomplete" : "Mark complete"}
          aria-pressed={delivery.isComplete ?? false}
        >
          <CheckSquare
            size={24}
            strokeWidth={1.5}
            className={delivery.isComplete ? "text-verify-green" : undefined}
          />
        </button>
        <button
          type="button"
          onClick={() => void handleStar()}
          className="flex size-[24px] items-center justify-center hover:opacity-70"
          aria-label="Star"
          aria-pressed={delivery.isStarred ?? false}
        >
          <Star
            size={24}
            strokeWidth={1.5}
            className={delivery.isStarred ? "fill-pign-black" : undefined}
          />
        </button>
        {canArchive ? (
          <button
            type="button"
            onClick={() => void handleArchive()}
            className="flex size-[24px] items-center justify-center hover:opacity-70"
            aria-label={delivery.isArchived ? "Unarchive" : "Archive"}
            aria-pressed={delivery.isArchived ?? false}
          >
            <Archive
              size={24}
              strokeWidth={1.5}
              className={delivery.isArchived ? "text-pign-black" : undefined}
            />
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => void handleShare()}
          className="flex size-[24px] items-center justify-center hover:opacity-70"
          aria-label="Share"
        >
          <Share2 size={24} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={() => void handleDelete()}
          className="flex size-[24px] items-center justify-center hover:opacity-70 hover:text-verify-red"
          aria-label="Delete"
        >
          <Trash2 size={24} strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-[24px] flex items-center gap-[8px] px-[30px]">
        <AccountIcon size={24} className="text-grey-3" />
        <p className="text-[12px] text-grey-3">
          {isOutbox ? "Sent to" : "From"}{" "}
          <span className="text-[16px] font-medium text-pign-black">
            {counterparty}
          </span>
        </p>
      </div>

      {delivery.documents.length > 0 && (
        <div className="mt-[24px] flex flex-wrap gap-[24px] px-[30px]">
          {delivery.documents.map((doc) => (
            <AttachmentPreview
              key={doc._id}
              deliveryId={delivery._id}
              doc={doc}
            />
          ))}
        </div>
      )}

      {delivery.body && (
        <div className="mt-[32px] max-w-[720px] px-[30px]">
          <p className="whitespace-pre-wrap text-[14px] leading-[1.6] tracking-[0.7px] text-pign-black">
            {delivery.body}
          </p>
        </div>
      )}
    </div>
  );
}

function AttachmentPreview({
  deliveryId,
  doc,
}: {
  deliveryId: Id<"deliveries">;
  doc: DeliveryDetail["documents"][number];
}) {
  const isImage = doc.fileType?.startsWith("image/");
  const [thumbError, setThumbError] = useState(false);

  return (
    <div className="relative w-[470px] max-w-full overflow-hidden rounded-[2px]">
      <div className="relative h-[294px] w-full bg-grey-7">
        {doc.previewUrl && !thumbError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={doc.previewUrl}
            alt=""
            onError={() => setThumbError(true)}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-grey-4">
            <span className="text-[14px]">{doc.name}</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex h-[72px] items-end justify-between bg-gradient-to-b from-transparent to-pign-black/90 px-[16px] pb-[12px]">
          <div className="flex items-center gap-[8px] text-white">
            <span className="text-[14px] font-medium">
              {doc.name.replace(/\.[^.]+$/, "")}
            </span>
            <span className="text-[14px] text-grey-5">
              {doc.name.match(/\.[^.]+$/)?.[0] ?? ""}
            </span>
          </div>
          <DownloadButton deliveryId={deliveryId} documentId={doc._id} name={doc.name} />
        </div>
      </div>
      {!isImage && doc.fileSize != null && (
        <p className="mt-1 text-[12px] text-grey-3">{formatFileSize(doc.fileSize)}</p>
      )}
    </div>
  );
}

function DownloadButton({
  deliveryId,
  documentId,
  name,
}: {
  deliveryId: Id<"deliveries">;
  documentId: Id<"documents">;
  name: string;
}) {
  const url = useQuery(api.deliveries.getDocumentUrl, {
    deliveryId,
    documentId,
  });

  if (!url) {
    return (
      <span className="text-white opacity-50" aria-hidden>
        <DownloadIcon size={18} />
      </span>
    );
  }

  return (
    <a
      href={url}
      download={name}
      className="text-white opacity-90 hover:opacity-100"
      aria-label={`Download ${name}`}
    >
      <DownloadIcon size={18} />
    </a>
  );
}
