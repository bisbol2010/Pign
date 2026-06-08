import { TrashRow } from "./TrashRow";
import { TrashTableHeader } from "./TrashTableHeader";
import type { TrashRowItem, TrashSelection } from "./types";

type TrashFileListProps = {
  rows: TrashRowItem[];
  showType?: boolean;
  selected: TrashSelection;
  onSelect: (selection: TrashSelection) => void;
  onOpenMenu: (anchor: { x: number; y: number }) => void;
};

export function TrashFileList({
  rows,
  showType = false,
  selected,
  onSelect,
  onOpenMenu,
}: TrashFileListProps) {
  return (
    <>
      <TrashTableHeader showType={showType} />
      {rows.map((row) => {
        const rowSelected =
          selected?.kind === row.kind && selected.id === row.item._id;
        return (
          <TrashRow
            key={`${row.kind}-${row.item._id}`}
            row={row}
            showType={showType}
            selected={rowSelected}
            onSelect={onSelect}
            onOpenMenu={onOpenMenu}
          />
        );
      })}
    </>
  );
}
