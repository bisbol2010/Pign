import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "./_generated/dataModel";

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
      if (doc.thumbnailId) {
        previewUrl = await ctx.storage.getUrl(doc.thumbnailId);
      } else if (doc.fileType?.startsWith("image/") && doc.fileId) {
        previewUrl = await ctx.storage.getUrl(doc.fileId);
      }
      return { ...doc, previewUrl };
    })
  );
}

async function ownerMeta(
  ctx: QueryCtx,
  ownerId: Id<"users">
): Promise<{ ownerName: string | null; ownerEmail: string | null }> {
  const owner = await ctx.db.get(ownerId);
  return {
    ownerName: owner?.name ?? null,
    ownerEmail: owner?.email ?? null,
  };
}

export const listSharedByMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const entries = await ctx.db
      .query("sharedAccess")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .take(50);

    const grouped = new Map<
      Id<"documents">,
      { doc: Doc<"documents">; sharedWithEmails: string[] }
    >();

    for (const entry of entries) {
      const doc = await ctx.db.get(entry.documentId);
      if (!doc || doc.isTrashed) continue;

      const existing = grouped.get(entry.documentId);
      if (existing) {
        existing.sharedWithEmails.push(entry.sharedWithEmail);
      } else {
        grouped.set(entry.documentId, {
          doc,
          sharedWithEmails: [entry.sharedWithEmail],
        });
      }
    }

    const rows = [...grouped.values()].map(({ doc, sharedWithEmails }) => ({
      ...doc,
      sharedWithCount: sharedWithEmails.length,
      sharedWithEmails,
    }));

    rows.sort((a, b) => b._creationTime - a._creationTime);
    return withPreviewUrls(ctx, rows);
  },
});

export const listSharedWithMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const entries = await ctx.db
      .query("sharedAccess")
      .withIndex("by_shared_user", (q) => q.eq("sharedWithUserId", userId))
      .take(50);

    const seen = new Set<string>();
    const rows: Array<
      Doc<"documents"> & {
        permission: "view" | "edit";
        accessId: Id<"sharedAccess">;
        ownerName: string | null;
        ownerEmail: string | null;
      }
    > = [];

    for (const entry of entries) {
      if (seen.has(entry.documentId)) continue;
      const doc = await ctx.db.get(entry.documentId);
      if (!doc || doc.isTrashed) continue;
      seen.add(entry.documentId);

      const owner = await ownerMeta(ctx, entry.ownerId);
      rows.push({
        ...doc,
        permission: entry.permission,
        accessId: entry._id,
        ...owner,
      });
    }

    rows.sort((a, b) => b._creationTime - a._creationTime);
    return withPreviewUrls(ctx, rows);
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

    const email = args.sharedWithEmail.trim().toLowerCase();
    if (!email) throw new Error("Email is required");

    // Prevent duplicate share rows for the same recipient.
    const existing = await ctx.db
      .query("sharedAccess")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
    if (existing.some((e) => e.sharedWithEmail === email)) {
      throw new Error("This document is already shared with that email.");
    }

    // Resolve the recipient to an account if one already exists so that
    // "Shared with me" and notifications work immediately. Only auto-link the
    // share to that account when its email is verified — otherwise an account
    // registered with someone else's address could inherit the share. Unlinked
    // shares are attached later by claimPendingShares once the email verifies.
    const recipient = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();
    const recipientVerified = !!recipient?.emailVerificationTime;

    await ctx.db.insert("sharedAccess", {
      documentId: args.documentId,
      ownerId: userId,
      sharedWithEmail: email,
      sharedWithUserId: recipientVerified ? recipient!._id : undefined,
      permission: args.permission,
    });
    await ctx.db.patch(args.documentId, { isShared: true });

    if (recipient && recipientVerified && recipient._id !== userId) {
      const owner = await ctx.db.get(userId);
      const ownerLabel = owner?.name ?? owner?.email ?? "Someone";
      await ctx.db.insert("notifications", {
        userId: recipient._id,
        type: "share_received",
        title: "Document shared with you",
        body: `${ownerLabel} shared "${doc.name}" with you.`,
        isRead: false,
        linkedDocumentId: args.documentId,
      });
    }
  },
});

// Attaches the current user to any shares addressed to their email before they
// had an account. Idempotent: only patches rows missing sharedWithUserId.
export const claimPendingShares = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { claimed: 0 };
    const user = await ctx.db.get(userId);
    const email = user?.email?.trim().toLowerCase();
    if (!email) return { claimed: 0 };
    // Only attach email-addressed shares once the account's email is verified,
    // so an unverified account can't claim a victim's shares by registering
    // with their address.
    if (!user?.emailVerificationTime) return { claimed: 0 };

    const pending = await ctx.db
      .query("sharedAccess")
      .withIndex("by_shared_email", (q) => q.eq("sharedWithEmail", email))
      .collect();

    let claimed = 0;
    for (const entry of pending) {
      if (!entry.sharedWithUserId) {
        await ctx.db.patch(entry._id, { sharedWithUserId: userId });
        claimed++;
      }
    }
    return { claimed };
  },
});

export const listByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const doc = await ctx.db.get(args.documentId);
    if (!doc || doc.userId !== userId) return [];
    return await ctx.db
      .query("sharedAccess")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
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

export const revokeAllForDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const doc = await ctx.db.get(args.documentId);
    if (!doc || doc.userId !== userId) throw new Error("Not found");
    const entries = await ctx.db
      .query("sharedAccess")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
    for (const entry of entries) {
      await ctx.db.delete(entry._id);
    }
    if (entries.length > 0) {
      await ctx.db.patch(args.documentId, { isShared: false });
    }
  },
});
