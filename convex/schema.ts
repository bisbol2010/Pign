import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

/**
 * v1 widen pass (SPEC.md §6 deploy 1): new tables + optional document fields.
 * No removals; `emails` kept until deliveries migration (deploy 2).
 */
export default defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    pignHandle: v.optional(v.string()),
    pignHandleChangedAt: v.optional(v.number()),
    avatarStorageId: v.optional(v.id("_storage")),
    timezone: v.optional(v.string()),
    timezoneAuto: v.optional(v.boolean()),
    dateFormat: v.optional(v.string()),
    language: v.optional(v.string()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"])
    .index("by_pign_handle", ["pignHandle"]),

  verifiedEntities: defineTable({
    type: v.union(v.literal("individual"), v.literal("company")),
    displayName: v.string(),
    slug: v.string(),
    logoStorageId: v.optional(v.id("_storage")),
    verificationStatus: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("revoked")
    ),
    verificationLevel: v.union(
      v.literal("individual_email"),
      v.literal("company_manual"),
      v.literal("company_domain"),
      v.literal("company_kyc")
    ),
    contactUserId: v.id("users"),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
    revokedAt: v.optional(v.number()),
    revocationReason: v.optional(v.string()),
    domain: v.optional(v.string()),
  })
    .index("slug", ["slug"])
    .index("contactUserId", ["contactUserId"])
    .index("verificationStatus", ["verificationStatus"]),

  entityMembers: defineTable({
    entityId: v.id("verifiedEntities"),
    userId: v.id("users"),
    role: v.union(
      v.literal("admin"),
      v.literal("sender"),
      v.literal("viewer")
    ),
    addedAt: v.number(),
  })
    .index("by_entity", ["entityId"])
    .index("by_user", ["userId"])
    .index("by_entity_user", ["entityId", "userId"]),

  folders: defineTable({
    userId: v.id("users"),
    name: v.string(),
    color: v.optional(v.string()),
    isSystem: v.boolean(),
    systemSourceDeliveryId: v.optional(v.id("deliveries")),
    isTrashed: v.optional(v.boolean()),
    trashedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  documents: defineTable({
    userId: v.id("users"),
    name: v.string(),
    fileId: v.optional(v.id("_storage")),
    fileType: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    thumbnailId: v.optional(v.id("_storage")),
    folderId: v.optional(v.id("folders")),
    contentHash: v.optional(v.string()),
    issuerEntityId: v.optional(v.id("verifiedEntities")),
    issuerUserId: v.optional(v.id("users")),
    issuedAt: v.optional(v.number()),
    copiedFromId: v.optional(v.id("documents")),
    receivedViaDeliveryId: v.optional(v.id("deliveries")),
    duplicateOfId: v.optional(v.id("documents")),
    duplicateStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("declined"),
        v.literal("auto_approved")
      )
    ),
    isVerified: v.boolean(),
    /** UI + workflow state for document verification (Phase 14). */
    verificationStatus: v.optional(
      v.union(
        v.literal("unverified"),
        v.literal("pending"),
        v.literal("verified"),
        v.literal("failed")
      )
    ),
    verifiedAt: v.optional(v.number()),
    verificationDescription: v.optional(v.string()),
    verificationFailedReason: v.optional(v.string()),
    isShared: v.boolean(),
    isTrashed: v.boolean(),
    trashedAt: v.optional(v.number()),
    lastOpenedAt: v.optional(v.number()),
    /** Pinned rows sort to the top of All files (Figma: Pin to top). */
    isPinned: v.optional(v.boolean()),
    pinnedAt: v.optional(v.number()),
    /** Opaque token for secure share links (`/s/:token`). */
    shareToken: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_trashed", ["userId", "isTrashed"])
    .index("by_user_folder", ["userId", "folderId"])
    .index("by_user_verification", ["userId", "verificationStatus"])
    .index("by_share_token", ["shareToken"])
    .index("by_hash", ["contentHash"])
    .index("by_issuer", ["issuerEntityId"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["userId"],
    }),

  documentContent: defineTable({
    documentId: v.id("documents"),
    userId: v.id("users"),
    extractedText: v.string(),
    summary: v.optional(v.string()),
    pageCount: v.optional(v.number()),
    contentHash: v.string(),
    extractedAt: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("ready"),
      v.literal("failed")
    ),
    errorMessage: v.optional(v.string()),
  })
    .index("by_document", ["documentId"])
    .index("by_hash", ["contentHash"])
    .searchIndex("search_content", {
      searchField: "extractedText",
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
    .index("by_shared_user", ["sharedWithUserId"])
    .index("by_shared_email", ["sharedWithEmail"])
    .index("by_owner", ["ownerId"]),

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

  deliveries: defineTable({
    senderUserId: v.id("users"),
    senderEntityId: v.optional(v.id("verifiedEntities")),
    recipientUserId: v.optional(v.id("users")),
    recipientEmail: v.string(),
    subject: v.optional(v.string()),
    body: v.optional(v.string()),
    documentIds: v.array(v.id("documents")),
    folderId: v.optional(v.id("folders")),
    folder: v.union(
      v.literal("inbox"),
      v.literal("outbox"),
      v.literal("drafts"),
      v.literal("pending")
    ),
    isRead: v.boolean(),
    isStarred: v.optional(v.boolean()),
    isArchived: v.optional(v.boolean()),
    isComplete: v.optional(v.boolean()),
    linkedDeliveryId: v.optional(v.id("deliveries")),
    deliveredAt: v.optional(v.number()),
  })
    .index("by_sender_folder", ["senderUserId", "folder"])
    .index("by_recipient_folder", ["recipientUserId", "folder"])
    .index("by_pending_email", ["recipientEmail", "folder"]),

  teams: defineTable({
    adminId: v.id("users"),
    name: v.string(),
    memberEmails: v.array(v.string()),
    isPinned: v.optional(v.boolean()),
    pinnedAt: v.optional(v.number()),
  }).index("by_admin", ["adminId"]),

  aiMessages: defineTable({
    userId: v.id("users"),
    documentId: v.optional(v.id("documents")),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  }).index("by_user_document", ["userId", "documentId"]),

  duplicateFlags: defineTable({
    flaggedDocumentId: v.id("documents"),
    originalDocumentId: v.id("documents"),
    ownerEntityId: v.id("verifiedEntities"),
    contentHash: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("declined"),
      v.literal("auto_approved")
    ),
    reviewedByUserId: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    reviewerNote: v.optional(v.string()),
  })
    .index("by_entity_status", ["ownerEntityId", "status"])
    .index("by_flagged_doc", ["flaggedDocumentId"]),

  distributionRecords: defineTable({
    entityId: v.id("verifiedEntities"),
    originalDocumentId: v.id("documents"),
    contentHash: v.string(),
    recipientUserId: v.id("users"),
    viaDeliveryId: v.optional(v.id("deliveries")),
    createdAt: v.number(),
  })
    .index("by_hash_recipient", ["contentHash", "recipientUserId"])
    .index("by_entity", ["entityId"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("duplicate_flagged"),
      v.literal("doc_delivered"),
      v.literal("verification_approved"),
      v.literal("verification_revoked"),
      v.literal("share_received")
    ),
    title: v.string(),
    body: v.string(),
    isRead: v.boolean(),
    linkedDocumentId: v.optional(v.id("documents")),
    linkedEntityId: v.optional(v.id("verifiedEntities")),
    linkedDeliveryId: v.optional(v.id("deliveries")),
  })
    .index("by_user", ["userId"])
    .index("by_user_unread", ["userId", "isRead"]),

  // Billing / plan state (Phase 5). One row per user, created lazily on first
  // checkout or first verification. Absence of a row == free plan. All fields
  // beyond userId/plan are optional to keep the change migration-safe (widen).
  subscriptions: defineTable({
    userId: v.id("users"),
    plan: v.union(
      v.literal("free"),
      v.literal("personal"),
      v.literal("teams"),
      v.literal("enterprise")
    ),
    // Stripe linkage.
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    // Mirror of the Stripe subscription status (active, trialing, past_due,
    // canceled, incomplete, ...). Undefined for never-subscribed free users.
    status: v.optional(v.string()),
    interval: v.optional(
      v.union(v.literal("monthly"), v.literal("annual"))
    ),
    seats: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    // Monthly verification quota tracking.
    verificationsUsed: v.optional(v.number()),
    verificationPeriodStart: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_stripe_customer", ["stripeCustomerId"]),

  auditLog: defineTable({
    actorUserId: v.id("users"),
    action: v.string(),
    targetType: v.union(
      v.literal("document"),
      v.literal("entity"),
      v.literal("delivery"),
      v.literal("share"),
      v.literal("user")
    ),
    targetId: v.string(),
    metadata: v.optional(v.any()),
  })
    .index("by_actor", ["actorUserId"])
    .index("by_target", ["targetType", "targetId"]),
});
