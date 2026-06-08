"use client";

import { cn, formatDate } from "@/lib/utils";
import { SharedCellIcon, TeamFolderGlyphIcon } from "@/components/icons";
import type { TeamDoc } from "./types";
import type { Id } from "@/convex/_generated/dataModel";

type TeamGridProps = {
  teams: TeamDoc[];
  selectedId?: Id<"teams"> | null;
  onSelect?: (id: Id<"teams">) => void;
};

export function TeamGrid({ teams, selectedId, onSelect }: TeamGridProps) {
  return (
    <div className="grid grid-cols-1 gap-[32px] px-[30px] pt-[20px] sm:grid-cols-2 xl:grid-cols-3">
      {teams.map((team) => {
        const selected = selectedId === team._id;
        const hasMembers = team.memberEmails.length > 0;
        return (
          <button
            key={team._id}
            type="button"
            onClick={() => onSelect?.(team._id)}
            className={cn(
              "flex h-[84px] items-center gap-[16px] border border-grey-6 px-[16px] text-left transition-colors hover:bg-grey-7",
              selected && "border-grey-2 bg-grey-7/60 ring-2 ring-grey-2"
            )}
          >
            <TeamFolderGlyphIcon size={31} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium text-pign-black">
                {team.name}
              </p>
              <div className="mt-[6px] flex items-center gap-[14px] text-[14px] text-grey-2">
                <span>{formatDate(team._creationTime)}</span>
                {hasMembers && (
                  <SharedCellIcon size={18} className="text-grey-2" />
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
