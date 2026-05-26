import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("inline-flex items-center gap-1 text-sm text-grey-3", className)}
      {...props}
    >
      {children}
      {required && <span className="text-verify-red" aria-hidden>*</span>}
    </label>
  )
);
Label.displayName = "Label";
