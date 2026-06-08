import { type SVGProps } from "react";

/**
 * Trash — two-tone (duotone) reversible spot illustration.
 * The can body is the secondary tone; the lid, handle and ribs are opaque.
 * Reversible via `currentColor`.
 */
export function TrashDuotone({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className ?? "h-16 w-16"}
      aria-hidden
      {...props}
    >
      {/* Can body (knockout — surface color) */}
      <path
        fill="var(--illus-surface)"
        d="M16 22h32l-3 32a4 4 0 0 1-4 4H23a4 4 0 0 1-4-4L16 22Z"
      />
      {/* Lid */}
      <path d="M12 16h40v5H12z" />
      {/* Handle */}
      <path d="M26 16v-3a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3h-4v-2h-4v2z" />
      {/* Ribs */}
      <g stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
        <path d="M27 29v21" />
        <path d="M32 29v21" />
        <path d="M37 29v21" />
      </g>
    </svg>
  );
}
