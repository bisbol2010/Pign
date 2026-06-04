"use client";

export function NotificationEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-[30px] py-[80px] text-center">
      <p className="text-[16px] font-medium text-pign-black">No notifications yet</p>
      <p className="mt-2 max-w-[360px] text-[14px] text-grey-3">
        Shares, deliveries, and verification updates will appear here.
      </p>
    </div>
  );
}
