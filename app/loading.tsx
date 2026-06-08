"use client";

/** Global fallback loading state */
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-[#F7F7F7]">
      <div className="flex flex-col items-center gap-[16px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-grey-5 border-t-pign-black" />
        <p className="text-[14px] font-medium text-grey-3">Loading Pign...</p>
      </div>
    </div>
  );
}
