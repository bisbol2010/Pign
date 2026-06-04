import { v } from "convex/values";
import { query, type QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "./_generated/dataModel";

const searchFilter = v.union(
  v.literal("files"),
  v.literal("folders"),
  v.literal("emails"),
  v.literal("verified"),
  v.literal("people")
);

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
      if (doc.fileType?.startsWith("image/")) {
        const blobId = doc.thumbnailId ?? doc.fileId;
        if (blobId) previewUrl = await ctx.storage.getUrl(blobId);
      }
      return { ...doc, previewUrl };
    })
  );
}

function includesQuery(text: string, q: string) {
  return text.toLowerCase().includes(q.toLowerCase());
}

function snippetAround(text: string, q: string, maxLen = 80) {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());
  if (idx < 0) return text.slice(0, maxLen);
  const start = Math.max(0, idx - 24);
  const end = Math.min(text.length, idx + q.length + 40);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";
  return `${prefix}${text.slice(start, end)}${suffix}`;
}

export const run = query({
  args: {
    query: v.string(),
    filters: v.optional(v.array(searchFilter)),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { files: [], folders: [], emails: [], people: [] };
    }

    const q = args.query.trim();
    if (!q) {
      return { files: [], folders: [], emails: [], people: [] };
    }

    const limit = args.limit ?? 50;
    const active = new Set(args.filters ?? []);
    const searchAll = active.size === 0;

    const wantFiles =
      searchAll || active.has("files") || active.has("verified");
    const requireVerified = active.has("verified") && !searchAll;
    const wantFolders = searchAll || active.has("folders");
    const wantEmails = searchAll || active.has("emails");
    const wantPeople = searchAll || active.has("people");

    const fileIds = new Set<Id<"documents">>();
    const fileMatches = new Map<
      Id<"documents">,
      { matchIn: ("name" | "content")[]; snippet?: string }
    >();

    if (wantFiles) {
      const byName = await ctx.db
        .query("documents")
        .withSearchIndex("search_name", (s) =>
          s.search("name", q).eq("userId", userId)
        )
        .take(limit);

      for (const doc of byName) {
        if (doc.isTrashed) continue;
        fileIds.add(doc._id);
        const prev = fileMatches.get(doc._id);
        fileMatches.set(doc._id, {
          matchIn: [...(prev?.matchIn ?? []), "name"],
          snippet: prev?.snippet,
        });
      }

      const contentHits = await ctx.db
        .query("documentContent")
        .withSearchIndex("search_content", (s) =>
          s.search("extractedText", q).eq("userId", userId)
        )
        .take(limit);

      for (const row of contentHits) {
        if (row.status !== "ready") continue;
        const doc = await ctx.db.get(row.documentId);
        if (!doc || doc.userId !== userId || doc.isTrashed) continue;
        fileIds.add(doc._id);
        const prev = fileMatches.get(doc._id);
        fileMatches.set(doc._id, {
          matchIn: [...(prev?.matchIn ?? []), "content"],
          snippet:
            prev?.snippet ??
            snippetAround(row.extractedText, q),
        });
      }
    }

    const files: Array<
      Doc<"documents"> & {
        previewUrl: string | null;
        matchIn: ("name" | "content")[];
        snippet?: string;
      }
    > = [];

    if (wantFiles && fileIds.size > 0) {
      const docs = await Promise.all(
        [...fileIds].slice(0, limit).map((id) => ctx.db.get(id))
      );
      const nonTrashed = docs.filter(
        (d): d is Doc<"documents"> =>
          d !== null &&
          !d.isTrashed &&
          (!requireVerified || d.isVerified)
      );
      const withPreviews = await withPreviewUrls(ctx, nonTrashed);
      for (const doc of withPreviews) {
        const meta = fileMatches.get(doc._id);
        files.push({
          ...doc,
          matchIn: meta?.matchIn ?? ["name"],
          snippet: meta?.snippet,
        });
      }
      files.sort((a, b) => b._creationTime - a._creationTime);
    }

    const folders: Array<Doc<"folders"> & { matchIn: "name"[] }> = [];
    if (wantFolders) {
      const allFolders = await ctx.db
        .query("folders")
        .withIndex("by_user", (idx) => idx.eq("userId", userId))
        .collect();
      for (const folder of allFolders) {
        if (folder.isTrashed) continue;
        if (!includesQuery(folder.name, q)) continue;
        folders.push({ ...folder, matchIn: ["name"] });
        if (folders.length >= limit) break;
      }
    }

    const emails: Array<
      Doc<"deliveries"> & {
        matchIn: ("subject" | "body" | "address")[];
        snippet?: string;
      }
    > = [];
    if (wantEmails) {
      // Mail now lives in `deliveries` (inbox = recipient, outbox/drafts =
      // sender). Search both perspectives and dedupe by delivery id.
      const received = await ctx.db
        .query("deliveries")
        .withIndex("by_recipient_folder", (idx) =>
          idx.eq("recipientUserId", userId)
        )
        .take(200);
      const sent = await ctx.db
        .query("deliveries")
        .withIndex("by_sender_folder", (idx) => idx.eq("senderUserId", userId))
        .take(200);

      const seenDeliveries = new Set<string>();
      const allDeliveries = [...received, ...sent].filter((d) => {
        if (seenDeliveries.has(d._id)) return false;
        seenDeliveries.add(d._id);
        return true;
      });
      allDeliveries.sort((a, b) => b._creationTime - a._creationTime);

      for (const delivery of allDeliveries) {
        const matchIn: ("subject" | "body" | "address")[] = [];
        let snippet: string | undefined;
        if (delivery.subject && includesQuery(delivery.subject, q)) {
          matchIn.push("subject");
          snippet = snippet ?? snippetAround(delivery.subject, q);
        }
        if (delivery.body && includesQuery(delivery.body, q)) {
          matchIn.push("body");
          snippet = snippet ?? snippetAround(delivery.body, q);
        }
        if (includesQuery(delivery.recipientEmail, q)) {
          matchIn.push("address");
        }
        if (matchIn.length === 0) continue;
        emails.push({ ...delivery, matchIn, snippet });
        if (emails.length >= limit) break;
      }
    }

    const people: Array<{
      email: string;
      documentId?: Id<"documents">;
      documentName?: string;
    }> = [];
    if (wantPeople) {
      const accessRows = await ctx.db
        .query("sharedAccess")
        .withIndex("by_owner", (idx) => idx.eq("ownerId", userId))
        .collect();
      const seen = new Set<string>();
      for (const row of accessRows) {
        if (!includesQuery(row.sharedWithEmail, q)) continue;
        if (seen.has(row.sharedWithEmail)) continue;
        seen.add(row.sharedWithEmail);
        const doc = await ctx.db.get(row.documentId);
        people.push({
          email: row.sharedWithEmail,
          documentId: row.documentId,
          documentName: doc?.name,
        });
        if (people.length >= limit) break;
      }
    }

    return { files, folders, emails, people };
  },
});
