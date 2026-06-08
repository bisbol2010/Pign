"use client";

import { useMemo } from "react";
import { SEARCH_FILE_GRID_COLS } from "./SearchResultRow";
import {
  FileContextMenu,
  FilePropertiesPanel,
  useFileActionsContext,
} from "@/components/file-actions";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchFileTableRow, SearchResultRow } from "./SearchResultRow";
import type { SearchFilter, SearchResults } from "./types";

type SearchResultsViewProps = {
  query: string;
  filters: SearchFilter[];
  results: SearchResults | undefined;
};

export function SearchResultsView(props: SearchResultsViewProps) {
  return <SearchResultsContent {...props} />;
}

function SearchResultsSkeleton() {
  return (
    <div className="px-[30px]" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-[16px] border-b border-grey-6 py-[13px]"
        >
          <div className="size-[31px] shrink-0 animate-pulse rounded-[4px] bg-grey-6" />
          <div className="min-w-0 flex-1">
            <div className="mb-[6px] h-[14px] w-1/3 animate-pulse rounded bg-grey-6" />
            <div className="h-[12px] w-1/2 animate-pulse rounded bg-grey-6" />
          </div>
          <div className="h-[12px] w-[48px] shrink-0 animate-pulse rounded bg-grey-6" />
        </div>
      ))}
    </div>
  );
}

function SearchResultsContent({
  query,
  filters,
  results,
}: SearchResultsViewProps) {
  const { selectedId, setSelectedId } = useFileActionsContext();

  const filesOnly =
    filters.length > 0 &&
    (filters.includes("files") || filters.includes("verified")) &&
    !filters.includes("folders") &&
    !filters.includes("emails") &&
    !filters.includes("people");

  const totalCount = useMemo(() => {
    if (!results) return 0;
    return (
      results.files.length +
      results.folders.length +
      results.emails.length +
      results.people.length
    );
  }, [results]);

  const isLoading = results === undefined;
  const isEmpty = results !== undefined && totalCount === 0;

  const selectedFile =
    results?.files.find((f) => f._id === selectedId) ?? null;

  if (isLoading) {
    return <SearchResultsSkeleton />;
  }

  if (isEmpty) {
    return <SearchEmptyState query={query} />;
  }

  if (!results) return null;

  if (filesOnly && results.files.length > 0) {
    return (
      <div className="flex flex-1 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-y-auto">
          <div
            className={`h-[28px] bg-grey-7 text-[14px] text-grey-3 ${SEARCH_FILE_GRID_COLS}`}
          >
            <span>NAME</span>
            <span className="text-center">VERIFIED</span>
            <span className="text-center">SIZE</span>
            <span className="text-center">LAST UPLOADED</span>
          </div>
          {results.files.map((file) => (
            <SearchFileTableRow
              key={file._id}
              file={file}
              query={query}
              selected={selectedId === file._id}
              onSelect={() =>
                setSelectedId(selectedId === file._id ? null : file._id)
              }
            />
          ))}
        </div>
        {selectedFile ? <FilePropertiesPanel doc={selectedFile} /> : null}
        {selectedFile ? <FileContextMenu doc={selectedFile} /> : null}
      </div>
    );
  }

  return (
    <div>
      {results.files.map((file) => (
        <SearchResultRow
          key={file._id}
          kind="file"
          query={query}
          file={file}
        />
      ))}
      {results.folders.map((folder) => (
        <SearchResultRow
          key={folder._id}
          kind="folder"
          query={query}
          folder={folder}
        />
      ))}
      {results.emails.map((email) => (
        <SearchResultRow
          key={email._id}
          kind="email"
          query={query}
          email={email}
        />
      ))}
      {results.people.map((person) => (
        <SearchResultRow
          key={person.email}
          kind="people"
          query={query}
          person={person}
        />
      ))}
    </div>
  );
}
