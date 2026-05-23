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

// Aggregate-only query so the sidebar storage bar doesn't subscribe to every
// document mutation. Streams via async iteration to avoid loading every row
// into memory at once.
export const storageUsage = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;
    let bytes = 0;
    for await (const doc of ctx.db
      .query("documents")
      .withIndex("by_user_trashed", (q) =>
        q.eq("userId", userId).eq("isTrashed", false)
      )) {
      bytes += doc.fileSize ?? 0;
    }
    return bytes;
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

// Takes the document ID (not the storage ID) so ownership is O(1) via
// ctx.db.get, instead of scanning the user's documents to find a fileId match.
// For email attachments, use api.emails.getAttachmentUrl instead.
export const getFileUrl = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const doc = await ctx.db.get(args.documentId);
    if (!doc || doc.userId !== userId || !doc.fileId) return null;
    return await ctx.storage.getUrl(doc.fileId);
  },
});
