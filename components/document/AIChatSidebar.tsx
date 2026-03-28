"use client";

import { useState, useRef, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChatSidebar({
  documentId,
  documentName,
}: {
  documentId: Id<"documents">;
  documentName: string;
}) {
  const knowledge = useQuery(api.knowledge.listByDocument, { documentId });
  const chat = useAction(api.ai.chat);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await chat({
        message: userMessage,
        documentName,
        knowledgeContext: knowledge?.map((k) => k.content) ?? [],
        conversationHistory: newMessages.slice(-10).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-80 border-l border-grey-6 bg-white flex flex-col h-full">
      <div className="p-4 border-b border-grey-6">
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-grey-3" />
          <h3 className="text-sm font-medium">Pign AI</h3>
        </div>
        <p className="text-xs text-grey-4 mt-1">
          Ask questions about this document.
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3" aria-live="polite">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot size={32} className="text-grey-5 mx-auto mb-3" />
            <p className="text-sm text-grey-3 mb-1">How can I help?</p>
            <p className="text-xs text-grey-4">
              Ask me anything about your document.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-pign-black flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={12} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-pign-black text-white"
                  : "bg-grey-7 text-grey-2"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-full bg-grey-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={12} className="text-grey-3" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-pign-black flex items-center justify-center flex-shrink-0">
              <Bot size={12} className="text-white" />
            </div>
            <div className="bg-grey-7 rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-grey-4 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-grey-4 animate-bounce [animation-delay:0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-grey-4 animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-grey-6">
        <div className="flex items-center gap-2 bg-grey-7 rounded-lg px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Pign AI..."
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-grey-4"
            disabled={isLoading}
            aria-label="Ask Pign AI"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="text-grey-3 hover:text-pign-black disabled:opacity-30 transition-colors"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
