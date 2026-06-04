import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";

async function shredDocument(ctx: MutationCtx, docId: Id<"documents">) {
  const doc = await ctx.db.get(docId);
  if (!doc) return;
  if (doc.fileId) {
    await ctx.storage.delete(doc.fileId);
  }
  if (doc.thumbnailId) {
    await ctx.storage.delete(doc.thumbnailId);
  }
  const knowledgeEntries = await ctx.db
    .query("knowledge")
    .withIndex("by_document", (q) => q.eq("documentId", docId))
    .collect();
  for (const entry of knowledgeEntries) {
    await ctx.db.delete(entry._id);
  }
  const sharedEntries = await ctx.db
    .query("sharedAccess")
    .withIndex("by_document", (q) => q.eq("documentId", docId))
    .collect();
  for (const entry of sharedEntries) {
    await ctx.db.delete(entry._id);
  }
  const contentEntries = await ctx.db
    .query("documentContent")
    .withIndex("by_document", (q) => q.eq("documentId", docId))
    .collect();
  for (const entry of contentEntries) {
    await ctx.db.delete(entry._id);
  }
  await ctx.db.delete(docId);
}

async function folderStats(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  folderId: Id<"folders">
) {
  let totalFileSize = 0;
  let lastUploadedAt = 0;
  for await (const doc of ctx.db
    .query("documents")
    .withIndex("by_user_folder", (q) =>
      q.eq("userId", userId).eq("folderId", folderId)
    )) {
    totalFileSize += doc.fileSize ?? 0;
    if (doc._creationTime > lastUploadedAt) {
      lastUploadedAt = doc._creationTime;
    }
  }
  return { totalFileSize, lastUploadedAt };
}

async function withPreviewUrls<
  T extends {
    fileType?: string;
    fileId?: Id<"_storage">;
    thumbnailId?: Id<"_storage">;
  },
>(ctx: QueryCtx, docs: T[]) {
  return Promise.all(
    docs.map(async (doc) => {
      let previewUrl: string | null = null;
      if (doc.thumbnailId) {
        previewUrl = await ctx.storage.getUrl(doc.thumbnailId);
      } else if (doc.fileType?.startsWith("image/") && doc.fileId) {
        previewUrl = await ctx.storage.getUrl(doc.fileId);
      }
      return { ...doc, previewUrl };
    })
  );
}

function sortTrashItems<
  T extends { trashedAt?: number; _creationTime: number },
>(items: T[]): T[] {
  return [...items].sort(
    (a, b) =>
      (b.trashedAt ?? b._creationTime) - (a.trashedAt ?? a._creationTime)
  );
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { files: [], folders: [] };

    const docs = await ctx.db
      .query("documents")
      .withIndex("by_user_trashed", (q) =>
        q.eq("userId", userId).eq("isTrashed", true)
      )
      .order("desc")
      .take(200);

    const files = await withPreviewUrls(ctx, docs);

    const allFolders = await ctx.db
      .query("folders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const trashedFolders = allFolders.filter((f) => f.isTrashed === true);
    const folders = await Promise.all(
      trashedFolders.map(async (folder) => {
        const stats = await folderStats(ctx, userId, folder._id);
        return {
          ...folder,
          totalFileSize: stats.totalFileSize,
          lastUploadedAt:
            stats.lastUploadedAt > 0
              ? stats.lastUploadedAt
              : folder._creationTime,
        };
      })
    );

    return {
      files: sortTrashItems(files),
      folders: sortTrashItems(folders),
    };
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

export const restoreFolder = mutation({
  args: { id: v.id("folders") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const folder = await ctx.db.get(args.id);
    if (!folder || folder.userId !== userId) throw new Error("Not found");
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
    await shredDocument(ctx, args.id);
  },
});

export const shredFolder = mutation({
  args: { id: v.id("folders") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const folder = await ctx.db.get(args.id);
    if (!folder || folder.userId !== userId) throw new Error("Not found");

    const docs = await ctx.db
      .query("documents")
      .withIndex("by_user_folder", (q) =>
        q.eq("userId", userId).eq("folderId", args.id)
      )
      .collect();
    for (const doc of docs) {
      await shredDocument(ctx, doc._id);
    }
    await ctx.db.delete(args.id);
  },
});

export const emptyAll = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const trashedDocs = await ctx.db
      .query("documents")
      .withIndex("by_user_trashed", (q) =>
        q.eq("userId", userId).eq("isTrashed", true)
      )
      .collect();
    for (const doc of trashedDocs) {
      await shredDocument(ctx, doc._id);
    }

    const allFolders = await ctx.db
      .query("folders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const folder of allFolders) {
      if (folder.isTrashed !== true) continue;
      const docs = await ctx.db
        .query("documents")
        .withIndex("by_user_folder", (q) =>
          q.eq("userId", userId).eq("folderId", folder._id)
        )
        .collect();
      for (const doc of docs) {
        if (!doc.isTrashed) {
          await ctx.db.patch(doc._id, { folderId: undefined });
        }
      }
      await ctx.db.delete(folder._id);
    }
  },
});

export const moveFolderToTrash = mutation({
  args: { id: v.id("folders") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const folder = await ctx.db.get(args.id);
    if (!folder || folder.userId !== userId) throw new Error("Not found");
    if (folder.isSystem) throw new Error("System folders can't be trashed");
    await ctx.db.patch(args.id, { isTrashed: true, trashedAt: Date.now() });
  },
});
