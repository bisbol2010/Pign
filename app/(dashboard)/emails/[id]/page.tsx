"use client";

import { TopBar } from "@/components/layout/TopBar";
import { EmailDetailView } from "@/components/email/EmailView";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect } from "react";

export default function EmailPage() {
  const params = useParams();
  const emailId = params.id as Id<"emails">;
  const email = useQuery(api.emails.getById, { id: emailId });
  const markRead = useMutation(api.emails.markRead);

  useEffect(() => {
    if (email && !email.isRead) {
      markRead({ id: emailId });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email?._id]);

  return (
    <>
      <TopBar title="Emails" />
      <div className="flex-1 p-6 overflow-y-auto">
        {!email ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-grey-5 border-t-pign-black rounded-full animate-spin" />
          </div>
        ) : (
          <EmailDetailView email={email} />
        )}
      </div>
    </>
  );
}
