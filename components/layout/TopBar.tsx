"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  SearchIcon,
  HelpIcon,
  BellIcon,
  AccountIcon,
  ChevronDownIcon,
} from "@/components/icons";
import { NotificationDropdown } from "@/components/notifications";
import type { NotificationRow } from "@/components/notifications";
import { useSidebar } from "@/components/layout/SidebarContext";
import { Settings, LogOut, Menu } from "lucide-react";

function formatBadgeCount(count: number) {
  if (count > 99) return "99+";
  return String(count);
}

type TopBarProps = {
  title: string;
  /** When on `/search`, keeps the pill in sync with `?q=`. */
  searchQuery?: string;
};

export function TopBar({ title, searchQuery: searchQueryProp }: TopBarProps) {
  const user = useCurrentUser();
  const { signOut } = useAuthActions();
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    isSearchPage ? (searchQueryProp ?? "") : ""
  );
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSearchPage) {
      setSearchQuery(searchQueryProp ?? "");
    }
  }, [isSearchPage, searchQueryProp]);

  const trimmedQuery = searchQuery.trim();
  const quickSearch = useQuery(
    api.search.run,
    trimmedQuery && !isSearchPage
      ? { query: trimmedQuery, limit: 5 }
      : "skip"
  );

  const unreadCount = useQuery(api.notifications.unreadCount);
  const recentNotifications = useQuery(api.notifications.list, { limit: 5 });
  const markRead = useMutation(api.notifications.markRead);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const handleOpenNotification = useCallback(
    async (notification: NotificationRow) => {
      if (!notification.isRead) {
        try {
          await markRead({ id: notification._id });
        } catch {
          // Non-blocking: the badge will reconcile on the next query refresh.
        }
      }
      setShowNotifications(false);
    },
    [markRead]
  );

  const navigateToSearch = useCallback(() => {
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }, [router, searchQuery]);

  const quickHits = quickSearch
    ? [
        ...quickSearch.files.map((f) => ({
          key: f._id,
          href: `/document/${f._id}`,
          label: f.name,
          kind: "files" as const,
        })),
        ...quickSearch.folders.map((f) => ({
          key: f._id,
          href: `/dashboard/folders/${f._id}`,
          label: f.name,
          kind: "folders" as const,
        })),
        ...quickSearch.emails.map((e) => ({
          key: e._id,
          href: `/emails/${e._id}`,
          label:
            e.subject?.trim() ||
            e.body?.slice(0, 48) ||
            e.recipientEmail ||
            "(no subject)",
          kind: "emails" as const,
        })),
      ].slice(0, 5)
    : [];

  const isUserLoading = user === undefined;
  const displayName = user?.name ?? (isUserLoading ? "" : "User");
  const displayEmail = user?.email ?? (isUserLoading ? "" : "");
  const badgeCount = unreadCount ?? 0;

  return (
    <header className="flex h-[88px] shrink-0 items-center gap-[8px] border-b border-grey-6 bg-white pr-[16px] sm:pr-[35px]">
      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Open menu"
        className="ml-[16px] flex h-[44px] w-[44px] shrink-0 items-center justify-center bg-grey-7 text-pign-black transition-colors hover:bg-grey-6 lg:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Page title */}
      <div className="w-[285px] min-w-0 shrink pl-[14px] lg:pl-[30px]">
        <h1 className="truncate text-[20px] font-medium text-pign-black sm:text-[24px]">{title}</h1>
      </div>

      {/* Search */}
      <div className="relative hidden w-[346px] min-w-[120px] shrink md:block">
        <SearchIcon
          size={24}
          className="pointer-events-none absolute left-[17px] top-1/2 -translate-y-1/2 text-pign-black"
        />
        <input
          type="search"
          placeholder="Search file or folder"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              navigateToSearch();
            }
          }}
          aria-label="Search file or folder"
          className="h-[46px] w-full bg-grey-7 pl-[50px] pr-4 text-[14px] text-pign-black placeholder:text-grey-4 focus:outline-none focus:ring-1 focus:ring-grey-5"
        />
        {trimmedQuery && !isSearchPage && quickHits.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto border border-grey-6 bg-white py-1 shadow-[0px_4px_7px_0px_rgba(179,179,179,0.3)]">
            {quickHits.map((hit) => (
              <Link
                key={hit.key}
                href={hit.href}
                className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-grey-7"
                onClick={() => setSearchQuery("")}
              >
                <span className="truncate text-pign-black">{hit.label}</span>
                <span className="shrink-0 text-[14px] capitalize text-grey-4">
                  {hit.kind}
                </span>
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                navigateToSearch();
                setSearchQuery(trimmedQuery);
              }}
              className="w-full border-t border-grey-6 px-4 py-2.5 text-left text-[14px] text-grey-2 transition-colors hover:bg-grey-7 hover:text-pign-black"
            >
              View all results
            </button>
          </div>
        )}
      </div>

      {/* Right cluster */}
      <div className="ml-auto flex min-w-0 shrink-0 items-center gap-[12px]">
        <Link
          href="/help"
          className="hidden h-[46px] w-[48px] items-center justify-center bg-grey-7 text-pign-black transition-colors hover:bg-grey-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pign-black sm:flex"
          aria-label="Help"
        >
          <HelpIcon size={24} />
        </Link>

        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications((open) => !open);
              setShowProfile(false);
            }}
            className="relative flex h-[46px] w-[48px] items-center justify-center bg-grey-7 text-pign-black transition-colors hover:bg-grey-6"
            aria-label="Notifications"
            aria-expanded={showNotifications}
            aria-haspopup="true"
          >
            <BellIcon size={24} />
            {badgeCount > 0 ? (
              <span className="absolute right-[8px] top-[6px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-pign-black px-[3px] text-[10px] font-medium leading-none text-white">
                {formatBadgeCount(badgeCount)}
              </span>
            ) : null}
          </button>

          {showNotifications ? (
            <NotificationDropdown
              notifications={recentNotifications ?? []}
              loading={recentNotifications === undefined}
              onClose={() => setShowNotifications(false)}
              onOpenNotification={handleOpenNotification}
            />
          ) : null}
        </div>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex h-[46px] w-[46px] min-w-0 items-center justify-center gap-[9px] bg-grey-7 transition-colors hover:bg-grey-6 sm:w-[224px] sm:max-w-[224px] sm:justify-start sm:pl-[8px] sm:pr-[9px]"
            aria-label="Profile menu"
            aria-expanded={showProfile}
            aria-haspopup="true"
          >
            <AccountIcon size={24} className="shrink-0 text-pign-black" />
            <div className="hidden min-w-0 flex-1 text-left sm:block">
              {isUserLoading ? (
                <>
                  <div className="mb-1 h-3 w-20 animate-pulse rounded bg-grey-6" />
                  <div className="h-2.5 w-24 animate-pulse rounded bg-grey-6" />
                </>
              ) : (
                <>
                  <p className="truncate text-[16px] font-medium leading-tight text-pign-black">
                    {displayName}
                  </p>
                  <p className="truncate text-[14px] leading-tight text-grey-2">
                    {displayEmail}
                  </p>
                </>
              )}
            </div>
            <ChevronDownIcon
              size={24}
              className="hidden shrink-0 text-pign-black opacity-80 sm:block"
            />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 border border-grey-6 bg-white py-2 shadow-lg">
              <div className="border-b border-grey-6 px-4 py-3 text-center">
                <AccountIcon size={40} className="mx-auto mb-2 text-grey-3" />
                <p className="text-sm font-medium">
                  {isUserLoading ? "…" : displayName}
                </p>
                <p className="text-xs text-grey-3">
                  {isUserLoading ? "" : displayEmail}
                </p>
              </div>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-grey-2 transition-colors hover:bg-grey-7"
                onClick={() => setShowProfile(false)}
              >
                <Settings size={15} />
                Account Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-grey-2 transition-colors hover:bg-grey-7"
              >
                <LogOut size={15} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
