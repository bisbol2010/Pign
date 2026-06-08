"use client";

import { cn } from "@/lib/utils";

type SettingsTextActionProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  muted?: boolean;
  type?: "button" | "submit";
};

export function SettingsTextAction({
  children,
  onClick,
  disabled,
  muted,
  type = "button",
}: SettingsTextActionProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "text-[16px] transition-colors hover:underline disabled:cursor-not-allowed disabled:no-underline",
        muted ? "text-grey-5" : "text-pign-black"
      )}
    >
      {children}
    </button>
  );
}
