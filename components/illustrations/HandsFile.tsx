import { type SVGProps } from "react";

/**
 * Two hands passing a document — used on the Benefits / share story.
 * Sits well on dark surfaces; uses currentColor strokes.
 */
export function HandsFileIllustration({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      {/* Document */}
      <rect x="60" y="40" width="60" height="80" rx="4" />
      <path d="M70 56h40M70 70h40M70 84h30M70 98h24" />
      {/* "Pign" stamp on document */}
      <rect x="74" y="46" width="22" height="6" rx="1" fill="currentColor" />
      {/* Left hand passing in */}
      <path d="M10 96c14 0 22-6 30-6h22" />
      <path d="M10 96l-4 12h28l8-12" />
      <path d="M22 96v-8M30 96v-10M38 96v-8" />
      {/* Right hand receiving */}
      <path d="M170 96c-14 0-22-6-30-6h-22" />
      <path d="M170 96l4 12h-28l-8-12" />
      <path d="M158 96v-8M150 96v-10M142 96v-8" />
      {/* Subtle motion lines */}
      <path d="M64 130l4 8M90 132l4 10M116 130l4 8" opacity="0.5" />
    </svg>
  );
}
