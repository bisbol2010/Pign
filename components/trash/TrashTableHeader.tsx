/** Trash list grid — NAME, optional TYPE, SIZE, LAST UPLOADED, actions. */
export const TRASH_GRID_ALL =
  "grid grid-cols-[1fr_96px_96px_130px_40px] items-center pl-[30px] pr-[35px]";

export const TRASH_GRID_FILTERED =
  "grid grid-cols-[1fr_96px_130px_40px] items-center pl-[30px] pr-[35px]";

type TrashTableHeaderProps = {
  showType?: boolean;
};

export function TrashTableHeader({ showType = false }: TrashTableHeaderProps) {
  const cols = showType ? TRASH_GRID_ALL : TRASH_GRID_FILTERED;

  return (
    <div className={`h-[28px] bg-grey-7 text-[14px] text-grey-3 ${cols}`}>
      <span>NAME</span>
      {showType ? <span className="text-center">TYPE</span> : null}
      <span className="text-center">SIZE</span>
      <span className="text-center">LAST UPLOADED</span>
      <span />
    </div>
  );
}
