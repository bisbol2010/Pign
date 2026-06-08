import { FileGlyphIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/** Derives a short type label (e.g. PDF, DOC, IMG) from a filename + mime. */
export function fileTypeLabel(name: string, fileType?: string): string | null {
  const ext = name.includes(".")
    ? name.slice(name.lastIndexOf(".") + 1).toLowerCase()
    : "";
  if (ext) {
    if (["jpg", "jpeg", "png", "gif", "webp", "svg", "heic"].includes(ext))
      return "IMG";
    if (ext === "pdf") return "PDF";
    if (["doc", "docx"].includes(ext)) return "DOC";
    if (["xls", "xlsx", "csv"].includes(ext)) return "XLS";
    if (["ppt", "pptx"].includes(ext)) return "PPT";
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "ZIP";
    if (["txt", "md", "rtf"].includes(ext)) return "TXT";
    if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) return "VID";
    if (["mp3", "wav", "ogg", "m4a"].includes(ext)) return "AUD";
    return ext.slice(0, 4).toUpperCase();
  }
  if (fileType?.startsWith("image/")) return "IMG";
  if (fileType === "application/pdf") return "PDF";
  if (fileType?.startsWith("video/")) return "VID";
  if (fileType?.startsWith("audio/")) return "AUD";
  return null;
}

/** Branded fallback glyph for non-previewable files, with a type badge. */
export function FileTypeGlyph({
  name,
  fileType,
  size = 31,
  className,
}: {
  name: string;
  fileType?: string;
  size?: number;
  className?: string;
}) {
  const label = fileTypeLabel(name, fileType);
  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <FileGlyphIcon size={size} className="text-grey-3" />
      {label ? (
        <span
          className="absolute inset-x-0 bottom-[2px] text-center font-semibold leading-none text-pign-black"
          style={{ fontSize: Math.max(7, Math.round(size * 0.26)) }}
        >
          {label}
        </span>
      ) : null}
    </span>
  );
}
