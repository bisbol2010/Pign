import { type SVGProps } from "react";

/**
 * Upload — two-tone (duotone) reversible spot illustration.
 * A secondary-tone tray sits behind an opaque up-arrow; reversible via
 * `currentColor` so it works on light and dark surfaces alike.
 */
export function UploadDuotone({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className ?? "h-16 w-16"}
      aria-hidden
      {...props}
    >
      {/* Tray / base (secondary tone) */}
      <path
        fillOpacity={0.4}
        d="M10 40h44v10a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V40Z"
      />
      {/* Up arrow */}
      <path d="M32 6l12 14H20z" />
      <path d="M27 18h10v22H27z" />
    </svg>
  );
}
