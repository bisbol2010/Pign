"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function useStorageUsage() {
  const documents = useQuery(api.documents.list);
  if (!documents) return { used: 0, total: 15 * 1024 * 1024 * 1024 };
  const used = documents.reduce((acc, doc) => acc + (doc.fileSize ?? 0), 0);
  const total = 15 * 1024 * 1024 * 1024; // 15 GB
  return { used, total };
}
