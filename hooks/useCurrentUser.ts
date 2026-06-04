"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

/**
 * Subscribes to the current user. Tri-state contract:
 *  - `undefined` → still loading (render a skeleton, not a fallback string)
 *  - `null`      → signed out / no user row
 *  - `{ _id, name, email, image, pignHandle, avatarUrl, timezone, … }` → loaded
 */
export function useCurrentUser() {
  return useQuery(api.users.currentUser);
}
