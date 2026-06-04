import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Folder CRUD for the dashboard "Folders" tab (Figma: All folders / grid /
 * create folder). Folders are owned per-user; `isSystem` folders (e.g. ones
 * auto-created from deliveries) cannot be renamed or deleted by hand.
 */

// Lists the current user's folders with a live document count for each, so the
// folder cards/rows can show "N files" without a per-folder query.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const folders = (
      await ctx.db
        .query("folders")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect()
    ).filter((f) => f.isTrashed !== true);

    const counts = new Map<string, number>();
    const totalSizes = new Map<string, number>();
    const lastUploaded = new Map<string, number>();
    for await (const doc of ctx.db
      .query("documents")
      .withIndex("by_user_trashed", (q) =>
        q.eq("userId", userId).eq("isTrashed", false)
      )) {
      if (doc.folderId) {
        counts.set(doc.folderId, (counts.get(doc.folderId) ?? 0) + 1);
        totalSizes.set(
          doc.folderId,
          (totalSizes.get(doc.folderId) ?? 0) + (doc.fileSize ?? 0)
        );
        const prev = lastUploaded.get(doc.folderId) ?? 0;
        if (doc._creationTime > prev) {
          lastUploaded.set(doc.folderId, doc._creationTime);
        }
      }
    }

    return folders
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((f) => ({
        ...f,
        documentCount: counts.get(f._id) ?? 0,
        totalFileSize: totalSizes.get(f._id) ?? 0,
        lastUploadedAt: lastUploaded.get(f._id) ?? f._creationTime,
      }));
  },
});

// Returns a single folder plus its (non-trashed) documents with resolved image
// preview URLs, for the folder-detail view.
export const getWithDocuments = query({
  args: { folderId: v.id("folders") },
  handler: async (ctx, { folderId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const folder = await ctx.db.get(folderId);
    if (!folder || folder.userId !== userId || folder.isTrashed === true)
      return null;

    const docs = (
      await ctx.db
        .query("documents")
        .withIndex("by_user_trashed", (q) =>
          q.eq("userId", userId).eq("isTrashed", false)
        )
        .collect()
    ).filter((d) => d.folderId === folderId);

    const documents = await Promise.all(
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

    return { folder, documents };
  },
});

export const create = mutation({
  args: { name: v.string(), color: v.optional(v.string()) },
  handler: async (ctx, { name, color }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Folder name is required");
    return await ctx.db.insert("folders", {
      userId,
      name: trimmed,
      color,
      isSystem: false,
    });
  },
});

export const rename = mutation({
  args: { id: v.id("folders"), name: v.string() },
  handler: async (ctx, { id, name }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const folder = await ctx.db.get(id);
    if (!folder || folder.userId !== userId) throw new Error("Folder not found");
    if (folder.isSystem) throw new Error("System folders can't be renamed");
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Folder name is required");
    await ctx.db.patch(id, { name: trimmed });
  },
});

// Deletes a folder and detaches (does not trash) any documents inside it.
export const remove = mutation({
  args: { id: v.id("folders") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const folder = await ctx.db.get(id);
    if (!folder || folder.userId !== userId) throw new Error("Folder not found");
    if (folder.isSystem) throw new Error("System folders can't be deleted");

    const docs = (
      await ctx.db
        .query("documents")
        .withIndex("by_user_trashed", (q) =>
          q.eq("userId", userId).eq("isTrashed", false)
        )
        .collect()
    ).filter((d) => d.folderId === id);
    for (const doc of docs) {
      await ctx.db.patch(doc._id, { folderId: undefined });
    }

    await ctx.db.delete(id);
  },
});

// Moves a document into a folder (or to the root when folderId is null).
export const moveDocument = mutation({
  args: {
    documentId: v.id("documents"),
    folderId: v.union(v.id("folders"), v.null()),
  },
  handler: async (ctx, { documentId, folderId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const doc = await ctx.db.get(documentId);
    if (!doc || doc.userId !== userId) throw new Error("Document not found");
    if (folderId) {
      const folder = await ctx.db.get(folderId);
      if (!folder || folder.userId !== userId)
        throw new Error("Folder not found");
    }
    await ctx.db.patch(documentId, { folderId: folderId ?? undefined });
  },
});
