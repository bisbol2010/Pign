"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Modal } from "@/components/ui/Modal";
import { useFileActionsContext } from "./FileActionsProvider";
import { TrashDuotone } from "@/components/illustrations";

type ShareRecipientModalProps = {
  documentId: Id<"documents"> | null;
  open: boolean;
  onClose: () => void;
};

export function ShareRecipientModal({
  documentId,
  open,
  onClose,
}: ShareRecipientModalProps) {
  const { showToast } = useFileActionsContext();
  
  const doc = useQuery(
    api.documents.getById,
    open && documentId ? { id: documentId } : "skip"
  );
  
  const collaborators = useQuery(
    api.shared.listByDocument,
    open && documentId ? { documentId } : "skip"
  );

  const shareMutation = useMutation(api.shared.share);
  const revokeAccessMutation = useMutation(api.shared.revokeAccess);
  const ensureShareToken = useMutation(api.documents.ensureShareToken);

  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"view" | "edit">("view");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setEmail("");
      setPermission("view");
      setError(null);
      setLoading(false);
      setShareUrl(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !documentId) return;
    let cancelled = false;
    ensureShareToken({ id: documentId })
      .then((token) => {
        if (!cancelled) {
          setShareUrl(`${window.location.origin}/s/${token}`);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, documentId, ensureShareToken]);

  const shareTitle = doc?.name ? `Pign: ${doc.name}` : "Shared via Pign";

  const handleNativeShare = async () => {
    if (!shareUrl) return;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      await handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast({ message: "Link copied", type: "success" });
    } catch {
      showToast({ message: "Could not copy link.", type: "error" });
    }
  };

  const openShareTarget = (kind: "mailto" | "whatsapp" | "x" | "linkedin") => {
    if (!shareUrl) return;
    const encodedUrl = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(`${shareTitle} ${shareUrl}`);
    const targets: Record<typeof kind, string> = {
      mailto: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${text}`,
      whatsapp: `https://wa.me/?text=${text}`,
      x: `https://twitter.com/intent/tweet?text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };
    window.open(targets[kind], "_blank", "noopener,noreferrer");
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentId) return;
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Please enter an email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await shareMutation({
        documentId,
        sharedWithEmail: trimmedEmail,
        permission,
      });
      setEmail("");
      showToast({ message: `Successfully shared with ${trimmedEmail}`, type: "success" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to share access.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id: Id<"sharedAccess">, targetEmail: string) => {
    try {
      await revokeAccessMutation({ id });
      showToast({ message: `Access revoked for ${targetEmail}`, type: "success" });
    } catch (err) {
      showToast({ message: "Could not revoke access.", type: "error" });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Share document"
      className="w-[500px] max-w-[500px]"
    >
        {doc && (
          <p className="mt-[4px] text-[14px] text-grey-3 truncate">
            Sharing: <span className="font-medium text-pign-black">{doc.name}</span>
          </p>
        )}

        <form onSubmit={handleShare} className="mt-[24px] flex flex-col gap-[16px]">
          <div className="flex gap-[8px] items-end">
            <div className="flex-1 flex flex-col gap-[6px]">
              <label htmlFor="share-email" className="text-[12px] font-medium text-grey-3 uppercase tracking-wider">
                Email address
              </label>
              <input
                id="share-email"
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-[40px] border border-grey-6 px-[12px] text-[14px] font-medium text-pign-black focus:border-pign-black focus:outline-none transition-colors disabled:bg-grey-7"
              />
            </div>
            
            <div className="w-[100px] flex flex-col gap-[6px]">
              <label htmlFor="share-permission" className="text-[12px] font-medium text-grey-3 uppercase tracking-wider">
                Access
              </label>
              <select
                id="share-permission"
                value={permission}
                onChange={(e) => setPermission(e.target.value as "view" | "edit")}
                disabled={loading}
                className="h-[40px] border border-grey-6 px-[8px] bg-white text-[14px] font-medium text-pign-black focus:border-pign-black focus:outline-none transition-colors"
              >
                <option value="view">View</option>
                <option value="edit">Edit</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="h-[40px] px-[20px] bg-pign-black text-white text-[14px] font-medium transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Add
            </button>
          </div>

          {error && (
            <p className="text-[12px] font-medium text-verify-red">{error}</p>
          )}
        </form>

        <div className="mt-[24px] border-t border-grey-6 pt-[20px]">
          <h3 className="text-[12px] font-medium text-grey-3 uppercase tracking-wider mb-[12px]">
            Share a link
          </h3>
          <div className="flex flex-wrap gap-[8px]">
            <ShareTargetButton
              label="Share"
              onClick={() => void handleNativeShare()}
              disabled={!shareUrl}
            />
            <ShareTargetButton
              label="Copy link"
              onClick={() => void handleCopyLink()}
              disabled={!shareUrl}
            />
            <ShareTargetButton
              label="Email"
              onClick={() => openShareTarget("mailto")}
              disabled={!shareUrl}
            />
            <ShareTargetButton
              label="WhatsApp"
              onClick={() => openShareTarget("whatsapp")}
              disabled={!shareUrl}
            />
            <ShareTargetButton
              label="X"
              onClick={() => openShareTarget("x")}
              disabled={!shareUrl}
            />
            <ShareTargetButton
              label="LinkedIn"
              onClick={() => openShareTarget("linkedin")}
              disabled={!shareUrl}
            />
          </div>
        </div>

        <div className="mt-[24px] border-t border-grey-6 pt-[20px]">
          <h3 className="text-[12px] font-medium text-grey-3 uppercase tracking-wider mb-[12px]">
            People with access
          </h3>
          
          <div className="max-h-[180px] overflow-y-auto flex flex-col gap-[12px]">
            {collaborators === undefined ? (
              <p className="text-[14px] text-grey-3 italic">Loading collaborators...</p>
            ) : collaborators.length === 0 ? (
              <p className="text-[14px] text-grey-3 italic">No other collaborators. Only you have access.</p>
            ) : (
              collaborators.map((collab) => (
                <div key={collab._id} className="flex items-center justify-between py-[4px] border-b border-grey-7 last:border-b-0">
                  <div className="flex flex-col min-w-0 pr-[12px]">
                    <span className="text-[14px] font-medium text-pign-black truncate">
                      {collab.sharedWithEmail}
                    </span>
                    <span className="text-[12px] text-grey-3 capitalize">
                      Can {collab.permission}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRevoke(collab._id, collab.sharedWithEmail)}
                    className="p-[6px] text-grey-3 hover:text-verify-red transition-colors"
                    aria-label={`Revoke access for ${collab.sharedWithEmail}`}
                  >
                    <TrashDuotone className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-[28px] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-[16px] font-medium text-pign-black/90 transition-opacity hover:opacity-70"
          >
            Done
          </button>
        </div>
    </Modal>
  );
}

function ShareTargetButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="border border-grey-6 px-[14px] py-[8px] text-[13px] font-medium text-pign-black transition-colors hover:bg-grey-7 disabled:opacity-40"
    >
      {label}
    </button>
  );
}
