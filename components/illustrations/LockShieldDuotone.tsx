import { type SVGProps } from "react";

/**
 * Lock-shield — two-tone (duotone) reversible spot illustration.
 * The shield is the secondary tone; the padlock body and shackle are opaque,
 * so the "secure" mark stays legible on any background via `currentColor`.
 */
export function LockShieldDuotone({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className ?? "h-16 w-16"}
      aria-hidden
      {...props}
    >
      {/* Shield (knockout — surface color) */}
      <path
        fill="var(--illus-surface)"
        d="M32 4l22 8v16c0 16-10 26-22 32C20 54 10 44 10 28V12l22-8Z"
      />
      {/* Shackle */}
      <path
        d="M25 30v-4a7 7 0 0 1 14 0v4"
        fill="none"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      {/* Lock body */}
      <path d="M23 30h18a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H23a2 2 0 0 1-2-2V32a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
