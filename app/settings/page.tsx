"use client";

import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const tabs = [
  "Profile",
  "Data and privacy",
  "Security",
  "Email",
  "Notification",
];

export default function AccountSettingsPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Profile");
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");

  const displayName = user?.name ?? "User";
  const displayEmail = user?.email ?? "user@pign.com";

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-[210px] min-h-screen bg-white border-r border-grey-6 flex flex-col">
          <div className="p-6 pb-4">
            <Link href="/dashboard">
              <Image src="/pign-logo.svg" alt="Pign" width={70} height={30} />
            </Link>
          </div>
          <nav className="flex-1 px-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-grey-3 hover:text-pign-black transition-colors w-full"
            >
              <ArrowLeft size={16} />
              Back to files
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8 max-w-3xl">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-semibold text-pign-black">
              Account Settings
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-grey-6 flex items-center justify-center">
                <span className="text-sm font-medium text-grey-2">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-grey-3">{displayEmail}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-6 border-b border-grey-6 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm pb-3 border-b-2 transition-colors ${
                  activeTab === tab
                    ? "text-pign-black border-pign-black font-medium"
                    : "text-grey-3 border-transparent hover:text-pign-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Profile" && (
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-semibold mb-4">Basic</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-grey-6">
                    <span className="text-sm text-grey-3 w-24">Picture:</span>
                    <div className="flex-1 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-grey-6 flex items-center justify-center">
                        <span className="text-xl text-grey-3">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="text-sm text-pign-black hover:underline">
                        Choose
                      </button>
                      <button className="text-sm text-grey-4 hover:text-grey-2">
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-grey-6">
                    <span className="text-sm text-grey-3 w-24">Name:</span>
                    <div className="flex-1">
                      {isEditingName ? (
                        <input
                          type="text"
                          value={nameValue}
                          onChange={(e) => setNameValue(e.target.value)}
                          className="border border-grey-5 rounded px-2 py-1 text-sm font-medium focus:outline-none focus:border-pign-black"
                          autoFocus
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {displayName}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          if (isEditingName) {
                            setIsEditingName(false);
                          } else {
                            setNameValue(displayName);
                            setIsEditingName(true);
                          }
                        }}
                        className="text-sm text-pign-black hover:underline"
                      >
                        {isEditingName ? "Save" : "Edit"}
                      </button>
                      {isEditingName && (
                        <button
                          onClick={() => setIsEditingName(false)}
                          className="text-sm text-grey-4"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-grey-6">
                    <span className="text-sm text-grey-3 w-24">Email:</span>
                    <div className="flex-1">
                      <span className="text-sm font-medium">
                        {displayEmail}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button className="text-sm text-pign-black hover:underline">
                        Upgrade
                      </button>
                      <button className="text-sm text-pign-black hover:underline">
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-4">Preference</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-grey-6">
                    <span className="text-sm text-grey-3 w-40">Language</span>
                    <span className="text-sm font-medium flex-1">
                      English (United Kingdom)
                    </span>
                    <button className="text-sm text-pign-black hover:underline">
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-grey-6">
                    <span className="text-sm text-grey-3 w-40">
                      Date format
                    </span>
                    <span className="text-sm font-medium flex-1">
                      DD/MM/YYYY
                    </span>
                    <button className="text-sm text-pign-black hover:underline">
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-grey-6">
                    <span className="text-sm text-grey-3 w-40">
                      Automatic time zone
                    </span>
                    <span className="text-sm font-medium flex-1">
                      GMT+01:00 (Lagos Nigeria)
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-5 bg-pign-black rounded-full relative cursor-pointer">
                        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all" />
                      </div>
                      <span className="text-sm text-grey-3">On</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab !== "Profile" && (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-grey-3 text-sm">
                {activeTab} settings coming soon.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
