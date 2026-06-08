import { type SVGProps } from "react";

/**
 * Error / 404 — two-tone (duotone) reversible spot illustration.
 * A secondary-tone warning triangle backs an opaque exclamation, for error
 * and broken/empty states. Reversible via `currentColor`.
 */
export function ErrorStateDuotone({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className ?? "h-16 w-16"}
      aria-hidden
      {...props}
    >
      {/* Warning triangle (knockout — surface color) */}
      <path
        fill="var(--illus-surface)"
        d="M28.5 9a4 4 0 0 1 7 0l23 41a4 4 0 0 1-3.5 6H9a4 4 0 0 1-3.5-6L28.5 9Z"
      />
      {/* Exclamation bar + dot */}
      <path d="M29 24h6l-1 16h-4z" />
      <circle cx={32} cy={47} r={3} />
    </svg>
  );
}
