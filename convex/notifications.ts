import { v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
} from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "./_generated/dataModel";

const notificationType = v.union(
  v.literal("duplicate_flagged"),
  v.literal("doc_delivered"),
  v.literal("verification_approved"),
  v.literal("verification_revoked"),
  v.literal("share_received")
);

export type NotificationRow = Doc<"notifications">;

async function assertOwnedNotification(
  ctx: MutationCtx,
  notificationId: Id<"notifications">,
  userId: Id<"users">
) {
  const notification = await ctx.db.get(notificationId);
  if (!notification || notification.userId !== userId) {
    throw new Error("Notification not found");
  }
  return notification;
}

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const limit = Math.min(args.limit ?? 50, 100);
    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);
  },
});

export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;

    let count = 0;
    for await (const row of ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) =>
        q.eq("userId", userId).eq("isRead", false)
      )) {
      count++;
    }
    return count;
  },
});

export const markRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await assertOwnedNotification(ctx, args.id, userId);
    await ctx.db.patch(args.id, { isRead: true });
  },
});

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    for await (const row of ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) =>
        q.eq("userId", userId).eq("isRead", false)
      )) {
      await ctx.db.patch(row._id, { isRead: true });
    }
  },
});

export const create = internalMutation({
  args: {
    userId: v.id("users"),
    type: notificationType,
    title: v.string(),
    body: v.string(),
    linkedDocumentId: v.optional(v.id("documents")),
    linkedEntityId: v.optional(v.id("verifiedEntities")),
    linkedDeliveryId: v.optional(v.id("deliveries")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      ...args,
      isRead: false,
    });
  },
});

/** Dev-only sample rows for UI verification. No-op if user already has notifications. */
export const seedDev = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .take(1);
    if (existing.length > 0) return { seeded: false as const };

    const samples: Array<Omit<Doc<"notifications">, "_id" | "_creationTime">> = [
      {
        userId,
        type: "share_received",
        title: "Document shared with you",
        body: "A teammate shared Quarterly report.pdf with you.",
        isRead: false,
      },
      {
        userId,
        type: "doc_delivered",
        title: "New delivery in inbox",
        body: "You received a secure delivery from billing@company.com.",
        isRead: false,
      },
      {
        userId,
        type: "verification_approved",
        title: "Verification approved",
        body: "Your entity verification request was approved.",
        isRead: true,
      },
      {
        userId,
        type: "duplicate_flagged",
        title: "Possible duplicate flagged",
        body: "A document matching your registered content was uploaded.",
        isRead: true,
      },
    ];

    for (const sample of samples) {
      await ctx.db.insert("notifications", sample);
    }

    return { seeded: true as const };
  },
});
