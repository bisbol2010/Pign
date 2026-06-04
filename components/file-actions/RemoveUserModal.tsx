"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { MinusCircleIcon } from "@/components/icons";
import { Modal } from "@/components/ui/Modal";
import { useFileActionsContext } from "./FileActionsProvider";
import { useFileActions } from "./useFileActions";
import type { FileDoc } from "@/components/files/types";

type RemoveUserModalProps = {
  documentId: Id<"documents"> | null;
  open: boolean;
  onClose: () => void;
};

export function RemoveUserModal({
  documentId,
  open,
  onClose,
}: RemoveUserModalProps) {
  const { showToast } = useFileActionsContext();
  const doc = useQuery(
    api.documents.getById,
    documentId ? { id: documentId } : "skip"
  ) as FileDoc | null | undefined;
  const { removeAllCollaborators, collaborators } =
    useFileActions(doc && doc !== undefined ? (doc as FileDoc) : null);
  const revokeAccess = useMutation(api.shared.revokeAccess);

  const handleRemove = async (id: Id<"sharedAccess">) => {
    try {
      await revokeAccess({ id });
    } catch {
      showToast({ message: "Could not remove user.", type: "error" });
    }
  };

  const handleRemoveAll = async () => {
    try {
      await removeAllCollaborators();
      onClose();
    } catch {
      showToast({ message: "Could not remove users.", type: "error" });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Remove user"
      className="w-[422px] max-w-[422px]"
    >
        <div className="mt-[28px] max-h-[280px] overflow-y-auto">
          {collaborators.length === 0 ? (
            <p className="text-[16px] text-grey-3">No collaborators yet.</p>
          ) : (
            collaborators.map((entry, index) => (
              <div key={entry._id}>
                {index > 0 && (
                  <div className="border-t border-grey-6" />
                )}
                <div className="flex items-center justify-between py-[14px]">
                  <span className="text-[16px] text-pign-black">
                    {entry.sharedWithEmail}
                  </span>
                  <button
                    type="button"
                    onClick={() => void handleRemove(entry._id)}
                    className="flex items-center gap-[8px] text-[16px] font-medium text-pign-black transition-opacity hover:opacity-70"
                  >
                    <MinusCircleIcon size={24} />
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-[28px] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-[16px] text-pign-black/90 transition-opacity hover:opacity-70"
          >
            Cancel
          </button>
          <div className="flex items-center gap-[24px]">
            {collaborators.length > 0 && (
              <button
                type="button"
                onClick={() => void handleRemoveAll()}
                className="text-[16px] text-pign-black/90 transition-opacity hover:opacity-70"
              >
                Remove all
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-[16px] font-medium text-pign-black/90 transition-opacity hover:opacity-70"
            >
              Done
            </button>
          </div>
        </div>
    </Modal>
  );
}
