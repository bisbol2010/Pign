"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import OpenAI from "openai";

export const chat = action({
  args: {
    message: v.string(),
    documentName: v.optional(v.string()),
    knowledgeContext: v.optional(v.array(v.string())),
    conversationHistory: v.optional(
      v.array(
        v.object({
          role: v.union(v.literal("user"), v.literal("assistant")),
          content: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args): Promise<string> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

    const openai = new OpenAI({ apiKey });
    const systemParts = [
      "You are Pign AI, an intelligent assistant that helps users understand and manage their documents.",
      "You help find information within documents, answer questions about document contents, and provide insights.",
    ];
    if (args.documentName) {
      systemParts.push(
        `The user is currently viewing a document called "${args.documentName}".`
      );
    }
    if (args.knowledgeContext && args.knowledgeContext.length > 0) {
      systemParts.push(
        "The following knowledge has been added as context for this document:"
      );
      args.knowledgeContext.forEach((k, i) => {
        systemParts.push(`Knowledge ${i + 1}: ${k}`);
      });
    }

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemParts.join("\n\n") },
    ];
    if (args.conversationHistory) {
      for (const msg of args.conversationHistory) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }
    messages.push({ role: "user", content: args.message });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        max_tokens: 1024,
      });
      return response.choices[0]?.message?.content ?? "I couldn't generate a response.";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      throw new Error(`AI request failed: ${message}`);
    }
  },
});
