import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "./_generated/dataModel";

export type ViewerAccess =
  | { role: "owner"; permission: "edit" }
  | { role: "shared"; permission: "view" | "edit" }
  | { role: "link"; permission: "view" };

type ViewerAccessResult =
  | { allowed: true; access: ViewerAccess }
  | { allowed: false; reason: "not_found" | "denied" | "trashed" };

async function resolveViewerAccess(
  ctx: QueryCtx,
  doc: Doc<"documents"> | null,
  userId: Id<"users"> | null,
  shareToken?: string
): Promise<ViewerAccessResult> {
  if (!doc) return { allowed: false, reason: "not_found" };
  if (doc.isTrashed) return { allowed: false, reason: "trashed" };

  if (userId && doc.userId === userId) {
    return { allowed: true, access: { role: "owner", permission: "edit" } };
  }

  if (userId) {
    const user = await ctx.db.get(userId);
    const entries = await ctx.db
      .query("sharedAccess")
      .withIndex("by_document", (q) => q.eq("documentId", doc._id))
      .collect();

    // Only trust an email match when the viewer's email is verified; an
    // unverified account could otherwise claim a victim's address. Direct
    // user-id matches (set at share time for verified recipients) are always
    // honored. Emails are stored lowercased, so normalize before comparing.
    const viewerEmail = user?.emailVerificationTime
      ? user.email?.toLowerCase()
      : undefined;
    for (const entry of entries) {
      if (entry.sharedWithUserId === userId) {
        return {
          allowed: true,
          access: { role: "shared", permission: entry.permission },
        };
      }
      if (viewerEmail && entry.sharedWithEmail === viewerEmail) {
        return {
          allowed: true,
          access: { role: "shared", permission: entry.permission },
        };
      }
    }
  }

  if (shareToken && doc.shareToken === shareToken && userId) {
    return { allowed: true, access: { role: "link", permission: "view" } };
  }

  return { allowed: false, reason: "denied" };
}
import { getEffectivePlan } from "./subscriptions";
import { applyVerification } from "./verification";
import { formatBytes, storageLimitBytes } from "./plans";

// Streams the user's (non-trashed) document sizes. Used by both storageUsage
// and the create-time quota check so they stay in sync.
async function currentStorageBytes(
  ctx: QueryCtx,
  userId: Id<"users">
): Promise<number> {
  let bytes = 0;
  for await (const doc of ctx.db
    .query("documents")
    .withIndex("by_user_trashed", (q) =>
      q.eq("userId", userId).eq("isTrashed", false)
    )) {
    bytes += doc.fileSize ?? 0;
  }
  return bytes;
}

// Attaches a resolved storage URL (previewUrl) for image documents so list/grid
// views can show real thumbnails without firing a query per row. Non-image
// files get previewUrl: null and fall back to the file glyph.
/** Pinned documents first (newest pin wins), then by creation time. */
function sortForFileList<T extends { isPinned?: boolean; pinnedAt?: number; _creationTime: number }>(
  docs: T[]
): T[] {
  return [...docs].sort((a, b) => {
    const aPin = a.isPinned ? (a.pinnedAt ?? a._creationTime) : 0;
    const bPin = b.isPinned ? (b.pinnedAt ?? b._creationTime) : 0;
    if (aPin !== bPin) return bPin - aPin;
    return b._creationTime - a._creationTime;
  });
}

async function withPreviewUrls<
  T extends {
    fileType?: string;
    fileId?: Id<"_storage">;
    thumbnailId?: Id<"_storage">;
  },
>(ctx: QueryCtx, docs: T[]): Promise<(T & { previewUrl: string | null })[]> {
  return Promise.all(
    docs.map(async (doc) => {
      let previewUrl: string | null = null;
      // Prefer a generated thumbnail (works for PDFs and any type). Images
      // without a thumbnail fall back to the original file.
      if (doc.thumbnailId) {
        previewUrl = await ctx.storage.getUrl(doc.thumbnailId);
      } else if (doc.fileType?.startsWith("image/") && doc.fileId) {
        previewUrl = await ctx.storage.getUrl(doc.fileId);
      }
      return { ...doc, previewUrl };
    })
  );
}

// "All files" shows root-level documents only. Documents that live inside a
// folder are surfaced from the folder detail view, so they don't duplicate
// here.
export const list = query({
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
      .take(400);
    const rootDocs = docs.filter((d) => !d.folderId);
    return withPreviewUrls(ctx, sortForFileList(rootDocs));
  },
});

// Recent strip mirrors "All files": only root-level documents are eligible, so
// files tucked inside folders don't leak onto the dashboard.
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
      .take(100);
    const recent = docs
      .filter((d) => !d.folderId && d.lastOpenedAt)
      .sort((a, b) => (b.lastOpenedAt ?? 0) - (a.lastOpenedAt ?? 0))
      .slice(0, 8);
    return withPreviewUrls(ctx, recent);
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

/** Viewer query with owner, shared-with-me, and share-link access checks. */
export const getForViewer = query({
  args: {
    id: v.string(),
    shareToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    let doc: Doc<"documents"> | null;
    try {
      doc = await ctx.db.get(args.id as Id<"documents">);
    } catch {
      return { status: "not_found" as const };
    }
    if (!doc) return { status: "not_found" as const };

    const accessResult = await resolveViewerAccess(
      ctx,
      doc,
      userId,
      args.shareToken
    );

    if (!accessResult.allowed) {
      if (accessResult.reason === "trashed") {
        return { status: "not_found" as const };
      }
      return {
        status: "denied" as const,
        name: doc.name,
        isVerified: doc.isVerified,
        isShared: doc.isShared,
        contentHash: doc.contentHash ?? null,
      };
    }

    const [withPreview] = await withPreviewUrls(ctx, [doc]);
    const content = await ctx.db
      .query("documentContent")
      .withIndex("by_document", (q) => q.eq("documentId", doc._id))
      .first();

    return {
      status: "ok" as const,
      doc: withPreview,
      access: accessResult.access,
      pageCount: content?.pageCount ?? null,
    };
  },
});

/** @deprecated Prefer `api.search.run` — kept for older clients. */
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    if (!args.query.trim()) return [];
    const docs = await ctx.db
      .query("documents")
      .withSearchIndex("search_name", (q) =>
        q.search("name", args.query).eq("userId", userId)
      )
      .take(20);
    return withPreviewUrls(
      ctx,
      docs.filter((d) => !d.isTrashed)
    );
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
    return await currentStorageBytes(ctx, userId);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    fileId: v.optional(v.id("_storage")),
    fileType: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    thumbnailId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Plan storage quota enforcement. Defaults to the free plan (15 GB) for
    // users without a subscription row.
    const incoming = args.fileSize ?? 0;
    if (incoming > 0) {
      const { plan, seats } = await getEffectivePlan(ctx, userId);
      const limit = storageLimitBytes(plan, seats);
      const used = await currentStorageBytes(ctx, userId);
      if (used + incoming > limit) {
        throw new Error(
          `Storage limit reached: this upload would exceed your ${formatBytes(
            limit
          )} ${plan} plan allowance (${formatBytes(used)} used). ` +
            `Upgrade your plan or free up space.`
        );
      }
    }

    return await ctx.db.insert("documents", {
      userId,
      name: args.name,
      fileId: args.fileId,
      fileType: args.fileType,
      fileSize: args.fileSize,
      thumbnailId: args.thumbnailId,
      isVerified: false,
      verificationStatus: "unverified",
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
  args: {
    id: v.id("documents"),
    shareToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;
    const doc = await ctx.db.get(args.id);
    if (!doc) return;
    const accessResult = await resolveViewerAccess(
      ctx,
      doc,
      userId,
      args.shareToken
    );
    if (!accessResult.allowed) return;
    await ctx.db.patch(args.id, { lastOpenedAt: Date.now() });
  },
});

/** @deprecated Prefer `api.verification.submitVerification` — kept for older call sites. */
export const verify = mutation({
  args: {
    id: v.id("documents"),
    description: v.optional(v.string()),
    issuerEntityId: v.optional(v.id("verifiedEntities")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const doc = await ctx.db.get(args.id);
    if (!doc || doc.userId !== userId) throw new Error("Not found");

    await applyVerification(ctx, userId, doc, {
      description: args.description,
      issuerEntityId: args.issuerEntityId,
    });
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
  args: {
    documentId: v.id("documents"),
    shareToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const doc = await ctx.db.get(args.documentId);
    if (!doc?.fileId) return null;
    const accessResult = await resolveViewerAccess(
      ctx,
      doc,
      userId,
      args.shareToken
    );
    if (!accessResult.allowed) return null;
    return await ctx.storage.getUrl(doc.fileId);
  },
});

export const togglePin = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const doc = await ctx.db.get(args.id);
    if (!doc || doc.userId !== userId) throw new Error("Not found");
    const nextPinned = !doc.isPinned;
    await ctx.db.patch(args.id, {
      isPinned: nextPinned,
      pinnedAt: nextPinned ? Date.now() : undefined,
    });
    return nextPinned;
  },
});

/** Creates a share token if missing; returns the token for building `/s/:token`. */
export const ensureShareToken = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const doc = await ctx.db.get(args.id);
    if (!doc || doc.userId !== userId) throw new Error("Not found");
    if (doc.shareToken) return doc.shareToken;
    const token = crypto.randomUUID().replace(/-/g, "");
    await ctx.db.patch(args.id, { shareToken: token });
    return token;
  },
});
