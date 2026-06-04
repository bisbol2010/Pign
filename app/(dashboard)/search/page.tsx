"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TopBar } from "@/components/layout/TopBar";
import {
  SearchFilters,
  SearchResultsView,
  type SearchFilter,
} from "@/components/search";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const [filters, setFilters] = useState<SearchFilter[]>([]);

  const results = useQuery(
    api.search.run,
    query ? { query, filters: filters.length > 0 ? filters : undefined } : "skip"
  );

  const resultCount = useMemo(() => {
    if (!results) return 0;
    return (
      results.files.length +
      results.folders.length +
      results.emails.length +
      results.people.length
    );
  }, [results]);

  const toggleFilter = useCallback((filter: SearchFilter) => {
    setFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  }, []);

  const clearFilters = useCallback(() => setFilters([]), []);

  return (
    <>
      <TopBar title="Search" searchQuery={query} />
      <div className="flex flex-1 flex-col overflow-hidden pb-10">
        <div className="mt-[28px] pl-[30px] pr-[35px]">
          {query ? (
            <p className="text-[18px] text-pign-black">
              {results === undefined ? (
                <>Searching for &ldquo;{query}&rdquo;…</>
              ) : (
                <>
                  {resultCount} result{resultCount === 1 ? "" : "s"} for &ldquo;
                  {query}&rdquo;
                </>
              )}
            </p>
          ) : (
            <p className="text-[18px] text-grey-3">
              Type a query in the search bar and press Enter.
            </p>
          )}
        </div>

        {query ? (
          <div className="mt-[16px]">
            <SearchFilters
              active={filters}
              onToggle={toggleFilter}
              onClearAll={clearFilters}
            />
            <div className="mt-[20px] flex min-h-0 flex-1 flex-col">
              <SearchResultsView
                query={query}
                filters={filters}
                results={results}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="px-[30px] py-10 text-[14px] text-grey-3">Loading…</div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
