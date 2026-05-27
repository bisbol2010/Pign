# Landing review findings — Figma `1234:1440`

**Review date:** 2026-05-27  
**Commit:** `2572910`

This file consolidates review passes. **Cursor** ran the rubric from [`landing-1234-1440-review-packet.md`](./landing-1234-1440-review-packet.md). Append rows from **ChatGPT** and **Gemini** under their sections after you paste the shared prompt.

---

## Consolidated (Cursor pass — implemented in triage)

| ID | Severity | File | Issue | Suggested fix | Status |
|----|----------|------|-------|---------------|--------|
| L-001 | P0 | `MarketingHeader.tsx`, `JoinCTA.tsx`, `MarketingFooter.tsx` | `aria-disabled` on `<Link href="#">` is invalid; links still focusable and jump to top | Use non-navigating stub (`<span role="link" aria-disabled tabIndex={-1}>`) or `button type="button" disabled` with tooltip | **Fixed** |
| L-002 | P0 | `JoinCTA.tsx` | Carousel prev/next buttons have no effect (misleading control) | Mark `aria-disabled` + `title="Coming soon"` until slides exist | **Fixed** |
| L-003 | P1 | `Hero.tsx` | H1 `w-[1365px]` causes horizontal overflow below 1440px | Constrain to `max-w-[calc(100%-112px)]` | **Fixed** |
| L-004 | P1 | `Hero.tsx` | `next/image` on SVGs with `h-full w-full` triggers dev aspect-ratio warnings | Use `<img>` for decorative SVGs (same as logo) | **Fixed** |
| L-005 | P1 | `app/page.tsx` | No page-level metadata beyond root layout | Export `metadata` with marketing title/description | **Fixed** |
| L-006 | P1 | `Benefits.tsx` | Tab panels lack `role="tabpanel"` / `aria-labelledby` | Wire tablist pattern per WAI-ARIA | **Fixed** |
| L-007 | P2 | `JoinCTA.tsx` | `dashboard-preview.png` ~1.6MB; three DOM copies | Compress/WebP + single slide state later | Deferred |
| L-008 | P2 | `JoinCTA.tsx` | Carousel uses same image ×3 | Add distinct mockups per open decision #2 | Deferred |
| L-009 | P2 | `Benefits.tsx` | Organisations tab shows same copy as Individuals | Org-specific copy or banner per plan § open decision #4 | Deferred |
| L-010 | P2 | `Hero.tsx` | No mobile Figma frame; absolute layout clips on narrow viewports | `lg:` absolute stack; static flow below `lg` | Partial (overflow fix only) |
| L-011 | P2 | `Integrations.tsx` | Brand icons are generic lucide, not official marks | `simple-icons` or licensed SVGs when ready | Deferred |
| L-012 | P2 | `MarketingFooter.tsx` | Social/footer legal links are `href="#"` stubs | Route stubs or remove until pages exist | **Fixed** (stub pattern) |

---

## ChatGPT appendix

_Paste the shared prompt from the review packet. Add rows below._

| ID | Severity | File | Issue | Suggested fix |
|----|----------|------|-------|---------------|
| _(pending)_ | | | | |

---

## Gemini appendix

_Paste the shared prompt from the review packet. Add rows below._

| ID | Severity | File | Issue | Suggested fix |
|----|----------|------|-------|---------------|
| _(pending)_ | | | | |

---

## Triage notes

- **P0/P1 from Cursor** were addressed in commit following this review (see git log after `2572910`).
- Re-verify at **1440px** against `design/screens/_inventory/linked-node-1234-1440.png`.
- Hydration warnings with `data-cursor-ref` in Cursor’s browser are **not** app bugs.
