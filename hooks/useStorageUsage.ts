"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const TOTAL_BYTES = 15 * 1024 * 1024 * 1024; // 15 GB

/**
 * Subscribes to the aggregate bytes-used number only — *not* the full
 * document list — so navigation between dashboard pages does not refetch
 * every document, and renaming/touching a document doesn't invalidate this.
 *
 * `isLoading` is true on first load; `used` is `0` until the aggregate
 * arrives so consumers can render the bar in a sensible empty state.
 */
export function useStorageUsage() {
  const used = useQuery(api.documents.storageUsage);
  return {
    used: used ?? 0,
    total: TOTAL_BYTES,
    isLoading: used === undefined,
  };
}
