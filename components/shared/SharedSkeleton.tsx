import { SHARED_GRID_COLS } from "./SharedFileRow";

export function SharedSkeleton() {
  return (
    <div>
      <div className="h-[28px] bg-grey-7" />
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className={`${SHARED_GRID_COLS} items-center border-b border-grey-6`}
        >
          <div className="flex items-center gap-[16px] py-[13px]">
            <div className="h-[31px] w-[31px] shrink-0 animate-pulse rounded-[4px] bg-grey-6" />
            <div className="h-[14px] w-48 animate-pulse rounded bg-grey-6" />
          </div>
          <div />
          <div className="mx-auto h-[14px] w-12 animate-pulse rounded bg-grey-6" />
          <div className="mx-auto h-[14px] w-20 animate-pulse rounded bg-grey-6" />
          <div />
        </div>
      ))}
    </div>
  );
}
