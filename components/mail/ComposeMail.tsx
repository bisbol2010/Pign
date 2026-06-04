"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PlusIcon } from "@/components/icons";
import { cn, formatFileSize } from "@/lib/utils";
import { ArrowLeft, Link2, Paperclip, Send, X, Bold, Italic, List, ListOrdered } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import { MailHeader } from "./MailHeader";
import type { MailTab } from "./types";
import { EmailChipInput } from "@/components/ui/EmailChipInput";
import { useFileActionsContext } from "@/components/file-actions";

export function ComposeMail() {
  const { showToast } = useFileActionsContext();
  const router = useRouter();
  const documents = useQuery(api.documents.list);
  const send = useMutation(api.deliveries.send);
  const saveDraft = useMutation(api.deliveries.saveDraft);

  const [tab] = useState<MailTab>("inbox");
  const [emails, setEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [selectedDocIds, setSelectedDocIds] = useState<Id<"documents">[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkBar, setShowLinkBar] = useState(false);
  const [sending, setSending] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (type: "bold" | "italic" | "link" | "bullet" | "number") => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selection = el.value.substring(start, end);
    const before = el.value.substring(0, start);
    const after = el.value.substring(end);
    let inserted = "";

    switch (type) {
      case "bold":
        inserted = `**${selection || "bold text"}**`;
        break;
      case "italic":
        inserted = `_${selection || "italic text"}_`;
        break;
      case "link":
        inserted = `[${selection || "link text"}](https://)`;
        break;
      case "bullet":
        inserted = `\n- ${selection || "bullet item"}`;
        break;
      case "number":
        inserted = `\n1. ${selection || "list item"}`;
        break;
    }

    setBody(before + inserted + after);

    // Re-focus and set selection
    requestAnimationFrame(() => {
      el.focus();
      const newSelStart = start + inserted.length;
      el.setSelectionRange(newSelStart, newSelStart);
    });
  };

  const selectedDocs =
    documents?.filter((d) => selectedDocIds.includes(d._id)) ?? [];

  const toggleDoc = (id: Id<"documents">) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const insertLink = () => {
    if (!linkUrl.trim()) return;
    setBody((b) => `${b}${b ? " " : ""}${linkUrl.trim()}`);
    setLinkUrl("");
    setShowLinkBar(false);
  };

  const handleSend = async () => {
    if (emails.length === 0 || selectedDocIds.length < 1) {
      showToast({ message: "Add at least one recipient and select at least one document.", type: "error" });
      return;
    }
    setSending(true);
    try {
      let lastId: Awaited<ReturnType<typeof send>> | null = null;
      for (const recipientEmail of emails) {
        lastId = await send({
          recipientEmail,
          subject: subject.trim() || undefined,
          body: body.trim() || undefined,
          documentIds: selectedDocIds,
        });
      }
      showToast({ message: "Mail sent successfully", type: "success" });
      if (lastId) {
        router.push(`/emails/${lastId}`);
      } else {
        router.push("/emails");
      }
    } catch (e) {
      showToast({ message: e instanceof Error ? e.message : "Failed to send", type: "error" });
    } finally {
      setSending(false);
    }
  };

  const handleDraft = async () => {
    try {
      await saveDraft({
        recipientEmail: emails[0] || undefined,
        subject: subject.trim() || undefined,
        body: body.trim() || undefined,
        documentIds: selectedDocIds,
      });
      showToast({ message: "Draft saved successfully", type: "success" });
      router.push("/emails?tab=drafts");
    } catch {
      showToast({ message: "Failed to save draft", type: "error" });
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <MailHeader activeTab={tab} onTabChange={() => {}} showBack />

      <div className="mt-[16px] flex-1 overflow-y-auto border-t border-grey-6">
        <div className="block border-b border-grey-6 px-[30px] py-[20px]">
          <span className="text-[14px] text-grey-3 block mb-[8px]">Recipient(s)</span>
          <EmailChipInput
            emails={emails}
            onChange={setEmails}
            placeholder="colleague@pign.com"
          />
        </div>

        <div className="border-b border-grey-6 px-[30px] py-[16px]">
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="flex items-center gap-[10px] text-[14px] text-grey-3 transition-colors hover:text-pign-black"
          >
            <Paperclip size={24} strokeWidth={1.5} />
            Attach file
          </button>
          {selectedDocs.map((doc) => (
            <div
              key={doc._id}
              className="mt-[12px] flex h-[41px] max-w-[400px] items-center justify-between rounded-[2px] bg-grey-7 px-[12px]"
            >
              <span className="truncate text-[14px] text-pign-black">
                {doc.name}
              </span>
              <div className="flex items-center gap-[12px] shrink-0">
                <span className="text-[14px] text-pign-black">
                  {doc.fileSize != null ? formatFileSize(doc.fileSize) : "—"}
                </span>
                <button
                  type="button"
                  onClick={() => toggleDoc(doc._id)}
                  aria-label={`Remove ${doc.name}`}
                >
                  <X size={18} className="text-grey-3" />
                </button>
              </div>
            </div>
          ))}
          {showPicker && documents && (
            <div className="mt-3 max-h-[200px] overflow-y-auto rounded border border-grey-6 bg-white">
              {documents.map((doc) => (
                <button
                  key={doc._id}
                  type="button"
                  onClick={() => toggleDoc(doc._id)}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-left text-[14px] hover:bg-grey-7",
                    selectedDocIds.includes(doc._id) && "bg-grey-7 font-medium"
                  )}
                >
                  {doc.name}
                  {selectedDocIds.includes(doc._id) ? " ✓" : null}
                </button>
              ))}
            </div>
          )}
        </div>

        <label className="block border-b border-grey-6 px-[30px] py-[20px]">
          <span className="text-[14px] text-grey-3">Subject</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-[8px] w-full text-[16px] text-pign-black focus:outline-none"
            aria-label="Subject"
          />
        </label>

        <div className="relative px-[30px] py-[20px]">
          {showLinkBar && (
            <div className="absolute left-[30px] top-[8px] z-10 flex items-center gap-2 rounded bg-pign-black px-3 py-1.5">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://"
                className="w-[200px] bg-transparent text-[12px] text-white placeholder:text-grey-4 focus:outline-none"
                aria-label="Link URL"
              />
              <button
                type="button"
                onClick={insertLink}
                className="text-[12px] font-medium text-white"
              >
                Add
              </button>
            </div>
          )}
          <div className="flex items-center gap-[8px] mb-[12px] border-b border-grey-6 pb-[8px]">
            <button
              type="button"
              onClick={() => insertFormat("bold")}
              className="p-[6px] hover:bg-grey-6 rounded transition-colors text-pign-black"
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertFormat("italic")}
              className="p-[6px] hover:bg-grey-6 rounded transition-colors text-pign-black"
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertFormat("link")}
              className="p-[6px] hover:bg-grey-6 rounded transition-colors text-pign-black"
              title="Link"
            >
              <Link2 size={16} />
            </button>
            <div className="h-[16px] w-[1px] bg-grey-5" />
            <button
              type="button"
              onClick={() => insertFormat("bullet")}
              className="p-[6px] hover:bg-grey-6 rounded transition-colors text-pign-black"
              title="Bullet list"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => insertFormat("number")}
              className="p-[6px] hover:bg-grey-6 rounded transition-colors text-pign-black"
              title="Numbered list"
            >
              <ListOrdered size={16} />
            </button>
          </div>
          <span className="text-[14px] text-grey-3">Type message here</span>
          <textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            className="mt-[8px] w-full resize-none text-[18px] leading-normal text-pign-black focus:outline-none"
            aria-label="Message body"
          />
        </div>
      </div>

      <div className="flex items-center gap-[16px] border-t border-grey-6 px-[30px] py-[16px]">
        <div className="flex overflow-hidden rounded-[2px]">
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={sending}
            className="flex h-[41px] items-center gap-[10px] bg-pign-black px-[16px] text-[18px] font-medium text-white disabled:opacity-50"
          >
            <Send size={24} strokeWidth={1.5} />
            {sending ? "Sending…" : "Send"}
          </button>
          <button
            type="button"
            className="flex h-[41px] w-[38px] items-center justify-center bg-grey-6 text-pign-black"
            aria-label="Send options"
          >
            <PlusIcon size={18} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowLinkBar(!showLinkBar)}
          className={cn(
            "flex size-[24px] items-center justify-center rounded",
            showLinkBar && "bg-grey-7"
          )}
          aria-label="Insert link"
        >
          <Link2 size={24} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={() => void handleDraft()}
          className="ml-auto text-[14px] text-grey-3 hover:text-pign-black"
        >
          Save draft
        </button>
        <Link
          href="/emails"
          className="flex size-[24px] items-center justify-center text-grey-3 hover:text-pign-black"
          aria-label="Cancel"
        >
          <ArrowLeft size={24} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
