import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    folder: v.optional(
      v.union(
        v.literal("inbox"),
        v.literal("outbox"),
        v.literal("drafts")
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    if (args.folder) {
      return await ctx.db
        .query("emails")
        .withIndex("by_user_folder", (q) =>
          q.eq("userId", userId).eq("folder", args.folder!)
        )
        .order("desc")
        .collect();
    }
    const all = await ctx.db
      .query("emails")
      .withIndex("by_user_folder", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return all;
  },
});

export const getById = query({
  args: { id: v.id("emails") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const email = await ctx.db.get(args.id);
    if (!email || email.userId !== userId) return null;
    return email;
  },
});

export const send = mutation({
  args: {
    toAddress: v.string(),
    subject: v.optional(v.string()),
    body: v.string(),
    attachmentIds: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    const fromAddress = user?.email ?? `user@pign.com`;
    return await ctx.db.insert("emails", {
      userId,
      fromAddress,
      toAddress: args.toAddress,
      subject: args.subject,
      body: args.body,
      attachmentIds: args.attachmentIds,
      isRead: true,
      isDraft: false,
      isSent: true,
      folder: "outbox",
    });
  },
});

export const saveDraft = mutation({
  args: {
    toAddress: v.string(),
    subject: v.optional(v.string()),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("emails", {
      userId,
      fromAddress: "",
      toAddress: args.toAddress,
      subject: args.subject,
      body: args.body,
      isRead: true,
      isDraft: true,
      isSent: false,
      folder: "drafts",
    });
  },
});

export const markRead = mutation({
  args: { id: v.id("emails") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const email = await ctx.db.get(args.id);
    if (!email || email.userId !== userId) return;
    await ctx.db.patch(args.id, { isRead: true });
  },
});

export const remove = mutation({
  args: { id: v.id("emails") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const email = await ctx.db.get(args.id);
    if (!email || email.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});
