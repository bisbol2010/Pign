import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-pign-black text-white hover:bg-grey-2 disabled:opacity-40 disabled:hover:bg-pign-black",
  secondary:
    "bg-white text-pign-black border border-grey-5 hover:bg-grey-7 disabled:text-grey-4 disabled:border-grey-6 disabled:hover:bg-white",
  ghost:
    "bg-transparent text-pign-black hover:bg-grey-7 disabled:text-grey-4 disabled:hover:bg-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-7 px-3 text-sm gap-2",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";
