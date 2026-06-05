"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import {
  UploadProvider,
  UploadStatusBanner,
} from "@/components/upload";
import { VerificationProvider } from "@/components/verification";
import { FileActionsProvider } from "@/components/file-actions";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const claimPendingShares = useMutation(api.shared.claimPendingShares);

  useEffect(() => {
    // Best-effort: attach any shares addressed to this user's email that were
    // created before they signed up. Idempotent and safe to ignore failures.
    void claimPendingShares({}).catch(() => {});
  }, [claimPendingShares]);

  return (
    // VerificationProvider must wrap UploadProvider so the upload flow's
    // useVerificationOptional() resolves to the real context (not null).
    <VerificationProvider>
      <UploadProvider>
        <FileActionsProvider>
          <SidebarProvider>
            <div className="flex min-h-screen bg-background">
              <Sidebar />
              <main className="relative flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden">
                <UploadStatusBanner />
                {children}
              </main>
            </div>
          </SidebarProvider>
        </FileActionsProvider>
      </UploadProvider>
    </VerificationProvider>
  );
}
