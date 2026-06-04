"use client";

import { cn } from "@/lib/utils";

type SettingsToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
};

export function SettingsToggle({
  checked,
  onChange,
  disabled,
  label,
}: SettingsToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[20px] w-[40px] shrink-0 rounded-full transition-colors",
        checked ? "bg-pign-black" : "bg-grey-5",
        disabled && "opacity-50"
      )}
    >
      <span
        className={cn(
          "absolute top-[2px] size-[16px] rounded-full bg-white transition-all",
          checked ? "right-[2px]" : "left-[2px]"
        )}
      />
    </button>
  );
}
