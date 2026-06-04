"use client";

type PermissionDeniedProps = {
  onRequestPermission?: () => void;
};

/** Figma `549:2084` — permission denied overlay inside the viewer canvas. */
export function PermissionDenied({ onRequestPermission }: PermissionDeniedProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-grey-6/80">
      <div className="flex flex-col items-center gap-[16px] bg-white px-[32px] py-[28px] text-center shadow-sm">
        <p className="max-w-[289px] text-[16px] leading-snug text-pign-black">
          You do not have the permission to view
          <br />
          this file
        </p>
        <button
          type="button"
          onClick={onRequestPermission}
          className="border border-grey-4 px-[24px] py-[8px] text-[14px] text-pign-black transition-colors hover:border-pign-black"
        >
          Request Permission
        </button>
      </div>
    </div>
  );
}
