"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type NotificationHeaderProps = {
  onMarkAllRead?: () => void;
  showMarkAllRead?: boolean;
};

export function NotificationHeader({
  onMarkAllRead,
  showMarkAllRead,
}: NotificationHeaderProps) {
  const router = useRouter();

  return (
    <div className="mt-[28px] flex items-center justify-between pl-[30px] pr-[35px]">
      <div className="flex items-center gap-[18px]">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="flex size-[24px] items-center justify-center text-pign-black transition-opacity hover:opacity-70"
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>
        <h2 className="text-[18px] font-medium text-pign-black">
          All Notifications
        </h2>
      </div>
      {showMarkAllRead && onMarkAllRead ? (
        <button
          type="button"
          onClick={onMarkAllRead}
          className="text-[14px] text-grey-2 transition-colors hover:text-pign-black"
        >
          Mark all as read
        </button>
      ) : null}
    </div>
  );
}
