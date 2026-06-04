"use client";

import { useEffect, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Optional heading rendered at the top of the panel. */
  title?: ReactNode;
  children: ReactNode;
  /** Panel sizing/layout overrides (width, padding, etc.). */
  className?: string;
  /** Overlay overrides, e.g. a higher z-index for nested dialogs. */
  overlayClassName?: string;
  /**
   * When false, the modal cannot be dismissed via backdrop click or Escape
   * (useful while a confirm action is in-flight). Defaults to true.
   */
  dismissible?: boolean;
  /** Hide the top-right close button. Defaults to false. */
  hideCloseButton?: boolean;
  /** Accessible label for the dialog when no visible title is rendered. */
  ariaLabel?: string;
};

/**
 * Shared modal primitive: straight edges, backdrop-click + Escape dismissal,
 * and a consistent close button. All app dialogs should build on top of this.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  overlayClassName,
  dismissible = true,
  hideCloseButton = false,
  ariaLabel,
}: ModalProps) {
  useEffect(() => {
    if (!open || !dismissible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, dismissible, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-pign-black/60 p-4",
        overlayClassName
      )}
      role="presentation"
      onMouseDown={(e) => {
        if (dismissible && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          "relative max-h-[90vh] w-full max-w-[422px] overflow-y-auto bg-white px-[30px] pb-[28px] pt-[24px] shadow-lg",
          className
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {!hideCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-[18px] top-[18px] flex size-[28px] items-center justify-center text-grey-3 transition-colors hover:text-pign-black"
          >
            <CloseIcon size={22} />
          </button>
        )}
        {title ? (
          <h2 className="pr-[32px] text-[24px] font-medium text-pign-black">
            {title}
          </h2>
        ) : null}
        {children}
      </div>
    </div>
  );
}
