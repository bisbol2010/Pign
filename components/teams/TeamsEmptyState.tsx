"use client";

import { PlusIcon } from "@/components/icons";

type TeamsEmptyStateProps = {
  onCreateTeam: () => void;
};

export function TeamsEmptyState({ onCreateTeam }: TeamsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-[30px] py-[80px]">
      <p className="text-[16px] text-grey-3">No teams yet</p>
      <button
        type="button"
        onClick={onCreateTeam}
        className="mt-[24px] flex items-center gap-[8px] text-[16px] font-medium text-pign-black transition-opacity hover:opacity-70"
      >
        <PlusIcon size={18} />
        Create teams
      </button>
    </div>
  );
}
