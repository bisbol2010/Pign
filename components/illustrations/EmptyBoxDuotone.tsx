import { type SVGProps } from "react";

/**
 * Empty box — two-tone (duotone) reversible spot illustration for empty states.
 * The carton body is the secondary tone, the interior a fainter tertiary tone,
 * and the open flaps are opaque. Reversible via `currentColor`.
 */
export function EmptyBoxDuotone({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className ?? "h-16 w-16"}
      aria-hidden
      {...props}
    >
      {/* Box body (knockout — surface color) */}
      <path
        fill="var(--illus-surface)"
        d="M12 26h40v26a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V26Z"
      />
      {/* Interior depth (tertiary tone) */}
      <path fillOpacity={0.18} d="M12 26h40v8H12z" />
      {/* Open flaps */}
      <path d="M12 26L4 19l11-4 8 8z" />
      <path d="M52 26l8-7-11-4-8 8z" />
    </svg>
  );
}
