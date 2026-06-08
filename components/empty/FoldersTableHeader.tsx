import { FOLDER_GRID_COLS } from "@/components/folders/FolderRow";

/** Column header row shown above an empty folders list (Figma `Empty folder` 2390:2584). */
export function FoldersTableHeader() {
  return (
    <div
      className={`h-[28px] bg-grey-7 text-[14px] text-grey-3 ${FOLDER_GRID_COLS}`}
    >
      <span>NAME</span>
      <span className="text-center">SHARED</span>
      <span className="text-center">VERIFIED</span>
      <span className="text-center">SIZE</span>
      <span className="text-center">LAST UPLOADED</span>
    </div>
  );
}
