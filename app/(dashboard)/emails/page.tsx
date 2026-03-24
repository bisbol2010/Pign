"use client";

import { TopBar } from "@/components/layout/TopBar";
import { EmailListView } from "@/components/email/EmailList";
import { ComposeEmail } from "@/components/email/ComposeEmail";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Plus, CheckSquare, Archive, Star, Trash2 } from "lucide-react";

type Folder = "all" | "inbox" | "outbox" | "drafts";

export default function EmailsPage() {
  const [activeTab, setActiveTab] = useState<Folder>("all");
  const [showCompose, setShowCompose] = useState(false);

  const emails = useQuery(api.emails.list, {
    folder: activeTab === "all" ? undefined : activeTab,
  });

  const tabs: { id: Folder; label: string; dot?: boolean }[] = [
    { id: "all", label: "All" },
    { id: "inbox", label: "Inbox", dot: true },
    { id: "outbox", label: "Outbox" },
    { id: "drafts", label: "Drafts" },
  ];

  return (
    <>
      <TopBar title="Emails" />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm pb-1 transition-colors relative ${
                  activeTab === tab.id
                    ? "text-pign-black font-medium"
                    : "text-grey-3 hover:text-pign-black"
                }`}
              >
                {tab.label}
                {tab.dot && (
                  <span className="absolute -top-0.5 -right-2 w-1.5 h-1.5 bg-pign-black rounded-full" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCompose(true)}
              className="flex items-center gap-2 bg-pign-black text-white text-sm px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Plus size={14} />
              Create email
            </button>
            <div className="flex items-center gap-1 ml-2">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-grey-7 transition-colors">
                <CheckSquare size={16} className="text-grey-3" />
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-grey-7 transition-colors">
                <Archive size={16} className="text-grey-3" />
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-grey-7 transition-colors">
                <Star size={16} className="text-grey-3" />
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-grey-7 transition-colors">
                <Trash2 size={16} className="text-grey-3" />
              </button>
            </div>
          </div>
        </div>

        {emails === undefined ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-grey-5 border-t-pign-black rounded-full animate-spin" />
          </div>
        ) : (
          <EmailListView emails={emails} />
        )}
      </div>
      {showCompose && <ComposeEmail onClose={() => setShowCompose(false)} />}
    </>
  );
}
