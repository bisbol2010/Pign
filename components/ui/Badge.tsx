import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "verified"
  | "expired"
  | "disputed"
  | "pending";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  showDot?: boolean;
}

const variantStyles: Record<BadgeVariant, { border: string; text: string; dot: string }> = {
  default:  { border: "border-grey-6",      text: "text-grey-2",       dot: "bg-grey-4" },
  verified: { border: "border-verify-green", text: "text-verify-green", dot: "bg-verify-green" },
  expired:  { border: "border-verify-amber", text: "text-verify-amber", dot: "bg-verify-amber" },
  disputed: { border: "border-verify-red",   text: "text-verify-red",   dot: "bg-verify-red" },
  pending:  { border: "border-verify-yellow", text: "text-verify-yellow", dot: "bg-verify-yellow" },
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", showDot, className, children, ...props }, ref) => {
    const styles = variantStyles[variant];
    const dotVisible = showDot ?? variant !== "default";
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-0.5 text-xs",
          styles.border,
          styles.text,
          className
        )}
        {...props}
      >
        {dotVisible && (
          <span
            aria-hidden
            className={cn("h-2 w-2 rounded-full", styles.dot)}
          />
        )}
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";
