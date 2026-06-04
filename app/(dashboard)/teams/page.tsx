"use client";

import { TopBar } from "@/components/layout/TopBar";
import {
  CreateTeamModal,
  TeamGrid,
  TeamPropertiesPanel,
  TeamRow,
  TeamsEmptyState,
  TeamsSkeleton,
  TeamsTableHeader,
  TeamContextMenu,
  type TeamDoc,
} from "@/components/teams";
import { PlusIcon, ViewGridIcon, ViewListIcon } from "@/components/icons";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";

function nextTeamName(existing: TeamDoc[]): string {
  const used = new Set(
    existing
      .map((t) => t.name.match(/^Team (\d+)$/)?.[1])
      .filter(Boolean)
      .map(Number)
  );
  let n = 1;
  while (used.has(n)) n++;
  return `Team ${n}`;
}

export default function TeamsPage() {
  const teams = useQuery(api.teams.list) as TeamDoc[] | undefined;
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedId, setSelectedId] = useState<Id<"teams"> | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);
  const [menuTeamId, setMenuTeamId] = useState<Id<"teams"> | null>(null);

  const defaultTeamName = useMemo(
    () => nextTeamName(teams ?? []),
    [teams]
  );

  const sortedTeams = useMemo(() => {
    if (!teams) return undefined;
    return [...teams].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.isPinned && b.isPinned) {
        return (b.pinnedAt ?? 0) - (a.pinnedAt ?? 0);
      }
      return b._creationTime - a._creationTime;
    });
  }, [teams]);

  const isLoading = teams === undefined;
  const isEmpty = teams !== undefined && teams.length === 0;
  const selectedTeam =
    teams?.find((t) => t._id === selectedId) ?? null;
  const menuTeam =
    teams?.find((t) => t._id === menuTeamId) ?? null;
  const showProperties =
    viewMode === "list" && selectedTeam && !isEmpty && !isLoading;

  const handleSelect = (id: Id<"teams">) => {
    setSelectedId(selectedId === id ? null : id);
  };

  return (
    <>
      <TopBar title="Teams" />
      <div className="flex flex-1 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-y-auto pb-10">
          <div className="mt-[28px] flex items-center justify-between pl-[30px] pr-[35px]">
            <h2 className="text-[18px] font-medium text-pign-black">
              All teams
            </h2>

            <div className="flex items-center gap-[16px]">
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-[8px] text-[16px] text-pign-black/90 transition-opacity hover:opacity-70"
              >
                <PlusIcon size={18} />
                Create teams
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <ViewListIcon
                  size={24}
                  className={cn(
                    "text-pign-black transition-opacity",
                    viewMode === "list" ? "opacity-100" : "opacity-20"
                  )}
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode("grid");
                  setSelectedId(null);
                }}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <ViewGridIcon
                  size={24}
                  className={cn(
                    "text-pign-black transition-opacity",
                    viewMode === "grid" ? "opacity-100" : "opacity-20"
                  )}
                />
              </button>
            </div>
          </div>

          <div className="mt-[16px]">
            {isLoading && <TeamsSkeleton />}

            {isEmpty && (
              <>
                <TeamsTableHeader />
                <TeamsEmptyState onCreateTeam={() => setCreateOpen(true)} />
              </>
            )}

            {sortedTeams && sortedTeams.length > 0 && (
              <>
                {viewMode === "list" ? (
                  <>
                    <TeamsTableHeader />
                    {sortedTeams.map((team) => (
                      <TeamRow
                        key={team._id}
                        team={team}
                        selected={selectedId === team._id}
                        onSelect={handleSelect}
                        onMenuOpen={(id, anchor) => {
                          setMenuTeamId(id);
                          setMenuAnchor(anchor);
                        }}
                      />
                    ))}
                  </>
                ) : (
                  <TeamGrid
                    teams={sortedTeams}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {showProperties && selectedTeam && (
          <TeamPropertiesPanel
            team={selectedTeam}
            onClose={() => setSelectedId(null)}
            onDeleted={() => setSelectedId(null)}
          />
        )}
      </div>

      <CreateTeamModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultName={defaultTeamName}
      />

      {menuTeam && menuAnchor && (
        <TeamContextMenu
          team={menuTeam}
          anchor={menuAnchor}
          onClose={() => {
            setMenuAnchor(null);
            setMenuTeamId(null);
          }}
          onActionComplete={() => {
            setSelectedId(null);
          }}
          onAddMemberRequested={() => {
            // Trigger properties panel add member state
            setSelectedId(menuTeam._id);
          }}
        />
      )}
    </>
  );
}
