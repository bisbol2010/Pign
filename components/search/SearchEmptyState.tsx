"use client";

import { SearchDuotone } from "@/components/illustrations";

type SearchEmptyStateProps = {
  query: string;
};

export function SearchEmptyState({ query }: SearchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-[30px] py-[80px] text-center">
      <SearchDuotone className="mb-[32px] h-[120px] w-[120px] text-pign-black" />
      <p className="text-[18px] font-medium text-pign-black/90">
        No results for &ldquo;{query}&rdquo;
      </p>
      <p className="mt-[12px] max-w-[400px] text-[14px] text-grey-3">
        Try a different keyword, check your spelling, or clear filters to search
        everything.
      </p>
    </div>
  );
}
