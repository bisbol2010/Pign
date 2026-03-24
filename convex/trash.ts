import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("documents")
      .withIndex("by_user_trashed", (q) =>
        q.eq("userId", userId).eq("isTrashed", true)
      )
      .order("desc")
      .collect();
  },
});

export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const doc = await ctx.db.get(args.id);
    if (!doc || doc.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.id, { isTrashed: false, trashedAt: undefined });
  },
});

export const shred = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const doc = await ctx.db.get(args.id);
    if (!doc || doc.userId !== userId) throw new Error("Not found");
    if (doc.fileId) {
      await ctx.storage.delete(doc.fileId);
    }
    if (doc.thumbnailId) {
      await ctx.storage.delete(doc.thumbnailId);
    }
    const knowledgeEntries = await ctx.db
      .query("knowledge")
      .withIndex("by_document", (q) => q.eq("documentId", args.id))
      .collect();
    for (const entry of knowledgeEntries) {
      await ctx.db.delete(entry._id);
    }
    const sharedEntries = await ctx.db
      .query("sharedAccess")
      .withIndex("by_document", (q) => q.eq("documentId", args.id))
      .collect();
    for (const entry of sharedEntries) {
      await ctx.db.delete(entry._id);
    }
    await ctx.db.delete(args.id);
  },
});
