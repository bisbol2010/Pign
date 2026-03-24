import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  documents: defineTable({
    userId: v.id("users"),
    name: v.string(),
    fileId: v.optional(v.id("_storage")),
    fileType: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    thumbnailId: v.optional(v.id("_storage")),
    isVerified: v.boolean(),
    isShared: v.boolean(),
    isTrashed: v.boolean(),
    trashedAt: v.optional(v.number()),
    lastOpenedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_trashed", ["userId", "isTrashed"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["userId"],
    }),

  knowledge: defineTable({
    documentId: v.id("documents"),
    userId: v.id("users"),
    content: v.string(),
  }).index("by_document", ["documentId"]),

  sharedAccess: defineTable({
    documentId: v.id("documents"),
    ownerId: v.id("users"),
    sharedWithEmail: v.string(),
    sharedWithUserId: v.optional(v.id("users")),
    permission: v.union(v.literal("view"), v.literal("edit")),
  })
    .index("by_document", ["documentId"])
    .index("by_shared_user", ["sharedWithUserId"]),

  emails: defineTable({
    userId: v.id("users"),
    fromAddress: v.string(),
    toAddress: v.string(),
    subject: v.optional(v.string()),
    body: v.string(),
    attachmentIds: v.optional(v.array(v.id("_storage"))),
    isRead: v.boolean(),
    isDraft: v.boolean(),
    isSent: v.boolean(),
    folder: v.union(
      v.literal("inbox"),
      v.literal("outbox"),
      v.literal("drafts")
    ),
  }).index("by_user_folder", ["userId", "folder"]),

  teams: defineTable({
    adminId: v.id("users"),
    name: v.string(),
    memberEmails: v.array(v.string()),
  }).index("by_admin", ["adminId"]),

  aiMessages: defineTable({
    userId: v.id("users"),
    documentId: v.optional(v.id("documents")),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  }).index("by_user_document", ["userId", "documentId"]),
});
