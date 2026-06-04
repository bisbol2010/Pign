import { v } from "convex/values";
import { mutation, query, type MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "./_generated/dataModel";
import { recordVerificationOrThrow } from "./subscriptions";
import { checkDuplicatesOnVerify } from "./duplicates";

export const verificationStatusValidator = v.union(
  v.literal("unverified"),
  v.literal("pending"),
  v.literal("verified"),
  v.literal("failed")
);

export type DocumentVerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "failed";

/** Normalizes legacy rows that only set `isVerified`. */
export function resolveVerificationStatus(
  doc: Pick<Doc<"documents">, "isVerified" | "verificationStatus">
): DocumentVerificationStatus {
  if (doc.verificationStatus) return doc.verificationStatus;
  return doc.isVerified ? "verified" : "unverified";
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function ensureContentHash(doc: Doc<"documents">): Promise<string> {
  if (doc.contentHash) return doc.contentHash;
  const basis = `${doc.fileId ?? doc._id}:${doc.name}:${doc._creationTime}`;
  return await sha256Hex(basis);
}

async function assertIssuerEntity(
  ctx: MutationCtx,
  userId: Id<"users">,
  issuerEntityId: Id<"verifiedEntities">
) {
  const entity = await ctx.db.get(issuerEntityId);
  if (!entity || entity.verificationStatus !== "approved") {
    throw new Error("Issuer entity is not verified.");
  }
  const membership = await ctx.db
    .query("entityMembers")
    .withIndex("by_entity_user", (q) =>
      q.eq("entityId", issuerEntityId).eq("userId", userId)
    )
    .first();
  if (!membership || membership.role === "viewer") {
    throw new Error("You cannot verify on behalf of this entity.");
  }
}

export async function applyVerification(
  ctx: MutationCtx,
  userId: Id<"users">,
  doc: Doc<"documents">,
  args: {
    description?: string;
    issuerEntityId?: Id<"verifiedEntities">;
  }
): Promise<"verified" | "skipped"> {
  const current = resolveVerificationStatus(doc);
  if (current === "verified") return "skipped";

  await ctx.db.patch(doc._id, {
    verificationStatus: "pending",
    verificationFailedReason: undefined,
    verificationDescription: args.description?.trim() || undefined,
  });

  try {
    if (!doc.isVerified) {
      await recordVerificationOrThrow(ctx, userId);
    }

    if (args.issuerEntityId) {
      await assertIssuerEntity(ctx, userId, args.issuerEntityId);
    }

    const contentHash = await ensureContentHash(doc);
    const now = Date.now();

    await ctx.db.patch(doc._id, {
      contentHash,
      issuerEntityId: args.issuerEntityId,
      issuerUserId: userId,
      issuedAt: now,
      isVerified: true,
      verificationStatus: "verified",
      verifiedAt: now,
      verificationFailedReason: undefined,
    });

    await checkDuplicatesOnVerify(ctx, doc._id, contentHash, userId);
    return "verified";
  } catch (e) {
    const message = e instanceof Error ? e.message : "Verification failed.";
    await ctx.db.patch(doc._id, {
      verificationStatus: "failed",
      verificationFailedReason: message,
      isVerified: false,
    });
    throw e;
  }
}

/** Approved entities the user can issue verifications from. */
export const listMyIssuerEntities = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const memberships = await ctx.db
      .query("entityMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const entities = [];
    for (const m of memberships) {
      if (m.role === "viewer") continue;
      const entity = await ctx.db.get(m.entityId);
      if (entity?.verificationStatus === "approved") {
        entities.push({
          _id: entity._id,
          displayName: entity.displayName,
          slug: entity.slug,
          verificationLevel: entity.verificationLevel,
        });
      }
    }
    return entities;
  },
});

export const listForVerificationHub = query({
  args: {
    filter: v.optional(verificationStatusValidator),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const docs = await ctx.db
      .query("documents")
      .withIndex("by_user_trashed", (q) =>
        q.eq("userId", userId).eq("isTrashed", false)
      )
      .order("desc")
      .take(200);

    const filtered = docs.filter((doc) => {
      const status = resolveVerificationStatus(doc);
      if (!args.filter) return true;
      return status === args.filter;
    });

    return await Promise.all(
      filtered.map(async (doc) => {
        let previewUrl: string | null = null;
        if (doc.fileType?.startsWith("image/")) {
          const blobId = doc.thumbnailId ?? doc.fileId;
          if (blobId) previewUrl = await ctx.storage.getUrl(blobId);
        }
        let issuerName: string | null = null;
        if (doc.issuerEntityId) {
          const entity = await ctx.db.get(doc.issuerEntityId);
          issuerName = entity?.displayName ?? null;
        }
        return {
          ...doc,
          previewUrl,
          verificationStatus: resolveVerificationStatus(doc),
          issuerName,
        };
      })
    );
  },
});

export const submitVerification = mutation({
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

    const result = await applyVerification(ctx, userId, doc, args);
    return { status: result === "skipped" ? "verified" : result };
  },
});

export const bulkVerifyFolder = mutation({
  args: {
    folderId: v.id("folders"),
    issuerEntityId: v.optional(v.id("verifiedEntities")),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const folder = await ctx.db.get(args.folderId);
    if (!folder || folder.userId !== userId) throw new Error("Folder not found");

    const docs = (
      await ctx.db
        .query("documents")
        .withIndex("by_user_trashed", (q) =>
          q.eq("userId", userId).eq("isTrashed", false)
        )
        .collect()
    ).filter((d) => d.folderId === args.folderId);

    let verified = 0;
    let failed = 0;
    for (const doc of docs) {
      try {
        const result = await applyVerification(ctx, userId, doc, {
          description: args.description,
          issuerEntityId: args.issuerEntityId,
        });
        if (result === "verified") verified += 1;
      } catch {
        failed += 1;
        if (failed === 1) throw new Error("Verification stopped — check your plan quota or try again.");
      }
    }
    return { verified, total: docs.length, failed };
  },
});
