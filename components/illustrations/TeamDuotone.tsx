import { type SVGProps } from "react";

/**
 * Team / people — two-tone (duotone) reversible spot illustration.
 * The back person uses the secondary tone and the front person is opaque,
 * reading as a small group on any background via `currentColor`.
 */
export function TeamDuotone({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className ?? "h-16 w-16"}
      aria-hidden
      {...props}
    >
      {/* Back person (secondary tone) */}
      <g fillOpacity={0.4}>
        <circle cx={42} cy={22} r={8} />
        <path d="M28 52a14 12 0 0 1 28 0v2H28z" />
      </g>
      {/* Front person */}
      <circle cx={24} cy={24} r={9} />
      <path d="M10 56a14 13 0 0 1 28 0v1a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2z" />
    </svg>
  );
}
