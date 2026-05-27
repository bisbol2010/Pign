# Landing review packet — Figma node `1234:1440`

**Commit under review:** `2572910` (`feat(marketing): implement Figma landing page`)

**Goal:** Review the marketing landing at `/` against Figma node `1234:1440` at **1440px desktop width**. Do **not** suggest v1 backend / Convex schema changes.

**Reference screenshot:** [`design/screens/_inventory/linked-node-1234-1440.png`](../../design/screens/_inventory/linked-node-1234-1440.png)

**Live URL (local):** http://localhost:3000/

---

## Files in scope

| Path | Role |
|------|------|
| [`app/page.tsx`](../../app/page.tsx) | Page shell, section order |
| [`app/globals.css`](../../app/globals.css) | `--surface-ink` tokens |
| [`components/landing/Hero.tsx`](../../components/landing/Hero.tsx) | Hero + grid backdrop |
| [`components/landing/MarketingHeader.tsx`](../../components/landing/MarketingHeader.tsx) | Top nav |
| [`components/landing/GridBackdrop.tsx`](../../components/landing/GridBackdrop.tsx) | CSS grid pattern |
| [`components/landing/Benefits.tsx`](../../components/landing/Benefits.tsx) | Tabs + bullet list |
| [`components/landing/Features.tsx`](../../components/landing/Features.tsx) | Feature pills + card |
| [`components/landing/Integrations.tsx`](../../components/landing/Integrations.tsx) | 9-card grid |
| [`components/landing/FAQ.tsx`](../../components/landing/FAQ.tsx) | Accordion |
| [`components/landing/JoinCTA.tsx`](../../components/landing/JoinCTA.tsx) | Carousel + CTAs |
| [`components/landing/MarketingFooter.tsx`](../../components/landing/MarketingFooter.tsx) | Footer links + scroll-top |
| [`public/landing/*`](../../public/landing/) | Illustrations and mockups |
| [`design/frame-map.md`](../../design/frame-map.md) | Node-id mapping |

**View diff:**

```bash
git show 2572910 --stat
git show 2572910 -- app/page.tsx components/landing app/globals.css design/frame-map.md
```

---

## Review rubric

Score each finding **P0** (broken UX / a11y / security), **P1** (visual mismatch at 1440px), or **P2** (nice-to-have).

| Category | Check |
|----------|--------|
| Visual fidelity | Spacing, type scale, colors vs inventory PNG |
| Accessibility | Landmarks, headings, keyboard, tabs, accordion, contrast, focus |
| Next.js 16 / React 19 | Server vs `"use client"`, `next/image` vs `<img>`, metadata |
| Performance | Image weight (`dashboard-preview.png` ~1.6MB), client JS bundle |
| Maintainability | Absolute positioning vs responsive strategy |
| Security / SEO | Stub links, `href="#"`, page metadata, external `rel` |

**Output format (max 15 rows):**

```markdown
| ID | Severity | File | Issue | Suggested fix |
|----|----------|------|-------|---------------|
| L-001 | P1 | ... | ... | ... |
```

---

## Shared prompt (paste into ChatGPT and Gemini)

Attach **`linked-node-1234-1440.png`** and either upload the files listed above or paste `git show 2572910` output.

```
You are reviewing a Next.js 16 + Tailwind v4 marketing landing page for Pign.

Compare the implementation to the attached Figma screenshot (node 1234:1440, 1440×5836 desktop).

Stack: React 19, App Router, Bricolage Grotesque, dark theme (#161616), seven sections (Hero → Benefits → Features → Integrations → FAQ → Join CTA → Footer).

Return ONLY a markdown table with columns: ID, Severity (P0|P1|P2), File, Issue, Suggested fix. Maximum 15 rows.

Rules:
- Do not suggest Convex/backend/schema changes.
- Flag invalid a11y patterns (e.g. aria-disabled on <a href="#">, non-functional carousel buttons).
- Flag next/image aspect-ratio misuse on SVGs.
- Flag SEO gaps (missing page-specific metadata).
- P0 = broken UX, accessibility blocker, or security issue.
- P1 = clear visual mismatch at 1440px width.
- P2 = polish / future work (mobile layout not in Figma, carousel slides, org tab copy).
```

---

## Acceptance checklist (post-fix)

- [ ] `/` at 1440px matches inventory PNG within agreed tolerance
- [ ] `Login` → `/login`; signup CTAs → `/signup`
- [ ] FAQ accordion: one open, keyboard operable
- [ ] Footer scroll-to-top works
- [ ] No console errors on load in a normal browser (not Cursor automation)
- [ ] Stub links do not navigate or steal focus misleadingly
