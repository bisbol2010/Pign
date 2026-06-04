import { type SVGProps } from "react";

/**
 * Success check — two-tone (duotone) reversible spot illustration.
 * A secondary-tone disc backs an opaque check mark for a clean "done" state.
 * Reversible via `currentColor`.
 */
export function SuccessCheckDuotone({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className ?? "h-16 w-16"}
      aria-hidden
      {...props}
    >
      {/* Disc (knockout — surface color) */}
      <circle cx={32} cy={32} r={24} fill="var(--illus-surface)" />
      {/* Check */}
      <path
        d="M20 33l8 8 16-18"
        fill="none"
        stroke="currentColor"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
