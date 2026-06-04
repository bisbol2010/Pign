"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn, formatFileSize } from "@/lib/utils";
import { useStorageUsage } from "@/hooks/useStorageUsage";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  FilesIcon,
  TeamsIcon,
  VerificationIcon,
  EmailsIcon,
  SharedIcon,
  TrashIcon,
  StorageIcon,
} from "@/components/icons";
import { SidebarUploadZone } from "@/components/upload";

type NavItem = {
  label: string;
  href: string;
  Icon: typeof FilesIcon;
  badge?: string;
};

const baseNavItems: NavItem[] = [
  { label: "All files", href: "/dashboard", Icon: FilesIcon },
  { label: "Teams", href: "/teams", Icon: TeamsIcon },
  { label: "Verification", href: "/verification", Icon: VerificationIcon },
  { label: "Emails", href: "/emails", Icon: EmailsIcon },
  { label: "Shared", href: "/shared", Icon: SharedIcon },
  { label: "Trash", href: "/trash", Icon: TrashIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { open, closeSidebar } = useSidebar();
  const { used, total, isLoading: storageLoading } = useStorageUsage();
  const unreadMail = useQuery(api.deliveries.unreadCount);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  // Close the mobile drawer on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeSidebar]);
  const mailBadge =
    unreadMail === undefined
      ? undefined
      : unreadMail > 99
        ? "99+"
        : unreadMail > 0
          ? String(unreadMail)
          : undefined;

  const navItems: NavItem[] = baseNavItems.map((item) =>
    item.href === "/emails" ? { ...item, badge: mailBadge } : item
  );

  const usedPercent = total > 0 ? (used / total) * 100 : 0;

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-pign-black/40 lg:hidden"
          aria-hidden="true"
          onClick={closeSidebar}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex min-h-screen w-[300px] shrink-0 flex-col border-r border-grey-6 bg-white transition-transform duration-200",
          "lg:static lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
      {/* Logo */}
      <div className="pb-[36px] pl-[44px] pt-[54px]">
        <Link href="/dashboard" aria-label="Pign home" className="inline-block">
          <Image
            src="/pign-logo.svg"
            alt="Pign"
            width={107}
            height={46}
            priority
            className="h-auto w-[107px]"
          />
        </Link>
      </div>

      {/* Primary navigation */}
      <nav className="flex flex-col gap-[4px] pl-[21px] pr-[25px]">
        {navItems.map(({ label, href, Icon, badge }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex h-[60px] items-center pl-[23px] pr-[16px] transition-colors",
                isActive ? "bg-grey-7" : "hover:bg-grey-7"
              )}
            >
              <Icon
                size={24}
                className={isActive ? "text-pign-black" : "text-grey-4"}
              />
              <span
                className={cn(
                  "ml-[15px] text-[16px]",
                  isActive
                    ? "font-medium text-pign-black"
                    : "text-grey-3"
                )}
              >
                {label}
              </span>
              {badge && (
                <span className="ml-auto inline-flex h-[24px] items-center justify-center rounded-full bg-pign-black px-[7px] text-[10px] font-medium leading-none text-white">
                  {badge}
                </span>
              )}
              {isActive && (
                <span className="absolute right-0 top-0 h-full w-[7px] bg-pign-black" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mt-[16px] h-px w-full bg-grey-6" />

      <SidebarUploadZone />

      {/* Storage meter (pinned to bottom) */}
      <div className="mt-auto pb-[44px] pl-[44px] pr-[25px] pt-[32px]">
        <div className="flex items-center gap-[14px]">
          <StorageIcon size={24} className="text-pign-black" />
          <span className="text-[16px] text-grey-2">Storage</span>
        </div>
        <div
          className="mt-[20px] h-[3px] w-full overflow-hidden bg-grey-6"
          role="progressbar"
          aria-label="Storage used"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={storageLoading ? undefined : Math.round(usedPercent)}
        >
          <div
            className={cn(
              "h-full bg-pign-black transition-all",
              storageLoading && "animate-pulse"
            )}
            style={{ width: `${Math.min(usedPercent, 100)}%` }}
          />
        </div>
        <p className="mt-[7px] text-[14px] text-grey-3">
          {storageLoading ? "…" : formatFileSize(used)} of{" "}
          {formatFileSize(total)} used
        </p>
      </div>
      </aside>
    </>
  );
}
