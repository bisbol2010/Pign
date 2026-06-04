"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  LinkIcon,
  MoreVerticalIcon,
  TrashIcon,
  UserAddIcon,
  ChevronDownIcon,
} from "@/components/icons";
import { cn, formatDate } from "@/lib/utils";
import type { TeamDoc } from "./types";
import { useFileActionsContext } from "@/components/file-actions";

function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  const date = formatDate(timestamp);
  const time = d.toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const tz =
    Intl.DateTimeFormat("en-GB", { timeZoneName: "short" })
      .formatToParts(d)
      .find((p) => p.type === "timeZoneName")?.value ?? "";
  return tz ? `${date}  ${time}\n${tz}` : `${date}  ${time}`;
}

type TeamPropertiesPanelProps = {
  team: TeamDoc;
  onClose: () => void;
  onDeleted: () => void;
};

export function TeamPropertiesPanel({
  team,
  onClose,
  onDeleted,
}: TeamPropertiesPanelProps) {
  const { openDeleteConfirm, showToast } = useFileActionsContext();
  const removeTeam = useMutation(api.teams.remove);
  const addMember = useMutation(api.teams.addMember);
  const removeMember = useMutation(api.teams.removeMember);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [adding, setAdding] = useState(false);

  const memberCount = team.memberEmails.length + 1;
  const accessLabel =
    team.memberEmails.length === 0
      ? "Only me"
      : `${memberCount} ${memberCount === 1 ? "person" : "persons"}`;

  const handleCopyEmails = async () => {
    const all = team.memberEmails.join(", ");
    if (!all) return;
    try {
      await navigator.clipboard.writeText(all);
    } catch {
      /* ignore */
    }
  };

  const handleDelete = () => {
    openDeleteConfirm({
      title: "Move Team to Trash",
      message: `Are you sure you want to move the team "${team.name}" to the trash folder?`,
      confirmText: "Move to Trash",
      onConfirm: async () => {
        try {
          await removeTeam({ id: team._id });
          showToast({ message: `Moved "${team.name}" to trash`, type: "success" });
          onDeleted();
        } catch {
          showToast({ message: "Could not delete team.", type: "error" });
        }
      },
    });
  };

  const handleAddMember = async () => {
    const email = memberEmail.trim().toLowerCase();
    if (!email) return;
    setAdding(true);
    try {
      await addMember({ teamId: team._id, email });
      setMemberEmail("");
      setShowAddMember(false);
      showToast({ message: `Added ${email} to team`, type: "success" });
    } catch {
      showToast({ message: "Could not add member.", type: "error" });
    } finally {
      setAdding(false);
    }
  };

  return (
    <aside className="hidden w-[329px] shrink-0 border-l border-grey-6 bg-white lg:block">
      <div className="flex items-center gap-[16px] border-b border-grey-6 px-[20px] py-[14px]">
        <button
          type="button"
          onClick={() => void handleCopyEmails()}
          aria-label="Copy member emails"
          className="text-pign-black transition-opacity hover:opacity-70"
          disabled={team.memberEmails.length === 0}
        >
          <LinkIcon size={24} />
        </button>
        <button
          type="button"
          onClick={() => setShowAddMember((v) => !v)}
          aria-label="Add members"
          className="text-pign-black transition-opacity hover:opacity-70"
        >
          <UserAddIcon size={24} />
        </button>
        <button
          type="button"
          onClick={() => void handleDelete()}
          aria-label="Delete team"
          className="text-pign-black transition-opacity hover:opacity-70"
        >
          <TrashIcon size={24} />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close properties"
          className="ml-auto text-pign-black transition-opacity hover:opacity-70"
        >
          <MoreVerticalIcon size={24} />
        </button>
      </div>

      <div className="px-[20px] py-[20px]">
        <h3 className="text-[16px] font-medium text-pign-black">Properties</h3>
        <dl className="mt-[16px] space-y-[12px] text-[14px]">
          <PropertyRow label="Name" value={team.name} />
          <PropertyRow label="Type" value="Team Folder" />
          <PropertyRow
            label="Date created"
            value={formatDate(team._creationTime)}
          />
          <div className="flex gap-[8px]">
            <dt className="w-[110px] shrink-0 text-grey-3">Last modified</dt>
            <dd className="whitespace-pre-line text-pign-black opacity-80">
              {formatDateTime(team._creationTime)}
            </dd>
          </div>
          <div className="flex gap-[8px]">
            <dt className="w-[110px] shrink-0 text-grey-3">Access</dt>
            <dd className="flex flex-1 items-center justify-between gap-[8px]">
              <span className="text-pign-black opacity-80">{accessLabel}</span>
              <ChevronDownIcon size={24} className="shrink-0 text-grey-2" />
            </dd>
          </div>
        </dl>

        {showAddMember && (
          <div className="mt-[16px] flex gap-[8px]">
            <input
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void handleAddMember()}
              placeholder="Member email"
              className="flex-1 border border-grey-5 px-[10px] py-[8px] text-[14px] focus:outline-none focus:border-pign-black"
            />
            <button
              type="button"
              disabled={adding || !memberEmail.trim()}
              onClick={() => void handleAddMember()}
              className="text-[14px] font-medium text-pign-black disabled:opacity-40"
            >
              Add
            </button>
          </div>
        )}

        {team.memberEmails.length > 0 && (
          <ul className="mt-[16px] space-y-[8px]">
            {team.memberEmails.map((email) => (
              <li
                key={email}
                className="flex items-center justify-between text-[14px] text-grey-2"
              >
                <span className="truncate">{email}</span>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await removeMember({ teamId: team._id, email });
                      showToast({ message: `Removed ${email} from team`, type: "success" });
                    } catch {
                      showToast({ message: "Could not remove member.", type: "error" });
                    }
                  }}
                  className={cn(
                    "shrink-0 text-[12px] text-grey-3 hover:text-pign-black"
                  )}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

function PropertyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-[8px]">
      <dt className="w-[110px] shrink-0 text-grey-3">{label}</dt>
      <dd className="truncate text-pign-black opacity-80">{value}</dd>
    </div>
  );
}
