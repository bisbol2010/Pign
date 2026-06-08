"use client";

import { TopBar } from "@/components/layout/TopBar";
import {
  MailDetail,
  MailHeader,
  MailSkeleton,
  type MailTab,
} from "@/components/mail";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function EmailDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deliveryId =
    typeof params.id === "string" ? (params.id as Id<"deliveries">) : null;

  const delivery = useQuery(
    api.deliveries.getById,
    deliveryId ? { id: deliveryId } : "skip"
  );
  const markRead = useMutation(api.deliveries.markRead);

  useEffect(() => {
    if (delivery && !delivery.isRead && delivery.perspective === "inbox" && deliveryId) {
      void markRead({ id: deliveryId });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delivery?._id]);

  const activeTab: MailTab = useMemo(() => {
    if (!delivery) return "all";
    if (delivery.folder === "drafts") return "drafts";
    if (delivery.perspective === "inbox") return "inbox";
    return "outbox";
  }, [delivery]);

  const onTabChange = (tab: MailTab) => {
    const qs = tab === "all" ? "" : `?tab=${tab}`;
    router.push(`/emails${qs}`);
  };

  return (
    <>
      <TopBar title="Emails" />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <MailHeader
          activeTab={activeTab}
          onTabChange={onTabChange}
          showBack
        />
        {delivery === undefined && <MailSkeleton />}
        {delivery === null && (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-grey-3">Email not found.</p>
          </div>
        )}
        {delivery && <MailDetail delivery={delivery} />}
      </div>
    </>
  );
}
