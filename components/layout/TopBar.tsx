"use client";

import { Search, HelpCircle, Bell, ChevronDown, Settings, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export function TopBar({ title }: { title: string }) {
  const user = useCurrentUser();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);

  const searchResults = useQuery(api.documents.search, {
    query: searchQuery,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const isUserLoading = user === undefined;
  const displayName = user?.name ?? (isUserLoading ? "" : "User");
  const displayEmail = user?.email ?? (isUserLoading ? "" : "");
  const initial = displayName.charAt(0).toUpperCase() || "·";

  return (
    <header className="h-16 border-b border-grey-6 bg-white flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-pign-black">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-4"
          />
          <input
            type="text"
            placeholder="Search file or folder"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-grey-7 rounded-lg text-sm w-64 focus:outline-none focus:ring-1 focus:ring-grey-4 placeholder:text-grey-4"
            aria-label="Search file or folder"
          />
          {searchQuery && searchResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-lg border border-grey-6 z-50 max-h-64 overflow-y-auto">
              {searchResults.map((doc) => (
                <Link
                  key={doc._id}
                  href={`/document/${doc._id}`}
                  className="block px-4 py-2.5 text-sm hover:bg-grey-7 transition-colors"
                  onClick={() => setSearchQuery("")}
                >
                  {doc.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <button className="w-9 h-9 rounded-full bg-pign-black text-white flex items-center justify-center" aria-label="Help">
          <HelpCircle size={16} />
        </button>

        <button className="relative w-9 h-9 rounded-full bg-grey-7 flex items-center justify-center" aria-label="Notifications">
          <Bell size={16} className="text-pign-black" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pign-black text-white text-[9px] rounded-full flex items-center justify-center">
            1
          </span>
        </button>

        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="Profile menu"
            aria-expanded={showProfile}
            aria-haspopup="true"
          >
            <div className="w-9 h-9 rounded-full bg-grey-6 flex items-center justify-center">
              <span
                className={`text-sm font-medium text-grey-2 ${isUserLoading ? "animate-pulse" : ""}`}
              >
                {initial}
              </span>
            </div>
            <div className="text-left hidden sm:block min-w-[7rem]">
              {isUserLoading ? (
                <>
                  <div className="h-3 w-20 bg-grey-6 rounded animate-pulse mb-1" />
                  <div className="h-2.5 w-24 bg-grey-7 rounded animate-pulse" />
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-pign-black leading-tight">
                    {displayName}
                  </p>
                  <p className="text-xs text-grey-3">{displayEmail}</p>
                </>
              )}
            </div>
            <ChevronDown size={14} className="text-grey-3" aria-hidden />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-grey-6 z-50 py-2">
              <div className="px-4 py-3 border-b border-grey-6">
                <div className="w-12 h-12 rounded-full bg-grey-6 flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-medium text-grey-2">
                    {initial}
                  </span>
                </div>
                <p className="text-sm font-medium text-center">
                  {isUserLoading ? "…" : displayName}
                </p>
                <p className="text-xs text-grey-3 text-center">
                  {isUserLoading ? "" : displayEmail}
                </p>
              </div>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-grey-2 hover:bg-grey-7 transition-colors"
                onClick={() => setShowProfile(false)}
              >
                <Settings size={15} />
                Account Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-grey-2 hover:bg-grey-7 transition-colors w-full"
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
