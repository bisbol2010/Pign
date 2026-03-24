"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { X } from "lucide-react";

export function ComposeEmail({ onClose }: { onClose: () => void }) {
  const sendEmail = useMutation(api.emails.send);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!to.trim() || !body.trim()) return;
    setSending(true);
    try {
      await sendEmail({
        toAddress: to.trim(),
        subject: subject.trim() || undefined,
        body: body.trim(),
      });
      onClose();
    } catch {
      alert("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-xl mx-4 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-grey-6">
          <h3 className="text-sm font-medium">New Email</h3>
          <button onClick={onClose}>
            <X size={18} className="text-grey-3" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To"
            className="w-full border border-grey-5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pign-black"
          />
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full border border-grey-5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pign-black"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message..."
            rows={8}
            className="w-full border border-grey-5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pign-black resize-none"
          />
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-grey-6">
          <button
            onClick={onClose}
            className="text-sm text-grey-3 px-4 py-2 hover:text-pign-black transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!to.trim() || !body.trim() || sending}
            className="bg-pign-black text-white text-sm px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
