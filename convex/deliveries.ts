import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "./_generated/dataModel";

async function canAccessDelivery(
  ctx: { db: { get: (id: Id<"deliveries">) => Promise<Doc<"deliveries"> | null> } },
  delivery: Doc<"deliveries">,
  userId: Id<"users">
) {
  return (
    delivery.senderUserId === userId ||
    delivery.recipientUserId === userId
  );
}

async function lookupUserByEmail(ctx: QueryCtx, email: string) {
  return await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email.toLowerCase()))
    .first();
}

export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;
    let count = 0;
    for await (const row of ctx.db
      .query("deliveries")
      .withIndex("by_recipient_folder", (q) =>
        q.eq("recipientUserId", userId).eq("folder", "inbox")
      )) {
      if (!row.isRead && !row.isArchived) count++;
    }
    return count;
  },
});

export const list = query({
  args: {
    folder: v.optional(
      v.union(
        v.literal("all"),
        v.literal("inbox"),
        v.literal("outbox"),
        v.literal("drafts")
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const folder = args.folder ?? "all";
    const rows: Doc<"deliveries">[] = [];

    const take = async (
      index: "by_sender_folder" | "by_recipient_folder",
      field: "senderUserId" | "recipientUserId",
      folderName: Doc<"deliveries">["folder"]
    ) => {
      const batch = await ctx.db
        .query("deliveries")
        .withIndex(index, (q) =>
          q.eq(field, userId).eq("folder", folderName)
        )
        .order("desc")
        .take(100);
      rows.push(...batch);
    };

    if (folder === "all") {
      await take("by_recipient_folder", "recipientUserId", "inbox");
      await take("by_sender_folder", "senderUserId", "outbox");
      await take("by_sender_folder", "senderUserId", "drafts");
    } else if (folder === "inbox") {
      await take("by_recipient_folder", "recipientUserId", "inbox");
    } else if (folder === "outbox") {
      await take("by_sender_folder", "senderUserId", "outbox");
      await take("by_sender_folder", "senderUserId", "pending");
    } else {
      await take("by_sender_folder", "senderUserId", "drafts");
    }

    const seen = new Set<string>();
    const unique = rows.filter((r) => {
      if (seen.has(r._id)) return false;
      seen.add(r._id);
      return !r.isArchived;
    });

    unique.sort((a, b) => {
      const at = a.deliveredAt ?? a._creationTime;
      const bt = b.deliveredAt ?? b._creationTime;
      return bt - at;
    });

    const slice = unique.slice(0, 100);
    return await Promise.all(
      slice.map(async (row) => {
        const sender = await ctx.db.get(row.senderUserId);
        const counterparty =
          row.recipientUserId === userId && row.folder === "inbox"
            ? sender?.email ?? sender?.pignHandle ?? "Unknown sender"
            : row.recipientEmail;
        return { ...row, counterparty };
      })
    );
  },
});

export const getById = query({
  args: { id: v.id("deliveries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const delivery = await ctx.db.get(args.id);
    if (!delivery || !(await canAccessDelivery(ctx, delivery, userId))) {
      return null;
    }

    const documents: Array<Doc<"documents"> & { previewUrl: string | null }> = [];
    for (const docId of delivery.documentIds) {
      const doc = await ctx.db.get(docId);
      if (!doc) continue;
      let previewUrl: string | null = null;
      if (doc.fileType?.startsWith("image/")) {
        const blobId = doc.thumbnailId ?? doc.fileId;
        if (blobId) previewUrl = await ctx.storage.getUrl(blobId);
      }
      documents.push({ ...doc, previewUrl });
    }

    const sender = await ctx.db.get(delivery.senderUserId);
    const recipient =
      delivery.recipientUserId != null
        ? await ctx.db.get(delivery.recipientUserId)
        : null;

    return {
      ...delivery,
      documents,
      senderEmail: sender?.email ?? sender?.pignHandle ?? "unknown",
      senderName: sender?.name,
      recipientDisplay: delivery.recipientEmail,
      recipientName: recipient?.name,
      perspective:
        delivery.recipientUserId === userId
          ? ("inbox" as const)
          : ("outbox" as const),
    };
  },
});

export const send = mutation({
  args: {
    recipientEmail: v.string(),
    subject: v.optional(v.string()),
    body: v.optional(v.string()),
    documentIds: v.array(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const to = args.recipientEmail.trim().toLowerCase();
    if (!to || !to.includes("@")) throw new Error("Invalid recipient address");
    if (args.documentIds.length < 1) {
      throw new Error("Attach at least one document");
    }

    for (const docId of args.documentIds) {
      const doc = await ctx.db.get(docId);
      if (!doc || doc.userId !== userId || doc.isTrashed) {
        throw new Error("Invalid attachment");
      }
    }

    const recipient = await lookupUserByEmail(ctx, to);
    const now = Date.now();

    const outboxId = await ctx.db.insert("deliveries", {
      senderUserId: userId,
      recipientEmail: to,
      recipientUserId: recipient?._id,
      subject: args.subject,
      body: args.body,
      documentIds: args.documentIds,
      folder: recipient ? "outbox" : "pending",
      isRead: true,
      isStarred: false,
      isArchived: false,
      isComplete: false,
      deliveredAt: now,
    });

    if (recipient) {
      await ctx.db.insert("deliveries", {
        senderUserId: userId,
        recipientEmail: to,
        recipientUserId: recipient._id,
        subject: args.subject,
        body: args.body,
        documentIds: args.documentIds,
        folder: "inbox",
        isRead: false,
        isStarred: false,
        isArchived: false,
        isComplete: false,
        linkedDeliveryId: outboxId,
        deliveredAt: now,
      });
    }

    return outboxId;
  },
});

export const saveDraft = mutation({
  args: {
    recipientEmail: v.optional(v.string()),
    subject: v.optional(v.string()),
    body: v.optional(v.string()),
    documentIds: v.optional(v.array(v.id("documents"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const to = args.recipientEmail?.trim().toLowerCase() ?? "";
    if (to && !to.includes("@")) throw new Error("Invalid recipient address");

    const docIds = args.documentIds ?? [];
    for (const docId of docIds) {
      const doc = await ctx.db.get(docId);
      if (!doc || doc.userId !== userId || doc.isTrashed) {
        throw new Error("Invalid attachment");
      }
    }

    return await ctx.db.insert("deliveries", {
      senderUserId: userId,
      recipientEmail: to,
      subject: args.subject,
      body: args.body,
      documentIds: docIds,
      folder: "drafts",
      isRead: true,
      isStarred: false,
      isArchived: false,
      isComplete: false,
    });
  },
});

export const markRead = mutation({
  args: { id: v.id("deliveries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const delivery = await ctx.db.get(args.id);
    if (!delivery || delivery.recipientUserId !== userId) return;
    await ctx.db.patch(args.id, { isRead: true });
  },
});

export const toggleStar = mutation({
  args: { id: v.id("deliveries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const delivery = await ctx.db.get(args.id);
    if (!delivery || !(await canAccessDelivery(ctx, delivery, userId))) {
      throw new Error("Not found");
    }
    await ctx.db.patch(args.id, { isStarred: !delivery.isStarred });
  },
});

export const toggleArchive = mutation({
  args: { id: v.id("deliveries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const delivery = await ctx.db.get(args.id);
    if (!delivery || delivery.recipientUserId !== userId) {
      throw new Error("Not found");
    }
    await ctx.db.patch(args.id, { isArchived: !delivery.isArchived });
  },
});

export const toggleComplete = mutation({
  args: { id: v.id("deliveries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const delivery = await ctx.db.get(args.id);
    if (!delivery || !(await canAccessDelivery(ctx, delivery, userId))) {
      throw new Error("Not found");
    }
    await ctx.db.patch(args.id, { isComplete: !delivery.isComplete });
  },
});

export const remove = mutation({
  args: { id: v.id("deliveries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const delivery = await ctx.db.get(args.id);
    if (!delivery || !(await canAccessDelivery(ctx, delivery, userId))) {
      throw new Error("Not found");
    }
    if (delivery.folder === "drafts" && delivery.senderUserId !== userId) {
      throw new Error("Not found");
    }
    await ctx.db.delete(args.id);
  },
});

export const getDocumentUrl = query({
  args: { deliveryId: v.id("deliveries"), documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const delivery = await ctx.db.get(args.deliveryId);
    if (!delivery || !(await canAccessDelivery(ctx, delivery, userId))) {
      return null;
    }
    if (!delivery.documentIds.includes(args.documentId)) return null;
    const doc = await ctx.db.get(args.documentId);
    if (!doc?.fileId) return null;
    return await ctx.storage.getUrl(doc.fileId);
  },
});
