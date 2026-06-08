"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ShareLinkPage() {
  const params = useParams();
  const router = useRouter();
  const user = useCurrentUser();
  const token = typeof params.token === "string" ? params.token : "";
  const shared = useQuery(
    api.shareLinks.getByShareToken,
    token ? { token } : "skip"
  );

  useEffect(() => {
    if (user && shared?.documentId) {
      router.replace(
        `/document/${shared.documentId}?share=${encodeURIComponent(token)}`
      );
    }
  }, [user, shared?.documentId, token, router]);

  if (shared === undefined || user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-grey-5 border-t-pign-black" />
      </div>
    );
  }

  if (shared === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6">
        <p className="text-lg font-medium text-pign-black">Link not found</p>
        <p className="max-w-sm text-center text-sm text-grey-3">
          This share link is invalid or the file has been removed.
        </p>
        <Link href="/" className="text-sm text-grey-3 hover:text-pign-black">
          Go to Pign
        </Link>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-grey-5 border-t-pign-black" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center">
      <p className="text-sm uppercase tracking-wide text-grey-3">
        Shared via Pign
      </p>
      <h1 className="text-2xl font-medium text-pign-black">{shared.name}</h1>
      {shared.isVerified && (
        <p className="text-sm text-grey-3">Verified document</p>
      )}
      <Link
        href={`/login?redirect=${encodeURIComponent(`/s/${token}`)}`}
        className="mt-4 bg-pign-black px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        Sign in to view
      </Link>
    </div>
  );
}
