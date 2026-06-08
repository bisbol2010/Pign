import type { ReactNode } from "react";

/**
 * Non-navigating stand-in for marketing links that do not have routes yet.
 * Avoids invalid `aria-disabled` on `<a href="#">` and focus traps to `#`.
 */
export function ComingSoonStub({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      role="link"
      aria-disabled="true"
      tabIndex={-1}
      title="Coming soon"
      className={className}
    >
      {children}
    </span>
  );
}
