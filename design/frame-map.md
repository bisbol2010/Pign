# Figma frame map

Because the Figma file uses default/auto-generated frame names ("Frame 12", "Component 4", etc.), this file is the authoritative cross-walk between **Figma node IDs** and the **semantic names** we use in the repo.

## How this gets populated

1. User installs Figma MCP and pastes the Figma file URL into chat.
2. Agent calls `get_figma_data` (or equivalent) to list every top-level frame.
3. Agent exports each top-level frame as a PNG to `design/screens/`.
4. User + agent name each row below by looking at the PNG.
5. Once named, every PR that touches a screen references the **semantic name**, not the Figma URL.

## Table

| Semantic name | Figma node-id | Figma URL | PNG in repo | Status | Notes |
|---|---|---|---|---|---|
| `landing/page` (master) | `1234:1440` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=1234-1440) | `design/screens/_inventory/linked-node-1234-1440.png` | `implemented` | Composes the 7 sections below. Routed at `/` via `app/page.tsx`. |
| `landing/hero` | `1234:1600` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=1234-1600) | — | `implemented` | `components/landing/Hero.tsx` + `MarketingHeader.tsx` + `GridBackdrop.tsx`. Mailbox SVG at `public/landing/mailbox-illustration.svg`. |
| `landing/benefits` | `1234:1575` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=1234-1575) | — | `implemented` | `components/landing/Benefits.tsx`. Combines the "Avoid junk emails ★ Filter priority mails ★ Smart AI verification" band + tabs + 7-bullet card. Side illustration at `public/landing/benefits-illustration.svg`. |
| `landing/features` | `1234:1464` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=1234-1464) | — | `implemented` | `components/landing/Features.tsx`. Uses `public/landing/features-wave-bg.svg`, `features-folder.svg`, `features-document.svg`, `curved-arrow.svg`. |
| `dashboard/folders-list` | `329:1956` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=329-1956) | — | `implemented` | Folders tab list view — `components/folders/*`, `app/(dashboard)/dashboard/page.tsx`. |
| `dashboard/folders-grid` | `331:2632` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=331-2632) | — | `implemented` | Folders tab grid view — same components, grid toggle. |
| `dashboard/create-folder` | `2390:1909` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=2390-1909) | — | `implemented` | New folder modal — `components/folders/CreateFolderModal.tsx`. |
| `dashboard/files-empty` | `2390:2350` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=2390-2350) | — | `implemented` | Files tab zero documents — `components/empty/FilesEmptyState.tsx`, `app/(dashboard)/dashboard/page.tsx`. |
| `dashboard/folders-empty` | `2390:2584` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=2390-2584) | — | `implemented` | Folders tab zero folders — `components/empty/FoldersEmptyState.tsx`, `components/folders/FoldersView.tsx`. |
| `dashboard/recent-empty` | `2390:2725` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=2390-2725) | — | `implemented` | Recent header, no black carousel — `components/files/RecentFiles.tsx`. |
| `dashboard/recent-collapsed` | `328:692` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=328-692) | — | `implemented` | Collapsed recent (chevron, no panel) — `components/files/RecentFiles.tsx`. |
| `dashboard/upload-on-click` | `362:4107` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=362-4107) | — | `implemented` | Upload in progress bar — `components/upload/UploadProgressPanel.tsx`. |
| `dashboard/upload-success` | `363:4829` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=363-4829) | — | `implemented` | Success toast — `components/upload/UploadStatusBanner.tsx`. |
| `dashboard/upload-failed` | `363:5080` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=363-5080) | — | `implemented` | Failed toast with retry — `components/upload/UploadStatusBanner.tsx`. |
| `dashboard/file-actions` | `2754:540` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=2754-540) | — | `implemented` | File actions section — `components/file-actions/*`, list/grid context menu + properties panel. Sub-frames: Copy link `381:6851`, Download `379:5904`, Move `380:6522`, Remove user `380:6205`. |
| `verification/hub-unverified` | `427:1395` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=427-1395) | — | `implemented` | Verification hub — tabs Verified/Pending/Unverified, Verify now rows — `components/verification/VerifiedFilesView.tsx`, `/verification`. |
| `verification/hub-verified` | `379:5462` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=379-5462) | — | `implemented` | Verified tab + DATE VERIFIED column — same hub component. |
| `verification/verify-file-modal` | `431:1756` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=431-1756) | — | `implemented` | 3-step verify flow — `VerifyFileModal.tsx`, wired from FileRow, upload banner, context menu, properties, viewer. |
| `notification/all` | `532:9` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=532-9) | — | `implemented` | All notifications page — `components/notifications/*`, `app/(dashboard)/notifications/page.tsx`. Unread rows grey-7/60; grouped Today/date; back arrow + "All Notifications". |
| `notification/dropdown` | `518:4870` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=518-4870) | — | `implemented` | Bell dropdown panel — `NotificationDropdown.tsx` in TopBar. Header "Notification", recent rows, "View all" → `/notifications`. |
| `viewer/image` | `518:4047` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=518-4047) | — | `implemented` | Image viewer — `components/viewer/*`, `/document/[id]`. Full-bleed image, toolbar, nav arrows, fullscreen. |
| `viewer/document` | `518:4374` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=518-4374) | — | `implemented` | PDF/doc viewer — iframe embed + print menu + content hash in toolbar. |
| `viewer/permission-denied` | `549:2084` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=549-2084) | — | `implemented` | Permission denied overlay — `PermissionDenied.tsx`; Convex `documents.getForViewer` returns `denied`. |
| `teams/list` | `331:3256` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=331-3256) | — | `implemented` | Teams list — `components/teams/*`, `app/(dashboard)/teams/page.tsx`. |
| `teams/create` | `331:5946` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=331-5946) | — | `implemented` | New team modal — `components/teams/CreateTeamModal.tsx`. |
| `teams/property` | `331:5082` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=331-5082) | — | `implemented` | Team properties panel — `components/teams/TeamPropertiesPanel.tsx`. |
| `teams/grid` | `331:4567` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=331-4567) | — | `implemented` | Teams grid toggle — `components/teams/TeamGrid.tsx`. |
| `shared/list` | `359:3154` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=359-3154) | — | `implemented` | Shared files list — `components/shared/*`, `app/(dashboard)/shared/page.tsx`. Tabs "Shared with me" / "Shared by me" per SPEC; Figma frame shows list only (NAME, VERIFIED, SIZE, LAST UPLOADED). |
| `trash/all` | `361:3586` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=361-3586) | — | `implemented` | Trash list (All tab) — `components/trash/*`, `app/(dashboard)/trash/page.tsx`. Columns NAME, TYPE, SIZE, LAST UPLOADED. |
| `trash/files` | `362:3787` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=362-3787) | — | `implemented` | Trash Files tab — same components; TYPE column hidden. |
| `trash/folders` | `362:3933` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=362-3933) | — | `implemented` | Trash Folders tab — folder glyph rows, no TYPE column. Restore/shred via row context menu (not shown in Figma frames). |
| `mail/inbox-list` | `457:4` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=457-4) | — | `implemented` | Emails All/Inbox list — `components/mail/*`, `app/(dashboard)/emails/page.tsx`. Tabs 18px; rows 56px; time groups Today/This week/This month. |
| `mail/outbox-detail` | `472:905` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=472-905) | — | `implemented` | Outbox delivery detail — `components/mail/MailDetail.tsx`, `app/(dashboard)/emails/[id]/page.tsx`. Sent-to line, attachment gradient bar, body 14px tracking. |
| `mail/create` | `479:1432` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=479-1432) | — | `implemented` | Compose — `components/mail/ComposeMail.tsx`, `/emails/compose`. Recipient/attach/subject/body fields; Send bar 41px. |
| `mail/link` | `518:3085` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=518-3085) | — | `implemented` | Link + attachment chip in compose — inline link bar + file pill in `ComposeMail.tsx`. |
| `search/dropdown` | `525:4` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=525-4) | — | `implemented` | TopBar quick search overlay — filter chips (Files/Folders/Emails/Verified/People), mixed result rows, Clear all. `TopBar.tsx` + `api.search.global`. |
| `search/results` | `525:4` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=525-4) | — | `implemented` | Full results at `/search?q=` — `components/search/*`, file table when Files-only filter; mixed rows otherwise. |
| `search/empty` | `525:4` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=525-4) | — | `implemented` | No matches — `SearchEmptyState` + `SearchDuotone` illustration. |
| `search/filters` | `525:4` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=525-2) | — | `implemented` | Section label “Search and filter” — `SearchFilters.tsx` on `/search`. |
| `settings/profile` | `537:1084` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=537-1084) | — | `implemented` | Account Settings Profile tab — `components/settings/*`, `/settings`. Dashboard shell (Sidebar + TopBar). Sub-frame Data and privacy tab state `543:1490`. User URL `2754-540` is file-actions, not settings. |
| `landing/integrations` | `1240:473` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=1240-473) | — | `implemented` | `components/landing/Integrations.tsx`. 4+3+2 brand grid; placeholder "Slack × 9" replaced per open decision #1 with Slack/Drive/Dropbox/Notion/Gmail/Teams/Zapier/Linear/Asana. Icons via lucide-react. |
| `landing/faq` | `1240:527` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=1240-527) | — | `implemented` | `components/landing/FAQ.tsx`. 5 accordion items, first open by default. |
| `landing/join-cta` | `1240:565` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=1240-565) | — | `implemented` | `components/landing/JoinCTA.tsx`. Dashboard-mockup carousel uses `public/landing/dashboard-preview.png` (per open decision #2) with `carousel-arrow-left/right.svg` nav. |
| `landing/footer` | `1240:526` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=1240-526) | — | `implemented` | `components/landing/MarketingFooter.tsx`. Link row + 5 social icons + `footer-up-arrow.svg` scroll-to-top button. |

## Status legend

- `inventory` — frame discovered, not yet named.
- `named` — semantic name assigned, PNG exported.
- `tokens-extracted` — design tokens (colors, type, spacing) pulled into `design/tokens/`.
- `implemented` — code matches design within agreed tolerance.
- `obsolete` — frame retired or replaced.
