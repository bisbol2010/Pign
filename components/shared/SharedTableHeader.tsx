import { SHARED_GRID_COLS } from "./SharedFileRow";

/** Column header for shared file list (Figma `Shared` 359:3154 — no SHARED column). */
export function SharedTableHeader() {
  return (
    <div
      className={`h-[28px] bg-grey-7 text-[14px] text-grey-3 ${SHARED_GRID_COLS}`}
    >
      <span>NAME</span>
      <span className="text-center">VERIFIED</span>
      <span className="text-center">SIZE</span>
      <span className="text-center">LAST UPLOADED</span>
      <span />
    </div>
  );
}
