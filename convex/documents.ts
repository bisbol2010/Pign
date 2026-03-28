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
        q.eq("userId", userId).eq("isTrashed", false)
      )
      .order("desc")
      .take(200);
  },
});

export const getRecent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const docs = await ctx.db
      .query("documents")
      .withIndex("by_user_trashed", (q) =>
        q.eq("userId", userId).eq("isTrashed", false)
      )
      .order("desc")
      .take(50);
    return docs
      .filter((d) => d.lastOpenedAt)
      .sort((a, b) => (b.lastOpenedAt ?? 0) - (a.lastOpenedAt ?? 0))
      .slice(0, 8);
  },
});

export const getById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const doc = await ctx.db.get(args.id);
    if (!doc || doc.userId !== userId) return null;
    return doc;
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    if (!args.query.trim()) return [];
    return await ctx.db
      .query("documents")
      .withSearchIndex("search_name", (q) =>
        q.search("name", args.query).eq("userId", userId)
      )
      .take(20);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    fileId: v.optional(v.id("_storage")),
    fileType: v.optional(v.string()),
    fileSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("documents", {
      userId,
      name: args.name,
      fileId: args.fileId,
      fileType: args.fileType,
      fileSize: args.fileSize,
      isVerified: false,
      isShared: false,
      isTrashed: false,
      lastOpenedAt: Date.now(),
    });
  },
});

export const rename = mutation({
  args: { id: v.id("documents"), name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const doc = await ctx.db.get(args.id);
    if (!doc || doc.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.id, { name: args.name });
  },
});

export const markOpened = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const doc = await ctx.db.get(args.id);
    if (!doc || doc.userId !== userId) return;
    await ctx.db.patch(args.id, { lastOpenedAt: Date.now() });
  },
});

export const verify = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const doc = await ctx.db.get(args.id);
    if (!doc || doc.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.id, { isVerified: true });
  },
});

export const moveToTrash = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const doc = await ctx.db.get(args.id);
    if (!doc || doc.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.id, { isTrashed: true, trashedAt: Date.now() });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

export const getFileUrl = query({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const doc = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()
      .then((docs) => docs.find((d) => d.fileId === args.fileId));
    if (!doc) return null;
    return await ctx.storage.getUrl(args.fileId);
  },
});
