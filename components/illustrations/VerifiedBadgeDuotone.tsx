import { type SVGProps } from "react";

/**
 * Verified badge — two-tone (duotone) reversible spot illustration.
 * A scalloped seal in the secondary tone backs an opaque check mark,
 * distinguishing it from the plain success check. Reversible via `currentColor`.
 */
export function VerifiedBadgeDuotone({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className ?? "h-16 w-16"}
      aria-hidden
      {...props}
    >
      {/* Scalloped seal (secondary tone) */}
      <path
        fillOpacity={0.4}
        d="M32 6 37.4 11.7 45 9.5 46.8 17.1 54.5 19 52.3 26.6 58 32 52.3 37.4 54.5 45 46.8 46.8 45 54.5 37.4 52.3 32 58 26.6 52.3 19 54.5 17.1 46.8 9.5 45 11.7 37.4 6 32 11.7 26.6 9.5 19 17.1 17.1 19 9.5 26.6 11.7Z"
      />
      {/* Check */}
      <path
        d="M22 32l7 7 13-14"
        fill="none"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
