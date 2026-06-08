/**
 * Hero grid backdrop — mirrors the layered vertical+horizontal column rules
 * from Figma node 1234:1600 (Group 110 / Group 111 stacks). We render the
 * pattern in pure CSS rather than blitting hundreds of `<line>` elements.
 *
 * Vertical rules at 56px intervals (matching Figma's ~56px column unit)
 * and horizontal rules at 56px intervals (rotated grid pattern, Group 111).
 * Bolder rule every 7 columns to imitate Figma's accent grid.
 */
export function GridBackdrop({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={
        {
          "--col": "56px",
          "--grid-line": "rgba(255,255,255,0.045)",
          "--grid-bold": "rgba(255,255,255,0.08)",
        } as React.CSSProperties
      }
    >
      {/* Vertical columns (Group 110) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "var(--col) 100%",
        }}
      />
      {/* Horizontal rows (Group 111 — rotated 90°) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "100% var(--col)",
        }}
      />
      {/* Accent rules every 7 columns / rows */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--grid-bold) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-bold) 1px, transparent 1px)",
          backgroundSize:
            "calc(var(--col) * 7) 100%, 100% calc(var(--col) * 7)",
        }}
      />
      {/* Centre vignette to focus attention (mimics Rectangle 724 overlay) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 35%, rgba(255,255,255,0.05) 0%, transparent 65%)",
        }}
      />
    </div>
  );
}
