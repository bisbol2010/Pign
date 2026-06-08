"use client";

import type { ReactNode } from "react";

type SettingsFieldRowProps = {
  label: string;
  children: ReactNode;
  actions?: ReactNode;
};

export function SettingsFieldRow({
  label,
  children,
  actions,
}: SettingsFieldRowProps) {
  return (
    <div className="flex min-h-[52px] items-center border-b border-grey-6 py-3">
      <span className="w-[120px] shrink-0 text-[16px] text-grey-2 sm:w-[235px]">
        {label}
      </span>
      <div className="min-w-0 flex-1 text-[16px] font-medium text-pign-black">
        {children}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-6">{actions}</div>
      ) : null}
    </div>
  );
}
