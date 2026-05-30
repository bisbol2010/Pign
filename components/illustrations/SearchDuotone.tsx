import { type SVGProps } from "react";

/**
 * Search — two-tone (duotone) reversible spot illustration.
 * The lens is filled with the secondary tone; the ring and handle are opaque
 * strokes for crispness. Reversible via `currentColor`.
 */
export function SearchDuotone({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className ?? "h-16 w-16"}
      aria-hidden
      {...props}
    >
      {/* Lens (secondary tone) */}
      <circle cx={27} cy={27} r={16} fillOpacity={0.4} />
      {/* Ring */}
      <circle
        cx={27}
        cy={27}
        r={16}
        fill="none"
        stroke="currentColor"
        strokeWidth={4}
      />
      {/* Handle */}
      <path
        d="M39 39l16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={6}
        strokeLinecap="round"
      />
    </svg>
  );
}
