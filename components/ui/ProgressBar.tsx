import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  value: number;
  max?: number;
  ariaLabel?: string;
  trackClassName?: string;
  fillClassName?: string;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    { value, max = 100, ariaLabel = "Progress", className, trackClassName, fillClassName, ...props },
    ref
  ) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(value)}
        className={cn("w-full overflow-hidden rounded-full bg-grey-6", "h-1.5", trackClassName, className)}
        {...props}
      >
        <div
          className={cn("h-full rounded-full bg-pign-black transition-all", fillClassName)}
          style={{ width: `${pct}%` }}
        />
      </div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";
