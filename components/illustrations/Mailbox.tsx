import { type SVGProps } from "react";

/**
 * Hand-drawn mailbox with two envelopes peeking out.
 * Black/white line-art, scales via width/height props; uses `currentColor`
 * for the stroke so it can be tinted by parent text color.
 */
export function MailboxIllustration({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 110"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      {/* Mailbox body */}
      <path d="M18 50h60v40a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8V50Z" />
      {/* Rounded mailbox top */}
      <path d="M18 50a30 18 0 0 1 60 0" />
      {/* Right side cap (depth) */}
      <path d="M78 50h12v40a8 8 0 0 1-8 8h-4" />
      <path d="M78 50a30 18 0 0 1 12 0" />
      {/* Flag */}
      <path d="M90 38v-18h8v18" />
      <path d="M90 26h8" />
      {/* Mail slot */}
      <path d="M30 60h36" />
      {/* Two envelopes (the "letter ears" peeking out the top) */}
      <path d="M26 50v-14a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v14" />
      <path d="M26 36l10 8 10-8" />
      <path d="M54 50v-12a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v12" />
      <path d="M54 38l9 7 9-7" />
      {/* Ground line */}
      <path
        d="M10 102h88"
        strokeDasharray="2 4"
        opacity="0.5"
      />
    </svg>
  );
}
