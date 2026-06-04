"use client";

import { cn, formatDate } from "@/lib/utils";
import { SharedCellIcon, TeamFolderGlyphIcon, PinIcon, MoreVerticalIcon } from "@/components/icons";
import type { TeamDoc } from "./types";
import type { Id } from "@/convex/_generated/dataModel";

/** Four-column grid aligned with the Figma teams list header. */
export const TEAM_GRID_COLS =
  "grid grid-cols-[1fr_96px_130px_40px] items-center pl-[30px] pr-[35px]";

type TeamRowProps = {
  team: TeamDoc;
  selected?: boolean;
  onSelect?: (id: Id<"teams">) => void;
  onMenuOpen?: (id: Id<"teams">, anchor: { x: number; y: number }) => void;
};

export function TeamRow({ team, selected, onSelect, onMenuOpen }: TeamRowProps) {
  const hasMembers = team.memberEmails.length > 0;

  return (
    <div
      role="row"
      aria-selected={selected}
      onClick={() => onSelect?.(team._id)}
      className={cn(
        "cursor-pointer border-b border-grey-6 transition-colors hover:bg-grey-7 group",
        selected && "border border-grey-2 bg-grey-7/60",
        TEAM_GRID_COLS
      )}
    >
      <div className="flex min-w-0 items-center gap-[16px] py-[13px]">
        <TeamFolderGlyphIcon size={31} className="shrink-0" />
        <div className="flex items-center gap-[8px] min-w-0">
          <p className="truncate text-[16px] font-medium text-pign-black">
            {team.name}
          </p>
          {team.isPinned && (
            <PinIcon size={14} className="text-pign-black shrink-0 rotate-45" />
          )}
        </div>
      </div>

      <div className="flex justify-center">
        {hasMembers && (
          <SharedCellIcon size={24} className="text-grey-2" />
        )}
      </div>

      <div className="text-center text-[16px] text-grey-2 opacity-80">
        {formatDate(team._creationTime)}
      </div>

      <div className="flex justify-end pr-1">
        <button
          type="button"
          aria-label="Team actions"
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(team._id);
            const rect = e.currentTarget.getBoundingClientRect();
            onMenuOpen?.(team._id, { x: rect.left - 160, y: rect.bottom + 4 });
          }}
          className="flex h-8 w-8 items-center justify-center rounded text-grey-2 opacity-0 hover:bg-grey-6 hover:text-pign-black group-hover:opacity-100 focus:opacity-100 transition-all"
        >
          <MoreVerticalIcon size={20} />
        </button>
      </div>
    </div>
  );
}
