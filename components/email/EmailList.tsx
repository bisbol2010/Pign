"use client";

import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";

function groupByTime(emails: Doc<"emails">[]) {
  const now = Date.now();
  const day = 86400000;
  const groups: { label: string; items: Doc<"emails">[] }[] = [];
  const today: Doc<"emails">[] = [];
  const thisWeek: Doc<"emails">[] = [];
  const thisMonth: Doc<"emails">[] = [];
  const older: Doc<"emails">[] = [];

  for (const email of emails) {
    const diff = now - email._creationTime;
    if (diff < day) today.push(email);
    else if (diff < day * 7) thisWeek.push(email);
    else if (diff < day * 30) thisMonth.push(email);
    else older.push(email);
  }

  if (today.length) groups.push({ label: "Today", items: today });
  if (thisWeek.length) groups.push({ label: "This week", items: thisWeek });
  if (thisMonth.length) groups.push({ label: "This month", items: thisMonth });
  if (older.length) groups.push({ label: "Older", items: older });
  return groups;
}

export function EmailListView({ emails }: { emails: Doc<"emails">[] }) {
  const groups = groupByTime(emails);

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-grey-3">No emails yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.label}>
          <h3 className="text-xs font-medium text-grey-3 uppercase tracking-wider mb-2 px-1">
            {group.label}
          </h3>
          <div className="bg-white rounded-lg border border-grey-6">
            {group.items.map((email) => (
              <Link
                key={email._id}
                href={`/emails/${email._id}`}
                className="flex items-center gap-4 px-4 py-3 hover:bg-grey-7 transition-colors border-b border-grey-6 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-grey-6 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-grey-2">
                    {(email.fromAddress || email.toAddress)
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm ${!email.isRead ? "font-semibold text-pign-black" : "text-grey-2"}`}
                    >
                      {email.folder === "outbox"
                        ? email.toAddress
                        : email.fromAddress}
                    </span>
                  </div>
                  <p className="text-xs text-grey-3 truncate mt-0.5">
                    {email.subject ? `${email.subject} — ` : ""}
                    {email.body}
                  </p>
                </div>
                <span className="text-xs text-grey-4 flex-shrink-0">
                  {new Date(email._creationTime).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
