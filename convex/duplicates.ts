import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";

/**
 * After a document is verified, flag uploads that match an existing verified
 * original's content hash (SPEC §3.6). Skips when the original has no issuer
 * entity (personal self-verify).
 */
export async function checkDuplicatesOnVerify(
  ctx: MutationCtx,
  flaggedDocumentId: Id<"documents">,
  contentHash: string,
  uploaderUserId: Id<"users">
): Promise<void> {
  const flagged = await ctx.db.get(flaggedDocumentId);
  if (!flagged) return;

  const originals = await ctx.db
    .query("documents")
    .withIndex("by_hash", (q) => q.eq("contentHash", contentHash))
    .collect();

  for (const original of originals) {
    if (original._id === flaggedDocumentId) continue;
    if (!original.isVerified) continue;
    if (!original.issuerEntityId) continue;

    const existing = await ctx.db
      .query("duplicateFlags")
      .withIndex("by_flagged_doc", (q) =>
        q.eq("flaggedDocumentId", flaggedDocumentId)
      )
      .first();
    if (existing) return;

    const hasDistribution = await ctx.db
      .query("distributionRecords")
      .withIndex("by_hash_recipient", (q) =>
        q.eq("contentHash", contentHash).eq("recipientUserId", uploaderUserId)
      )
      .first();
    if (hasDistribution) continue;

    await ctx.db.insert("duplicateFlags", {
      flaggedDocumentId,
      originalDocumentId: original._id,
      ownerEntityId: original.issuerEntityId,
      contentHash,
      status: "pending",
    });

    await ctx.db.patch(flaggedDocumentId, {
      duplicateOfId: original._id,
      duplicateStatus: "pending",
    });

    const entity = await ctx.db.get(original.issuerEntityId);
    if (entity) {
      await ctx.db.insert("notifications", {
        userId: entity.contactUserId,
        type: "duplicate_flagged",
        title: "Possible duplicate upload",
        body: `A document matching "${original.name}" was uploaded and flagged for review.`,
        isRead: false,
        linkedDocumentId: flaggedDocumentId,
        linkedEntityId: original.issuerEntityId,
      });
    }

    await ctx.db.insert("notifications", {
      userId: uploaderUserId,
      type: "duplicate_flagged",
      title: "Possible duplicate",
      body: `This document matches a verified file registered to ${entity?.displayName ?? "another issuer"}. Awaiting review.`,
      isRead: false,
      linkedDocumentId: flaggedDocumentId,
      linkedEntityId: original.issuerEntityId,
    });
    return;
  }
}

export const checkOnVerify = internalMutation({
  args: {
    documentId: v.id("documents"),
    contentHash: v.string(),
    uploaderUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await checkDuplicatesOnVerify(
      ctx,
      args.documentId,
      args.contentHash,
      args.uploaderUserId
    );
  },
});
