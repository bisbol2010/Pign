import { type SVGProps } from "react";

/**
 * Folder — two-tone (duotone) reversible spot illustration.
 * The back panel/tab uses the secondary tone and the front flap is opaque,
 * giving an open-folder depth read on any background via `currentColor`.
 */
export function FolderDuotone({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className ?? "h-16 w-16"}
      aria-hidden
      {...props}
    >
      {/* Back panel + tab (knockout — surface color) */}
      <path
        fill="var(--illus-surface)"
        d="M6 16h16l5 6h28a3 3 0 0 1 3 3v28a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V19a3 3 0 0 1 3-3Z"
      />
      {/* Front flap */}
      <path d="M3 28h54v24a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V28Z" />
    </svg>
  );
}
