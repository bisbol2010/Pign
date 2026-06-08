import { type SVGProps } from "react";

/**
 * Paper-shredder line-art — for the "shred & delete" benefit.
 */
export function ShredderIllustration({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      {/* Document going in (top) */}
      <path d="M28 4h20l6 6v18H28V4Z" />
      <path d="M48 4v6h6" />
      <path d="M34 16h12M34 22h8" />
      {/* Shredder body */}
      <rect x="10" y="32" width="60" height="20" rx="2" />
      <path d="M16 42h48" />
      {/* Output shreds */}
      <path d="M18 56l-2 30" />
      <path d="M26 56l-1 30" strokeDasharray="2 3" />
      <path d="M34 56l-2 30" />
      <path d="M42 56v30" strokeDasharray="2 3" />
      <path d="M50 56l2 30" />
      <path d="M58 56l1 30" strokeDasharray="2 3" />
      <path d="M66 56l2 30" />
    </svg>
  );
}
