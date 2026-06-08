import { type SVGProps } from "react";

/**
 * Padlock-on-shield mark used for the "secure & encrypted" beat.
 */
export function LockShieldIllustration({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 80 90"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      <path d="M40 4 8 14v28c0 22 14 36 32 44 18-8 32-22 32-44V14L40 4Z" />
      <rect x="28" y="42" width="24" height="22" rx="3" />
      <path d="M34 42v-6a6 6 0 0 1 12 0v6" strokeDasharray="2 3" />
      <circle cx="40" cy="52" r="2" fill="currentColor" />
      <path d="M40 54v6" />
    </svg>
  );
}
