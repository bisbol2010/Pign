import { TEAM_GRID_COLS } from "./TeamRow";

export function TeamsSkeleton() {
  return (
    <div>
      <div className="h-[28px] bg-grey-7" />
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className={`border-b border-grey-6 ${TEAM_GRID_COLS}`}
        >
          <div className="flex items-center gap-[16px] py-[13px]">
            <div className="h-[31px] w-[31px] shrink-0 animate-pulse rounded-[4px] bg-grey-6" />
            <div className="h-[14px] w-48 animate-pulse rounded bg-grey-6" />
          </div>
          <div className="mx-auto h-[24px] w-[24px] animate-pulse rounded bg-grey-6" />
          <div className="mx-auto h-[14px] w-20 animate-pulse rounded bg-grey-6" />
        </div>
      ))}
    </div>
  );
}
