import { type SVGProps } from "react";

/**
 * Paper aeroplane with a dashed flight trail. Sits next to CTAs.
 * Uses currentColor for both the stroke trail and the plane outline.
 */
export function PaperPlaneIllustration({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      {/* Looping dashed trail */}
      <path
        d="M2 70 C 30 70, 30 20, 70 30 S 110 70, 140 50"
        strokeDasharray="4 5"
      />
      {/* Plane body */}
      <path d="M140 50l40-22-12 36-12-10-16-4Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M140 50l40-22" />
      <path d="M140 50l16 4" />
      <path d="M156 54l12 10" />
      <path d="M168 64l12-36" />
      <path d="M140 50l28-22" />
    </svg>
  );
}
