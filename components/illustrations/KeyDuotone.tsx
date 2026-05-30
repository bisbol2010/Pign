import { type SVGProps } from "react";

/**
 * Key / encryption — two-tone (duotone) reversible spot illustration.
 * The bow (ring) uses the secondary tone with an even-odd hole so the
 * background shows through; the blade is opaque. Reversible via `currentColor`.
 */
export function KeyDuotone({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className ?? "h-16 w-16"}
      aria-hidden
      {...props}
    >
      {/* Bow / ring (secondary tone, hollow) */}
      <path
        fillOpacity={0.4}
        fillRule="evenodd"
        d="M20 12a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm0 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"
      />
      {/* Blade + teeth */}
      <path d="M30 21h26v5H30z" />
      <path d="M53 26h4v7h-4z" />
      <path d="M45 26h3v5h-3z" />
    </svg>
  );
}
