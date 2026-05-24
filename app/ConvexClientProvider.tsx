"use client";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  throw new Error(
    "Missing NEXT_PUBLIC_CONVEX_URL — set it in .env.local (see README)"
  );
}
const convex = new ConvexReactClient(CONVEX_URL);

// IMPORTANT: this must be ConvexAuthNextjsProvider (from "@convex-dev/auth/nextjs"),
// NOT ConvexAuthProvider (from "@convex-dev/auth/react"). The Next.js variant
// syncs the auth token into an HTTP cookie via the /api/auth route, which is
// what the server-side middleware (proxy.ts) checks. The generic React provider
// only writes to localStorage, so the middleware never sees you as
// authenticated and bounces every protected navigation to /login.
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      {children}
    </ConvexAuthNextjsProvider>
  );
}
