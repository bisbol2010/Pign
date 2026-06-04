import { type SVGProps } from "react";

/**
 * Share (paper plane) — two-tone (duotone) reversible spot illustration.
 * The lit wing is opaque and the folded under-wing uses the secondary tone,
 * producing the classic paper-plane depth; reversible via `currentColor`.
 */
export function ShareDuotone({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className ?? "h-16 w-16"}
      aria-hidden
      {...props}
    >
      {/* Top wing */}
      <path d="M60 4L6 27l22 8z" />
      {/* Folded under wing (knockout — surface color) */}
      <path fill="var(--illus-surface)" d="M60 4L28 35l2 22z" />
    </svg>
  );
}
