import { type SVGProps } from "react";

/**
 * 4-point sparkle / "star" used as a separator between marketing phrases.
 * Filled with currentColor.
 */
export function StarSparkIllustration({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
      {...props}
    >
      <path d="M12 0c.5 5 2.5 7 7 7-4.5 0-7 2-7 7 0-5-2.5-7-7-7 4.5 0 7-2 7-7Z" />
    </svg>
  );
}
