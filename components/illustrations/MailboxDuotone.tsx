import { type SVGProps } from "react";

/**
 * Mailbox — two-tone (duotone) reversible spot illustration.
 * Color is driven by the parent's text color via `currentColor`; the
 * secondary tone is the same color at reduced opacity, so the mark reads
 * correctly on any light or dark surface without baked hex values.
 */
export function MailboxDuotone({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className ?? "h-16 w-16"}
      aria-hidden
      {...props}
    >
      {/* Mailbox body (secondary tone for depth) */}
      <path
        fillOpacity={0.4}
        d="M8 24a18 15 0 0 1 36 0v14a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V24Z"
      />
      {/* Post */}
      <path d="M24 40h4v18h-4z" />
      {/* Flag pole + flag */}
      <path d="M44 12h2v12h-2z" />
      <path d="M46 13h7v7h-7z" />
      {/* Mail slot */}
      <path d="M15 29h15v3.5H15z" />
    </svg>
  );
}
