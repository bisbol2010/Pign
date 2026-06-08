"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useVerification } from "@/components/verification/VerificationProvider";
import { canVerifyDocument } from "@/components/verification";
import {
  LinkIcon,
  MoreVerticalIcon,
  TrashIcon,
  UserAddIcon,
} from "@/components/icons";
import { formatDate, formatFileSize } from "@/lib/utils";
import type { FileDoc } from "@/components/files/types";
import { useFileActionsContext } from "./FileActionsProvider";
import { useFileActions } from "./useFileActions";

type FilePropertiesPanelProps = {
  doc: FileDoc;
};

function fileTypeLabel(fileType?: string) {
  if (!fileType) return "File";
  if (fileType.startsWith("image/")) return "Image File";
  if (fileType === "application/pdf") return "PDF File";
  return "File";
}

export function FilePropertiesPanel({ doc }: FilePropertiesPanelProps) {
  const { openMenu, setSelectedId, openDeleteConfirm, showToast } = useFileActionsContext();
  const { openVerify } = useVerification();
  const moveToTrash = useMutation(api.documents.moveToTrash);
  const {
    copyLink,
    openRemoveUserModal,
    collaborators,
  } = useFileActions(doc);

  const accessCount = collaborators.length;

  return (
    <aside className="hidden w-[329px] shrink-0 border-l border-grey-6 bg-white lg:block">
        <div className="flex items-center gap-[16px] border-b border-grey-6 px-[20px] py-[14px]">
          <button
            type="button"
            onClick={() => void copyLink()}
            aria-label="Copy link"
            className="text-pign-black transition-opacity hover:opacity-70"
          >
            <LinkIcon size={24} />
          </button>
          <button
            type="button"
            onClick={openRemoveUserModal}
            aria-label="Manage access"
            className="text-pign-black transition-opacity hover:opacity-70"
          >
            <UserAddIcon size={24} />
          </button>
          <button
            type="button"
            onClick={() => {
              openDeleteConfirm({
                title: "Move to Trash",
                message: `Are you sure you want to move "${doc.name}" to the trash folder?`,
                confirmText: "Move to Trash",
                onConfirm: async () => {
                  try {
                    await moveToTrash({ id: doc._id });
                    setSelectedId(null);
                    showToast({ message: `Moved "${doc.name}" to trash`, type: "success" });
                  } catch {
                    showToast({ message: "Could not move file to trash.", type: "error" });
                  }
                },
              });
            }}
            aria-label="Move to trash"
            className="text-pign-black transition-opacity hover:opacity-70"
          >
            <TrashIcon size={24} />
          </button>
          <button
            type="button"
            aria-label="More actions"
            className="text-pign-black transition-opacity hover:opacity-70"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setSelectedId(doc._id);
              openMenu({ x: rect.left - 160, y: rect.bottom + 4 });
            }}
          >
            <MoreVerticalIcon size={24} />
          </button>
        </div>

        <div className="px-[20px] py-[20px]">
          <h3 className="text-[16px] font-medium text-pign-black">Properties</h3>
          <dl className="mt-[16px] space-y-[12px] text-[14px]">
            <PropertyRow label="Name" value={doc.name} />
            <PropertyRow label="Type" value={fileTypeLabel(doc.fileType)} />
            <PropertyRow
              label="Size"
              value={doc.fileSize ? formatFileSize(doc.fileSize) : "—"}
            />
            <PropertyRow
              label="Date created"
              value={formatDate(doc._creationTime)}
            />
            <div className="flex gap-[8px]">
              <dt className="w-[110px] shrink-0 text-grey-3">Access</dt>
              <dd>
                {accessCount > 0 ? (
                  <button
                    type="button"
                    onClick={openRemoveUserModal}
                    className="font-medium text-pign-black underline-offset-2 hover:underline"
                  >
                    {accessCount} {accessCount === 1 ? "person" : "persons"}
                  </button>
                ) : (
                  <span className="text-pign-black">Only you</span>
                )}
              </dd>
            </div>
            <div className="flex gap-[8px]">
              <dt className="w-[110px] shrink-0 text-grey-3">Verified</dt>
              <dd className="text-pign-black">
                {doc.isVerified ? (
                  "Yes"
                ) : canVerifyDocument(doc) ? (
                  <>
                    No{" "}
                    <button
                      type="button"
                      onClick={() => openVerify(doc._id)}
                      className="font-medium underline-offset-2 hover:underline"
                    >
                      Verify now
                    </button>
                  </>
                ) : (
                  "No"
                )}
              </dd>
            </div>
          </dl>
        </div>
      </aside>
  );
}

function PropertyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-[8px]">
      <dt className="w-[110px] shrink-0 text-grey-3">{label}</dt>
      <dd className="truncate text-pign-black">{value}</dd>
    </div>
  );
}
