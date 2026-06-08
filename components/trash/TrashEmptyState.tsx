import { TrashDuotone } from "@/components/illustrations/TrashDuotone";
import { TrashTableHeader } from "./TrashTableHeader";
import type { TrashTab } from "./types";

type TrashEmptyStateProps = {
  tab: TrashTab;
};

export function TrashEmptyState({ tab }: TrashEmptyStateProps) {
  const message =
    tab === "files"
      ? "No trashed files"
      : tab === "folders"
        ? "No trashed folders"
        : "Trash is empty";

  return (
    <>
      <TrashTableHeader showType={tab === "all"} />
      <div className="flex flex-col items-center justify-center px-[30px] py-[80px]">
        <TrashDuotone className="mb-[24px] h-[64px] w-[64px] text-grey-4 [--illus-surface:white]" />
        <p className="text-[18px] font-medium text-pign-black/90">{message}</p>
        <p className="mt-[8px] text-[14px] text-grey-4">
          Deleted items will appear here for 30 days.
        </p>
      </div>
    </>
  );
}
