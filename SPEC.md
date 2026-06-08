# Pign v1 — Build Spec (LOCKED 2026-05-26)

> Source of truth for the v1 build. Decisions captured here override prior conversation. Changes to this document require deliberate update (don't drift in code).

## 0. Product vision

Pign is a **registered document exchange**: a system where documents are content-addressable, traceable to a verified issuer (individual or company), and protected from forgery by global hash-based duplicate detection. The user-facing UX is a familiar mailbox (inbox, send, folders, share, AI assistant) but every "email" is really a *document transmittal* — body is the cover letter, the document is the payload — and every send is recorded in a distribution ledger that the issuing entity controls.

---

## 1. Decisions ledger (locked)

| Key | Decision |
|---|---|
| Verification onboarding (v1) | Manual admin approval of verified entities (you approve via internal mutation). Tiered model in v1.1. |
| Entity model | Separate `verifiedEntities` table + `entityMembers` join. Users can belong to N entities. |
| Duplicate behavior (verified original) | Upload allowed + flagged; owner notified; owner approve/decline; no takedown in v1. |
| Duplicate behavior (no verified original) | No flag — legitimate. |
| Pign handle | Auto-generated `firstname-lastname-NNNN@pign.app`, user-claimable vanity later. |
| Company address | `<role>@<slug>.pign.app` via wildcard DNS; BYO-domain in v1.1. |
| Delivery body | Optional. ≥1 document attached is required. |
| Recipient ownership | Recipient owns a copy on delivery; provenance metadata (`issuerEntityId`) immutable. |
| Folder delivery | Synthetic folder "From <Sender> · <date>" auto-created. |
| Revocation | Historic provenance retained; badge visually downgraded (amber "verification expired"). |
| Multi-issuer | v1 single issuer per doc. Co-signing in v1.1. |
| External notification | Sender name + doc title + plain sign-in link (no magic-link). |
| OAuth scope | Google + Resend magic link only. No Apple. |
| AI search | Lexical (full-text via Convex search index). Vector embeddings in v1.1. |
| Storage | Hard 15 GB enforced. Tiered/paid plans in v2. |
| Trash retention | 30-day auto-purge. |
| Mobile | Drawer sidebar at `< lg`; document side-panels become bottom drawers. |
| Toast | `sonner`. |
| Error tracking | Sentry. |
| Tests | Vitest + `convex-test` for backend, Playwright for 3 critical flows. |
| CI | GitHub Actions: lint + typecheck + vitest + `convex deploy --dry-run`. |
| Anonymous users | Disabled. |

---

## 2. Data model

```typescript
// convex/schema.ts (pseudocode — Convex validator syntax)

users:                                    // extends authTables.users
  name?: string
  email?: string
  image?: string
  emailVerificationTime?: number          // auth-managed
  isAnonymous?: boolean                   // disabled at provider level
  pignHandle?: string                     // unique, e.g. "taiwo-okoye-4821"
  pignHandleChangedAt?: number
  avatarStorageId?: Id<"_storage">
  → index "email", "phone", "pignHandle"

verifiedEntities:
  type: "individual" | "company"
  displayName: string                     // "Acme Bank"
  slug: string                            // unique, used in @<slug>.pign.app, lowercase, alphanumeric+hyphen
  logoStorageId?: Id<"_storage">
  verificationStatus: "pending" | "approved" | "revoked"
  verificationLevel: "individual_email" | "company_manual" | "company_domain" (v1.1) | "company_kyc" (v1.1)
  contactUserId: Id<"users">              // primary admin
  approvedBy?: Id<"users">                // Pign admin who approved
  approvedAt?: number
  revokedAt?: number
  revocationReason?: string
  domain?: string                         // null in v1
  → index "slug", "contactUserId", "verificationStatus"

entityMembers:
  entityId: Id<"verifiedEntities">
  userId: Id<"users">
  role: "admin" | "sender" | "viewer"
  addedAt: number
  → index "by_entity", "by_user", "by_entity_user" (unique pair)

folders:
  userId: Id<"users">
  name: string
  color?: string                           // hex; for v1.1 visual customization
  isSystem: boolean                        // true for auto-created "From X · date"
  systemSourceDeliveryId?: Id<"deliveries">
  → index "by_user"

documents:
  userId: Id<"users">                     // current owner
  name: string
  fileId?: Id<"_storage">
  fileType?: string                       // mime
  fileSize?: number                       // bytes
  thumbnailId?: Id<"_storage">
  folderId?: Id<"folders">
  // Verification provenance (immutable after set)
  contentHash?: string                    // SHA-256, set by extraction action
  issuerEntityId?: Id<"verifiedEntities"> // null = unverified self-upload
  issuerUserId?: Id<"users">              // who acted (for audit, even when entity issued)
  issuedAt?: number
  // Delivery lineage (when this doc is a delivered copy)
  copiedFromId?: Id<"documents">
  receivedViaDeliveryId?: Id<"deliveries">
  // Duplicate flag state
  duplicateOfId?: Id<"documents">         // set if this is a flagged copy
  duplicateStatus?: "pending" | "approved" | "declined" | "auto_approved"
  // Existing
  isTrashed: boolean
  trashedAt?: number
  lastOpenedAt?: number
  → indexes: "by_user", "by_user_trashed", "by_user_folder", "by_hash" (on contentHash), "by_issuer"
  → searchIndex "search_name" (existing)

documentContent:
  documentId: Id<"documents">
  userId: Id<"users">
  extractedText: string
  summary?: string
  pageCount?: number
  contentHash: string                     // redundant w/ documents but enables hash lookups w/o join
  extractedAt: number
  status: "pending" | "ready" | "failed"
  errorMessage?: string
  → index "by_document", "by_hash"
  → searchIndex "search_content" (on extractedText, filtered by userId)

knowledge:                                // existing — no changes
  documentId, userId, content
  → index "by_document"

sharedAccess:                             // existing schema — v1 uses only permission: "view"
  documentId, ownerId, sharedWithEmail, sharedWithUserId?, permission
  → indexes (existing)

deliveries:                               // replaces "emails" conceptually
  senderUserId: Id<"users">
  senderEntityId?: Id<"verifiedEntities">  // null = personal send; non-null = "on behalf of"
  recipientUserId?: Id<"users">            // null until matched
  recipientEmail: string                   // always set
  subject?: string
  body?: string                            // optional cover letter
  documentIds: Id<"documents">[]           // ≥1 required; server-validated
  folderId?: Id<"folders">                 // if a whole folder was sent
  folder: "inbox" | "outbox" | "drafts" | "pending"
  isRead: boolean
  isStarred?: boolean
  isArchived?: boolean
  isComplete?: boolean
  linkedDeliveryId?: Id<"deliveries">      // sender row ↔ recipient row mirror link
  deliveredAt?: number
  → indexes: "by_user_folder" (recipient/sender userId + folder), "by_pending_email" (recipientEmail where folder="pending")

aiMessages:
  userId: Id<"users">
  documentId?: Id<"documents">             // null = global chat (v1.1)
  role: "user" | "assistant"
  content: string
  → index "by_user_document"               // sort by _creationTime

duplicateFlags:
  flaggedDocumentId: Id<"documents">       // the new upload
  originalDocumentId: Id<"documents">      // the verified original
  ownerEntityId: Id<"verifiedEntities">
  contentHash: string
  status: "pending" | "approved" | "declined" | "auto_approved"
  reviewedByUserId?: Id<"users">
  reviewedAt?: number
  reviewerNote?: string
  → indexes "by_entity_status", "by_flagged_doc"

distributionRecords:
  entityId: Id<"verifiedEntities">         // issuing entity
  originalDocumentId: Id<"documents">      // the source doc
  contentHash: string
  recipientUserId: Id<"users">
  viaDeliveryId?: Id<"deliveries">
  createdAt: number
  → indexes "by_hash_recipient", "by_entity"

notifications:                             // in-app notification center
  userId: Id<"users">
  type: "duplicate_flagged" | "doc_delivered" | "verification_approved" | "verification_revoked" | "share_received"
  title: string
  body: string
  isRead: boolean
  linkedDocumentId?: Id<"documents">
  linkedEntityId?: Id<"verifiedEntities">
  linkedDeliveryId?: Id<"deliveries">
  → index "by_user", "by_user_unread"

auditLog:                                  // minimal v1
  actorUserId: Id<"users">
  action: string                           // literal union; see § 3.12
  targetType: "document" | "entity" | "delivery" | "share" | "user"
  targetId: string
  metadata?: any                            // small JSON
  → index "by_actor", "by_target"
```

Note: `...authTables` is spread first, then `users` is overridden with the extended definition above. Per `@convex-dev/auth` docs, the required auth fields are preserved.

---

## 3. Convex function inventory

Format: `module.function({ args })` — *caller* | *side-effects*. All check `getAuthUserId(ctx)` unless marked **internal**.

### 3.1 Auth (`convex/auth.ts`)
- `auth, signIn, signOut, store, isAuthenticated` (existing exports — no changes).
- Provider list: `Password({ verify: Resend })`, `Resend`, `Google`. **Remove `Apple`.**
- Add a `createOrUpdateUser` callback that:
  - Allocates `pignHandle` on first creation (collision-resolved with `-NNNN` suffix).
  - Calls `internal.deliveries.flushPending({ userId, email })` after a successful new-user creation.
  - Calls `internal.shared.linkPendingShares({ userId, email })`.

### 3.2 Users (`convex/users.ts`)
| Function | Args | Caller | Notes |
|---|---|---|---|
| `currentUser` (query) | — | any | Returns whitelisted user with `pignHandle`. |
| `updateName` (mutation) | `{ name }` | self | existing |
| `updateAvatar` (mutation) | `{ storageId }` | self | new |
| `removeAvatar` (mutation) | — | self | new |
| `generateAvatarUploadUrl` (mutation) | — | self | new |
| `claimVanityHandle` (mutation) | `{ handle }` | self | new; validates uniqueness, regex `^[a-z0-9-]{3,30}$`. |
| `requestEmailChange` (mutation) | `{ newEmail }` | self | new; emits one-time code via Resend. |
| `confirmEmailChange` (mutation) | `{ code }` | self | new; updates `users.email` and the associated `authAccounts.providerAccountId`. |
| `lookupByEmail` (internal query) | `{ email }` | internal | for delivery/share JIT mapping. |

### 3.3 Entities (`convex/entities.ts` — new)
| Function | Args | Caller | Notes |
|---|---|---|---|
| `myEntities` (query) | — | any | Returns entities the caller is a member of. |
| `getEntityBySlug` (query) | `{ slug }` | public-ish | For display next to a doc badge. |
| `requestVerification` (mutation) | `{ type, displayName, requestedSlug, contactEmail }` | self | Creates a `verifiedEntities` row in `pending` status. Notifies Pign admin. |
| `approveEntity` (admin mutation) | `{ entityId, level }` | **admin-only** | Patches status to `approved`. Sends `verification_approved` notification + Resend email. |
| `revokeEntity` (admin mutation) | `{ entityId, reason }` | **admin-only** | Patches status to `revoked`. Sends notification. |
| `listPendingEntities` (admin query) | — | **admin-only** | For admin dashboard. |
| `addMember` (mutation) | `{ entityId, userId, role }` | entity admin | |
| `removeMember` (mutation) | `{ entityId, userId }` | entity admin | |
| `setMemberRole` (mutation) | `{ entityId, userId, role }` | entity admin | |
| `getMembers` (query) | `{ entityId }` | entity members | |

**Admin gate**: hard-coded list of admin user IDs in an env var `PIGN_ADMIN_USER_IDS`, checked at function entry via a helper `requireAdmin(ctx)`.

### 3.4 Documents (`convex/documents.ts`)
| Function | Args | Caller | Notes |
|---|---|---|---|
| `list` (query) | `{ folderId? }` | self | Existing, add optional folder filter. Excludes trashed. |
| `getRecent` (query) | — | self | Existing. |
| `getById` (query) | `{ id }` | self **OR shared-with-me recipient** | Widened ownership check. |
| `search` (query) | `{ query }` | self | Calls name search + full-text search, merges. |
| `storageUsage` (query) | — | self | Existing. |
| `create` (mutation) | `{ name, fileId?, fileType?, fileSize?, folderId?, issueOnBehalfOfEntityId? }` | self | If `issueOnBehalfOfEntityId` is set, caller must be `admin`/`sender` of that approved entity; sets `issuerEntityId` + `issuerUserId` + `issuedAt`. **Quota check fires here.** Schedules `extract.run`. |
| `rename` (mutation) | `{ id, name }` | owner | |
| `markOpened` (mutation) | `{ id }` | self **OR shared recipient** | |
| `moveToTrash` (mutation) | `{ id }` | owner | |
| `restoreFromTrash` (mutation) | `{ id }` | owner | new |
| `moveToFolder` (mutation) | `{ id, folderId? }` | owner | new |
| `generateUploadUrl` (mutation) | — | self | Existing + quota check. |
| `getFileUrl` (query) | `{ documentId }` | owner **OR shared recipient** | Widened. |
| `verify` (mutation) | `{ id, issuerEntityId? }` | owner | Sets `contentHash`, `issuerEntityId`, `issuedAt`. |
| `bulkVerifyFolder` (mutation) | `{ folderId, issuerEntityId? }` | owner | Loops folder docs, calls `verify` for each. |
| `purgeOldTrash` (internal mutation) | — | scheduled | Deletes docs with `isTrashed && trashedAt < now - 30d`. Cascades content/knowledge/storage. |

### 3.5 Document content & extraction
**`convex/extract.ts` (Node action) + `convex/documentContent.ts`**

| Function | Args | Caller | Notes |
|---|---|---|---|
| `run` (action, `"use node"`) | `{ documentId }` | scheduled | Reads storage, computes SHA-256, calls OpenAI `gpt-4o-mini` vision for OCR + summary. |
| `internal.documentContent.insertPending` | `{ documentId }` | internal | |
| `internal.documentContent.finalize` | `{ documentId, contentHash, extractedText, summary, pageCount }` | internal | Writes content + patches `documents.contentHash`. **Triggers `internal.duplicates.checkOnIngest`.** |
| `internal.documentContent.fail` | `{ documentId, errorMessage }` | internal | |
| `getByDocument` (query) | `{ documentId }` | owner OR shared recipient | |

### 3.6 Duplicates (`convex/duplicates.ts` — new)
| Function | Args | Caller | Notes |
|---|---|---|---|
| `internal.duplicates.checkOnIngest` | `{ documentId, contentHash }` | internal | If a verified original exists with same hash AND uploader has no matching distribution record → flag pending + notify owner. |
| `listFlags` (query) | `{ entityId, status? }` | entity admin/sender | |
| `approveFlag` (mutation) | `{ flagId, note? }` | entity admin/sender | Sets flag `approved`, creates a `distributionRecord` (entity → uploader). |
| `declineFlag` (mutation) | `{ flagId, note? }` | entity admin/sender | Sets flag `declined`, patches `documents.duplicateStatus = "declined"` on flagged doc. |

### 3.7 Folders (`convex/folders.ts` — new)
| Function | Args | Caller | Notes |
|---|---|---|---|
| `list` (query) | — | self | |
| `getById` (query) | `{ id }` | owner | |
| `listDocsInFolder` (query) | `{ folderId }` | owner | |
| `create` (mutation) | `{ name }` | self | Name unique per user. |
| `rename` (mutation) | `{ id, name }` | owner | |
| `remove` (mutation) | `{ id }` | owner | Nulls `folderId` on contained docs; does not delete them. |
| `internal.folders.createSystemFolder` | `{ userId, name, deliveryId }` | internal | For "From X · date" auto-folders. |

### 3.8 Shared access (`convex/shared.ts`)
| Function | Args | Caller | Notes |
|---|---|---|---|
| `listSharedByMe` (query) | — | self | existing |
| `listSharedWithMe` (query) | — | self | existing |
| `listSharedWithMeWithDocs` (query) | — | self | new; joins for UI |
| `listByDocument` (query) | `{ documentId }` | owner | new |
| `share` (mutation) | `{ documentId, sharedWithEmail }` | owner | Permission locked to `"view"`. Sets `sharedWithUserId` if user exists. Creates `notifications` row. |
| `revokeAccess` (mutation) | `{ id }` | owner | existing |
| `internal.shared.linkPendingShares` | `{ userId, email }` | internal | Called on user signup. |

### 3.9 Deliveries (`convex/deliveries.ts` — replaces emails.ts)
**Migration**: existing `emails` rows are migrated to `deliveries` during the schema cutover (see § 6).

| Function | Args | Caller | Notes |
|---|---|---|---|
| `listMyInbox` (query) | `{ filter?: "unread" \| "starred" \| "archived" \| "complete" }` | self | |
| `listMyOutbox` (query) | — | self | |
| `listMyDrafts` (query) | — | self | |
| `getById` (query) | `{ id }` | sender or recipient | |
| `send` (mutation) | `{ recipientEmail, subject?, body?, documentIds, folderId?, asEntityId? }` | self | **Validates `documentIds.length >= 1`.** If `asEntityId`, caller must be admin/sender of approved entity. Recipient lookup by email → if user exists, write inbox row + delivery record; else write `pending`. **For each delivered doc, creates a copy owned by recipient** with `copiedFromId`, immutable `issuerEntityId`. **Creates system folder** for the bundle. **Sends out-of-band Resend notification.** **Writes `distributionRecord` rows.** |
| `saveDraft` (mutation) | `{ recipientEmail?, subject?, body?, documentIds? }` | self | No doc-required check on drafts. |
| `markRead` (mutation) | `{ id }` | recipient | |
| `toggleStar` (mutation) | `{ id }` | recipient or sender | |
| `toggleArchive` (mutation) | `{ id }` | recipient | |
| `markComplete` (mutation) | `{ id }` | recipient | |
| `remove` (mutation) | `{ id }` | sender (for drafts) OR recipient | |
| `getAttachmentUrl` (query) | `{ deliveryId, documentId }` | sender or recipient | Replaces `emails.getAttachmentUrl`. |
| `internal.deliveries.flushPending` | `{ userId, email }` | internal (called on signup) | Materializes `pending` deliveries into inbox. |
| `internal.deliveries.purgeOldPending` | — | scheduled (90 days) | |

### 3.10 Teams (`convex/teams.ts` — minor extensions)
| Function | Args | Caller | Notes |
|---|---|---|---|
| `list, create, addMember, removeMember, remove` | — | self | Existing. |
| `sendToTeam` (mutation) | `{ teamId, subject?, body?, documentIds, asEntityId? }` | team admin | Fans out to N `deliveries.send` calls. |
| `shareToTeam` (mutation) | `{ teamId, documentId }` | team admin | Fans out to N `shared.share` calls. |

### 3.11 AI (`convex/ai.ts` + `convex/aiMessages.ts`)
| Function | Args | Caller | Notes |
|---|---|---|---|
| `aiMessages.listForDocument` (query) | `{ documentId, limit? }` | doc owner | Returns last 50. |
| `aiMessages.appendUser` (mutation) | `{ documentId, content }` | doc owner | Inserts user message, schedules `ai.respond`. |
| `internal.aiMessages.appendAssistant` | `{ documentId, userId, content }` | internal | |
| `internal.aiMessages.pruneOldest` | `{ userId, documentId, keep: 50 }` | internal | |
| `ai.respond` (action, internal) | `{ documentId, userId }` | scheduled | Reads last 10 messages + knowledge + `documentContent.extractedText`. Calls OpenAI `gpt-4o`. Appends assistant message. |

### 3.12 Audit (`convex/audit.ts` — new)
| Function | Args | Caller | Notes |
|---|---|---|---|
| `internal.audit.log` | `{ actorUserId, action, targetType, targetId, metadata? }` | internal | Called from every mutating function. |

Actions logged: `doc.create, doc.rename, doc.trash, doc.restore, doc.move_folder, doc.verify, doc.delete, entity.request, entity.approve, entity.revoke, entity.add_member, entity.remove_member, share.grant, share.revoke, delivery.send, delivery.draft, delivery.archive, duplicate.flag, duplicate.approve, duplicate.decline.`

### 3.13 Notifications (`convex/notifications.ts` — new)
| Function | Args | Caller | Notes |
|---|---|---|---|
| `listUnread` (query) | — | self | |
| `listAll` (query) | `{ limit? }` | self | |
| `markRead` (mutation) | `{ id }` | self | |
| `markAllRead` (mutation) | — | self | |
| `internal.notifications.create` | `{ userId, type, title, body, links? }` | internal | |

### 3.14 Scheduled (`convex/crons.ts`)
- `purgeOldTrash` — daily 03:00.
- `purgeOldPendingDeliveries` — daily 03:30.
- `cleanupOrphanedContent` — weekly Sunday (sweeps `documentContent` whose `documentId` no longer exists).

---

## 4. UI surfaces

### 4.1 Routes

| Route | Type | Figma frame | Status |
|---|---|---|---|
| `/` | server | _populate from frame-map_ | unchanged copy possibly refreshed |
| `/login`, `/signup` | server + client form | _populate_ | refresh: Google + Resend buttons |
| `/dashboard` | client | _populate_ | Folders tab functional; placeholder toolbar buttons wired |
| `/folder/[id]` | client | _populate_ | NEW. Folder contents view with "Verify all." |
| `/document/[id]` | client | _populate_ | Modified: verification badge + Share/Verify buttons; mobile drawers |
| `/shared` | client | _populate_ | tabs "Shared with me" / "Shared by me" |
| `/inbox`, `/outbox`, `/drafts`, `/archive` | client | _populate_ | Replaces `/emails`. Or single `/inbox?folder=` — implementer's call |
| `/inbox/[id]`, `/outbox/[id]` | client | _populate_ | Delivery detail view with attached docs |
| `/teams` | client | _populate_ | send-to-team + share-to-team flows |
| `/entities` | client | _populate_ | NEW. Manage entities you belong to + request verification |
| `/entities/[id]/duplicates` | client | _populate_ | NEW. Entity admin: review pending duplicate flags |
| `/admin/entities` | client | _populate_ | NEW. Pign admin only |
| `/notifications` | client | _populate_ | NEW. In-app notification center |
| `/settings` | client | _populate_ | Avatar, vanity handle, email change |
| `/trash` | client | _populate_ | 30-day retention countdown |

### 4.2 Components (new)

- `components/document/VerificationBadge.tsx` — see § 4.3 for states.
- `components/document/ShareModal.tsx`
- `components/delivery/ComposeDelivery.tsx` — replaces `ComposeEmail`.
- `components/delivery/AttachmentPicker.tsx`
- `components/duplicates/DuplicateFlagsList.tsx`
- `components/admin/PendingEntities.tsx`
- `components/entities/RequestVerificationForm.tsx`
- `components/notifications/NotificationBell.tsx` + `NotificationDrawer.tsx`
- `components/ui/Toaster.tsx` — `sonner` wrapper.
- `components/layout/MobileDrawer.tsx`

### 4.3 Verification badge specification

| State | Visual | Tooltip |
|---|---|---|
| Unverified | (no badge) | — |
| Verified, status=approved | Green ✓ + "Verified by Acme Bank" | "Issued by Acme Bank on 2026-05-26. This document is registered with Pign and traceable to its issuer." |
| Verified, status=revoked | Amber ⚠ + "Verified by Acme Bank (verification expired Apr 2027)" | "Acme Bank was a verified entity when this document was issued. Their verification status has since expired." |
| Duplicate, status=pending | Yellow flag + "Possible duplicate" | "A document with this content is registered to Acme Bank. Awaiting review." |
| Duplicate, status=declined | Red ✗ + "Disputed by Acme Bank" | "The verified owner has declined this copy as unauthorized." |
| Duplicate, status=approved/auto_approved | Green ✓ + "Verified by Acme Bank (received)" | "Acme Bank confirmed you received this document." |

---

## 5. Build order (week-by-week)

| Wk | Theme | Deliverables |
|---|---|---|
| **1** | Foundations + design tokens | F0 (toast, Sentry, CI, vitest, npm audit, README rewrite). Schema migration step 1 (widen — add new tables empty, no breaking removals). Extract design tokens from Figma into `tailwind.config.ts`. |
| **2** | Core ops + extraction | Content extraction (F1), quota enforcement, first tests. Plumb extraction into upload. |
| **3** | Entities + admin | `verifiedEntities`, `entityMembers`, `/entities`, `/admin/entities`, `requestVerification`, `approveEntity`, audit log. |
| **4** | Verification + duplicates | `documents.verify`, `bulkVerifyFolder`, `duplicates.checkOnIngest`, `/entities/[id]/duplicates`, badge component. Backfill existing test docs as "Verified by self." |
| **5** | Deliveries | `deliveries` table, migrate `emails`, `ComposeDelivery`, attachment requirement, system folders on receive, Resend out-of-band, JIT pending-flush on signup. |
| **6** | Sharing + folders + teams | Share modal, shared-with-me page widening `getById` for recipients, folders end-to-end, team fan-out. |
| **7** | AI persistence + cross-doc search | Wire `aiMessages` + lexical search. |
| **8** | Auth + UX polish + mobile | Real OAuth + magic link in prod, settings completion, mobile drawers, notification center, Playwright tests. |
| **9** | Launch hardening | Sentry tuning, performance pass, manual security review of widened ownership checks, prod deploy checklist. |

---

## 6. Migration plan (widen → migrate → narrow)

Reference the `convex-migration-helper` skill at execution time.

1. **Deploy 1 — widen.** Add all new tables and new fields (all optional). No deletions, no narrowed types. Existing code keeps running.
2. **Backfill — entity allocation.** For each existing user, allocate `pignHandle`. For each verified-email user, create a `verifiedEntities` row of type `individual`, status `approved`, level `individual_email`. Add the user as the entity admin in `entityMembers`.
3. **Backfill — content hashing.** For each existing doc with `fileId`, schedule `extract.run`.
4. **Backfill — emails to deliveries.** Migrate each `emails` row to `deliveries`. Grandfather existing emails without doc attachments as drafts.
5. **Deploy 2 — switch.** UI reads from `deliveries`; queries from `emails` removed.
6. **Deploy 3 — narrow.** Drop `emails` table; tighten optional fields; enforce uniqueness in mutations.

Each deploy must pass `npx convex deploy --dry-run` in CI before merge.

---

## 7. External dependencies & env

### npm (additions)
`sonner`, `@sentry/nextjs`, `@sentry/node`, `vitest`, `convex-test`, `@playwright/test`, `@convex-dev/migrations`.

### Convex env (prod + dev separately)
- `JWT_PRIVATE_KEY`, `JWKS` (existing)
- `SITE_URL` (existing)
- `OPENAI_API_KEY`
- `AUTH_RESEND_KEY`, `AUTH_EMAIL_FROM="Pign <noreply@pign.app>"`
- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
- `PIGN_ADMIN_USER_IDS="<your-userId>,..."`
- `SENTRY_DSN`

### `.env.local`
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=1`
- `NEXT_PUBLIC_AUTH_RESEND_ENABLED=1`
- `NEXT_PUBLIC_AUTH_APPLE_ENABLED=0` (or remove)
- `NEXT_PUBLIC_SENTRY_DSN`

### Third-party setup
- [ ] Register and DNS-configure `pign.app` (or chosen domain) with Resend (DKIM, SPF, return-path).
- [ ] Add wildcard DNS A/CNAME for `*.pign.app`.
- [ ] Create Google OAuth credentials, set redirect to Convex deployment.
- [ ] Create Sentry projects: `pign-frontend`, `pign-backend`.

---

## 8. Acceptance criteria

- **Auth**: sign up via Google works; sign up via password+verify works; magic link arrives in <30s; logout invalidates session; protected routes redirect to `/login`.
- **Quota**: upload that crosses 15 GB is rejected server-side; sidebar bar goes red at ≥ 90%.
- **Extraction**: upload PDF → within 60s status is `"ready"`; AI chat references actual content; full-text search finds extracted words.
- **Entity request → approval**: user requests `Acme Bank`; admin sees it in `/admin/entities`; approves; requester gets in-app + Resend notification.
- **Verification**: verified entity admin issues doc → doc has green badge. Folder bulk-verify verifies all listed docs in one mutation.
- **Duplicate detection**: User B uploads file matching Acme's verified doc → "Possible duplicate" badge for B; pending flag for Acme. Acme approves → B's doc upgrades to "Verified by Acme (received)." Acme declines → B's doc shows "Disputed by Acme."
- **Distribution lineage**: Acme sends doc to Taiwo; Taiwo re-uploads same file → no flag.
- **Delivery**: send to Pign user → inbox row + Resend external email. Send to non-user → outbox "Pending"; on signup, materializes within 5s.
- **Share**: owner shares doc to email → recipient sees it in "Shared with me," can open viewer read-only. Revoke → access lost immediately.
- **Folder**: create folder, move 3 docs in, delete folder → docs back at root.
- **Trash retention**: doc trashed 31 days ago is purged on next cron run; storage cleaned up.
- **Mobile**: dashboard, document viewer, inbox all usable at 375 px width; Lighthouse mobile ≥ 85.

---

## 9. Post-v1 roadmap

| When | What | Notes |
|---|---|---|
| **v1.1** | Tiered verification | Replace manual-only with self-serve: `individual_email`, `company_domain` (DNS TXT), `company_kyc` (Persona/Stripe Identity). |
| **v1.1** | BYO-domain for companies | Pricing hook: "Use your own domain — €10/mo." |
| **v1.1** | Vector embeddings | `documentContent.embedding` + Convex vector index. Hybrid lexical+vector search. |
| **v1.1** | Multi-issuer / co-signing | Extract `issuerEntityId` to a `documentIssuers` join table. |
| **v1.1** | Takedown requests | When abuse pattern emerges. |
| **v1.1** | Apple sign-in | When Apple Developer account in place. |
| **v2** | Storage tiers / upsell | Free 15 GB / Pro 100 GB / Enterprise. Stripe + billing. Reframe storage bar as "Upgrade." |
| **v2** | Audit log expansion + DPA | 365-day retention; export tools; SOC2-readiness. |
| **v2** | Document signing | Pign as e-sign provider. |
| **v2** | Public-link sharing | No Pign account required for recipient — tradeoff: dilutes "registered" trust. |
| **v2** | Mobile apps (iOS/Android) | Convex SDKs for both. |

---

## 10. Open risks & mitigations

1. **Schema migration scope** — largest single change in project's life. Follow widen-migrate-narrow rigorously; preview deployment first; one feature per deploy.
2. **OpenAI cost** — content extraction at scale could be $0.50–$2 per 100 docs. Kill switch `NEXT_PUBLIC_EXTRACTION_ENABLED`; rate limit per-user.
3. **Wildcard DNS for `*.pign.app`** — if provider doesn't support wildcards cleanly, fall back to path-style (`acme/payroll@pign.app`). Decide at DNS-setup time.
4. **Resend deliverability** — warm up the sender domain; encourage users to allowlist `@pign.app`.
5. **Duplicate-detection false positives on templates** — if a verified entity uploads a common template, every subsequent upload triggers a flag. Mitigation: if a doc has >10 pending flags in 30 days, auto-suggest "disable verification on this doc." Defer to v1.1.
6. **`getById` widening security** — extending ownership to "shared recipients" is a recurring foot-gun. Write a single `assertCanReadDocument(ctx, docId)` helper; add a Vitest test that fuzzes every doc-reading function with both authorized and unauthorized callers.
7. **Distribution lineage replay** — recipient receives a doc, deletes it, someone else uploads same hash. Tie distribution records to live deliveries; on doc deletion by recipient, mark the record `revoked`.

---

## 11. How to use this doc

1. As source of truth for v1. Anything outside this scope is v1.1.
2. As input to future Agent-mode sessions: "Start Week N from SPEC.md."
3. As executive-review artifact: §§ 0–2 + § 9 are the high-level read; engineers care about §§ 3, 6, 7; designers care about § 4 + the badge spec + `design/` folder.
