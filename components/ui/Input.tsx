import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: ReactNode;
  helper?: ReactNode;
  error?: boolean;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helper, error = false, required, id, className, disabled, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    return (
      <div className={cn("w-full", disabled && "opacity-70")}>
        {label && (
          <label htmlFor={inputId} className="block text-xs text-grey-3 mb-1.5">
            {label}
            {required && <span className="ml-0.5 text-verify-red">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={helper ? `${inputId}-helper` : undefined}
          className={cn(
            "w-full rounded-lg bg-white px-4 py-3 text-sm transition-colors focus:outline-none",
            "border placeholder:text-grey-4",
            error
              ? "border-verify-red border-[1.5px] focus:border-verify-red"
              : "border-grey-5 focus:border-pign-black focus:border-[1.5px]",
            disabled && "cursor-not-allowed border-grey-6",
            className
          )}
          {...props}
        />
        {helper && (
          <p
            id={`${inputId}-helper`}
            className={cn(
              "mt-1.5 text-xs",
              error ? "text-verify-red" : "text-grey-3"
            )}
          >
            {helper}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
