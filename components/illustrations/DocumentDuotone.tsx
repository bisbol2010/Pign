import { type SVGProps } from "react";

/**
 * Document — two-tone (duotone) reversible spot illustration.
 * The page sits in the secondary tone so the folded corner and text rows
 * (drawn opaque on top) stay crisp; reversible via `currentColor`.
 */
export function DocumentDuotone({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className ?? "h-16 w-16"}
      aria-hidden
      {...props}
    >
      {/* Page (secondary tone) */}
      <path
        fillOpacity={0.4}
        d="M16 6h22l10 10v40a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V8a2 2 0 0 1 0-2Z"
      />
      {/* Folded corner */}
      <path d="M38 6l10 10H40a2 2 0 0 1-2-2V6Z" />
      {/* Text rows */}
      <path d="M22 28h20v3.5H22z" />
      <path d="M22 36h20v3.5H22z" />
      <path d="M22 44h13v3.5H22z" />
    </svg>
  );
}
