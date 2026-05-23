"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FileText,
  Users,
  Mail,
  Share2,
  Trash2,
  Plus,
  Upload,
  HardDrive,
} from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import { useStorageUsage } from "@/hooks/useStorageUsage";
import { useRef, useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const navItems = [
  { label: "All files", href: "/dashboard", icon: FileText },
  { label: "Teams", href: "/teams", icon: Users },
  { label: "Emails", href: "/emails", icon: Mail, badge: "99+" },
  { label: "Shared", href: "/shared", icon: Share2 },
  { label: "Trash", href: "/trash", icon: Trash2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { used, total, isLoading: storageLoading } = useStorageUsage();
  const fileInput = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const createDocument = useMutation(api.documents.create);

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      try {
        for (const file of Array.from(files)) {
          const postUrl = await generateUploadUrl();
          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });
          const { storageId } = await result.json();
          await createDocument({
            name: file.name,
            fileId: storageId,
            fileType: file.type,
            fileSize: file.size,
          });
        }
      } catch {
        alert("Upload failed. Please try again.");
      }
    },
    [generateUploadUrl, createDocument]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleUpload(e.dataTransfer.files);
    },
    [handleUpload]
  );

  const usedPercent = total > 0 ? (used / total) * 100 : 0;

  return (
    <aside className="w-[210px] min-h-screen bg-white border-r border-grey-6 flex flex-col">
      <div className="p-6 pb-4">
        <Link href="/dashboard">
          <Image src="/pign-logo.svg" alt="Pign" width={70} height={30} />
        </Link>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 relative",
                isActive
                  ? "text-pign-black font-medium bg-grey-7"
                  : "text-grey-3 hover:text-pign-black hover:bg-grey-7"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-pign-black rounded-r" />
              )}
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-pign-black text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-2">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-3 transition-colors",
            isDragging ? "border-pign-black bg-grey-7" : "border-grey-5"
          )}
        >
          <div className="w-10 h-10 rounded-full bg-grey-7 flex items-center justify-center">
            <Plus size={20} className="text-grey-3" />
          </div>
          <p className="text-xs text-grey-3 text-center leading-relaxed">
            Drag and drop your documents and images here
          </p>
          <input
            ref={fileInput}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <button
            onClick={() => fileInput.current?.click()}
            className="w-full bg-pign-black text-white text-sm py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Upload size={14} />
            Upload
          </button>
        </div>
      </div>

      <div className="px-4 py-4 border-t border-grey-6">
        <div className="flex items-center gap-2 text-sm text-grey-3 mb-2">
          <HardDrive size={16} aria-hidden />
          <span>Storage</span>
        </div>
        <div
          className="w-full bg-grey-6 rounded-full h-1.5 mb-1"
          role="progressbar"
          aria-label="Storage used"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={storageLoading ? undefined : Math.round(usedPercent)}
        >
          <div
            className={cn(
              "bg-pign-black h-1.5 rounded-full transition-all",
              storageLoading && "animate-pulse"
            )}
            style={{ width: `${Math.min(usedPercent, 100)}%` }}
          />
        </div>
        <p className="text-xs text-grey-4">
          {storageLoading ? "…" : formatFileSize(used)} of{" "}
          {formatFileSize(total)} used
        </p>
      </div>
    </aside>
  );
}
