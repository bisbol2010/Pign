"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PlusIcon } from "@/components/icons";
import { Modal } from "@/components/ui/Modal";
import { EmailChipInput } from "@/components/ui/EmailChipInput";

type CreateTeamModalProps = {
  open: boolean;
  onClose: () => void;
  defaultName: string;
};

export function CreateTeamModal({
  open,
  onClose,
  defaultName,
}: CreateTeamModalProps) {
  const createTeam = useMutation(api.teams.create);
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(defaultName);
  const [addMembers, setAddMembers] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(defaultName);
      setAddMembers(false);
      setEmails([]);
      setError("");
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [open, defaultName]);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    setError("");
    try {
      await createTeam({
        name: trimmed,
        memberEmails: addMembers ? emails : [],
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create team.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      dismissible={!saving}
      title="New team"
      className="w-[422px] max-w-[422px]"
    >
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !addMembers) void handleSubmit();
            if (e.key === "Escape") onClose();
          }}
          placeholder="Team 1"
          className="mt-[28px] h-[46px] w-full border border-pign-black/60 px-[12px] text-[16px] text-pign-black focus:outline-none focus:ring-1 focus:ring-pign-black"
          aria-label="Team name"
        />

        <button
          type="button"
          onClick={() => setAddMembers((v) => !v)}
          className="mt-[16px] flex items-center gap-[8px] text-[14px] text-pign-black/80 transition-opacity hover:opacity-70"
        >
          <PlusIcon size={18} className="text-pign-black" />
          Add member(s)
        </button>

        {addMembers && (
          <div className="mt-[12px]">
            <EmailChipInput
              emails={emails}
              onChange={setEmails}
              placeholder="teammate@example.com"
            />
          </div>
        )}

        {error && (
          <p className="mt-2 text-[14px] text-red-600">{error}</p>
        )}

        <div className="mt-[28px] flex items-center justify-end gap-[24px]">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-[16px] text-pign-black/90 transition-opacity hover:opacity-70 disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={saving || !name.trim()}
            className="text-[16px] font-medium text-pign-black/90 transition-opacity hover:opacity-70 disabled:opacity-40"
          >
            {saving ? "Creating…" : "Create team"}
          </button>
        </div>
    </Modal>
  );
}
