import { TEAM_GRID_COLS } from "./TeamRow";

export function TeamsTableHeader() {
  return (
    <div
      className={`h-[28px] bg-grey-7 text-[14px] text-grey-3 ${TEAM_GRID_COLS}`}
    >
      <span>NAME</span>
      <span className="text-center">SHARED</span>
      <span className="text-center">LAST UPLOADED</span>
      <span />
    </div>
  );
}
