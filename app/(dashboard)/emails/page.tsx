"use client";

import { TopBar } from "@/components/layout/TopBar";
import {
  MailEmptyState,
  MailHeader,
  MailList,
  MailSkeleton,
  type MailTab,
} from "@/components/mail";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback } from "react";

function EmailsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useCurrentUser();
  const tabParam = searchParams.get("tab");
  const activeTab: MailTab =
    tabParam === "inbox" ||
    tabParam === "outbox" ||
    tabParam === "drafts" ||
    tabParam === "all"
      ? tabParam
      : "all";

  const deliveries = useQuery(api.deliveries.list, { folder: activeTab });

  const onTabChange = useCallback(
    (tab: MailTab) => {
      const qs = tab === "all" ? "" : `?tab=${tab}`;
      router.push(`/emails${qs}`);
    },
    [router]
  );

  const isLoading = deliveries === undefined;
  const isEmpty = deliveries !== undefined && deliveries.length === 0;

  return (
    <>
      <TopBar title="Emails" />
      <div className="flex flex-1 flex-col overflow-y-auto pb-10">
        <MailHeader activeTab={activeTab} onTabChange={onTabChange} />
        <div className="mt-[16px]">
          {isLoading && <MailSkeleton />}
          {isEmpty && <MailEmptyState tab={activeTab} />}
          {deliveries && deliveries.length > 0 && (
            <MailList deliveries={deliveries} userId={user?._id} />
          )}
        </div>
      </div>
    </>
  );
}

export default function EmailsPage() {
  return (
    <Suspense
      fallback={
        <>
          <TopBar title="Emails" />
          <div className="flex flex-1 flex-col overflow-y-auto pb-10">
            <MailSkeleton />
          </div>
        </>
      }
    >
      <EmailsPageContent />
    </Suspense>
  );
}
