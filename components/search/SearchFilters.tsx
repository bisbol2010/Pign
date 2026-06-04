"use client";

import { cn } from "@/lib/utils";
import type { SearchFilter } from "./types";

const FILTER_OPTIONS: { id: SearchFilter; label: string }[] = [
  { id: "files", label: "Files" },
  { id: "folders", label: "Folders" },
  { id: "emails", label: "Emails" },
  { id: "verified", label: "Verified" },
  { id: "people", label: "People" },
];

type SearchFiltersProps = {
  active: SearchFilter[];
  onToggle: (filter: SearchFilter) => void;
  onClearAll: () => void;
};

export function SearchFilters({
  active,
  onToggle,
  onClearAll,
}: SearchFiltersProps) {
  const hasActive = active.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-[8px] pl-[30px] pr-[35px]">
      {FILTER_OPTIONS.map(({ id, label }) => {
        const isOn = active.includes(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onToggle(id)}
            aria-pressed={isOn}
            className={cn(
              "h-[20px] rounded-none border px-[10px] text-[12px] transition-colors",
              isOn
                ? "border-pign-black text-pign-black"
                : "border-grey-4 text-grey-3 hover:border-grey-3 hover:text-grey-2"
            )}
          >
            {label}
          </button>
        );
      })}
      {hasActive ? (
        <button
          type="button"
          onClick={onClearAll}
          className="ml-auto text-[12px] text-grey-2 transition-colors hover:text-pign-black"
        >
          Clear all
        </button>
      ) : null}
    </div>
  );
}
