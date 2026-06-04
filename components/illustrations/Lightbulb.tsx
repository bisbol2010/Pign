import { type SVGProps } from "react";

/**
 * Tiny hand-drawn lightbulb — used as an inline "idea" accent next to
 * headings or empty states.
 */
export function LightbulbIllustration({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      {/* Bulb */}
      <path d="M24 4a14 14 0 0 1 10 23.6c-2.4 2.5-4 4-4 7.4v3H18v-3c0-3.4-1.6-4.9-4-7.4A14 14 0 0 1 24 4Z" />
      {/* Filament */}
      <path d="M20 22l4 4 4-4" />
      {/* Screw lines */}
      <path d="M18 42h12M19 46h10M20 50h8" />
      {/* Sparks */}
      <path d="M4 18l4 2M44 18l-4 2M24 0v-0.1" />
      <path d="M8 6l3 3M40 6l-3 3" />
    </svg>
  );
}
