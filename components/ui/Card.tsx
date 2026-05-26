import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type CardVariant = "elevated" | "outline";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variantStyles: Record<CardVariant, string> = {
  elevated: "shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-4px_rgba(0,0,0,0.12)]",
  outline: "border border-grey-6",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "elevated", className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl bg-white p-6",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";
