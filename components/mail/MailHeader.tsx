"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@/components/icons";
import { ArrowLeft } from "lucide-react";
import { MailTabs } from "./MailTabs";
import type { MailTab } from "./types";

type MailHeaderProps = {
  activeTab: MailTab;
  onTabChange: (tab: MailTab) => void;
  showBack?: boolean;
};

export function MailHeader({
  activeTab,
  onTabChange,
  showBack,
}: MailHeaderProps) {
  const router = useRouter();

  return (
    <div className="mt-[28px] flex flex-wrap items-center gap-y-[12px] pl-[30px] pr-[35px]">
      <div className="flex min-w-0 flex-wrap items-center gap-[18px]">
        {showBack ? (
          <button
            type="button"
            onClick={() => router.push("/emails")}
            className="flex size-[24px] items-center justify-center text-pign-black transition-opacity hover:opacity-70"
            aria-label="Back to emails"
          >
            <ArrowLeft size={24} strokeWidth={1.5} />
          </button>
        ) : null}
        <MailTabs activeTab={activeTab} onTabChange={onTabChange} />
        <Link
          href="/emails/compose"
          className="ml-[8px] flex h-[41px] items-center gap-[10px] rounded-[4px] bg-pign-black px-[16px] text-[18px] font-medium text-white transition-opacity hover:opacity-90"
        >
          <PlusIcon size={24} className="text-white" />
          Create email
        </Link>
      </div>
    </div>
  );
}
