"use client";

export function MailSkeleton() {
  return (
    <div className="px-[30px] py-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="mb-3 flex h-[56px] animate-pulse items-center gap-4 rounded bg-grey-7/60"
        >
          <div className="ml-2 size-[31px] rounded-full bg-grey-6" />
          <div className="h-3 w-[140px] rounded bg-grey-6" />
          <div className="h-3 flex-1 rounded bg-grey-6" />
          <div className="mr-4 h-3 w-[72px] rounded bg-grey-6" />
        </div>
      ))}
    </div>
  );
}
