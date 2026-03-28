import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listSharedByMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("sharedAccess")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .take(50);
  },
});

export const listSharedWithMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("sharedAccess")
      .withIndex("by_shared_user", (q) => q.eq("sharedWithUserId", userId))
      .take(50);
  },
});

export const share = mutation({
  args: {
    documentId: v.id("documents"),
    sharedWithEmail: v.string(),
    permission: v.union(v.literal("view"), v.literal("edit")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const doc = await ctx.db.get(args.documentId);
    if (!doc || doc.userId !== userId) throw new Error("Not found");
    await ctx.db.insert("sharedAccess", {
      documentId: args.documentId,
      ownerId: userId,
      sharedWithEmail: args.sharedWithEmail,
      permission: args.permission,
    });
    await ctx.db.patch(args.documentId, { isShared: true });
  },
});

export const revokeAccess = mutation({
  args: { id: v.id("sharedAccess") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const access = await ctx.db.get(args.id);
    if (!access || access.ownerId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
    const remaining = await ctx.db
      .query("sharedAccess")
      .withIndex("by_document", (q) => q.eq("documentId", access.documentId))
      .collect();
    if (remaining.length === 0) {
      await ctx.db.patch(access.documentId, { isShared: false });
    }
  },
});
