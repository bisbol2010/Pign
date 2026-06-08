import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type IconButtonSize = "sm" | "md";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: IconButtonSize;
  icon: ReactNode;
  "aria-label": string;
}

const sizeStyles: Record<IconButtonSize, string> = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size = "md", icon, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-pign-black transition-colors",
        "hover:bg-grey-7 disabled:cursor-not-allowed disabled:text-grey-4 disabled:hover:bg-transparent",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon}
    </button>
  )
);
IconButton.displayName = "IconButton";
