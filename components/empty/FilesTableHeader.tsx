import { FILE_GRID_COLS } from "@/components/files/FileRow";

/** Column header row shown above an empty files list (Figma `Empty files` 2390:2350). */
export function FilesTableHeader() {
  return (
    <div
      className={`h-[28px] bg-grey-7 text-[14px] text-grey-3 ${FILE_GRID_COLS}`}
    >
      <span>NAME</span>
      <span className="text-center">SHARED</span>
      <span className="text-center">VERIFIED</span>
      <span className="text-center">SIZE</span>
      <span className="text-center">LAST UPLOADED</span>
      <span />
    </div>
  );
}
