import { query } from "./_generated/server";
import { v } from "convex/values";

/** Public metadata for a secure share link (`/s/:token`). */
export const getByShareToken = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const doc = await ctx.db
      .query("documents")
      .withIndex("by_share_token", (q) => q.eq("shareToken", token))
      .unique();
    if (!doc || doc.isTrashed) return null;
    return {
      documentId: doc._id,
      name: doc.name,
      isVerified: doc.isVerified,
      fileType: doc.fileType ?? null,
      contentHash: doc.contentHash ?? null,
    };
  },
});
