import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + sizes[i];
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function timeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(timestamp);
}

export function getFileIcon(fileType?: string): string {
  if (!fileType) return "file";
  if (fileType.startsWith("image/")) return "image";
  if (fileType === "application/pdf") return "file-text";
  if (
    fileType.includes("word") ||
    fileType.includes("document") ||
    fileType === "application/msword"
  )
    return "file-text";
  if (fileType.includes("presentation") || fileType.includes("powerpoint"))
    return "presentation";
  if (fileType.includes("spreadsheet") || fileType.includes("excel"))
    return "sheet";
  if (fileType.startsWith("text/")) return "file-text";
  return "file";
}
