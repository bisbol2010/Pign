# Landing review findings — Figma `1234:1440`

**Review date:** 2026-05-27 (updated)  
**Commits:** `2572910`, `ba4cbe3`, fidelity pass in progress

Sources: **Figma MCP** (`get_design_context`), **Cursor code audit**, **ChatGPT/Gemini** (paste when available).

---

## Consolidated — Figma MCP + Cursor (L-100+)

| ID | Severity | File | Issue | Suggested fix | Status |
|----|----------|------|-------|---------------|--------|
| L-101 | P1 | `Hero.tsx` | MCP: eyebrow `top-[372px]`, H1 `top-[482px]` / `128px`/`112px`, mailbox `top-[250px]`, CTA `top-[722px]` — code used ~94px higher | Lock layout in `min-[1440px]:` block with MCP coordinates | **Fixed** |
| L-102 | P1 | `Hero.tsx` | Absolute layout breaks below 1440px | Dual layout: stack `< max-lg`, absolute `≥1440px` | **Fixed** |
| L-103 | P1 | `MarketingHeader.tsx` | Column dividers/absolute nav invalid below 1440px | Separate mobile flex header; desktop at `min-[1440px]:` | **Fixed** |
| L-104 | P1 | `JoinCTA.tsx` | MCP: carousel `top-[160px]`, center `left-[269px]` 902×642; arrows `top-[363px]`; CTA `top-[646px]` | Restructure section to Figma y-positions | **Fixed** |
| L-105 | P1 | `JoinCTA.tsx` | `dashboard-preview.png` ~1.6MB | Serve `dashboard-preview-sm.png` (~230KB) | **Fixed** |
| L-106 | P1 | `Integrations.tsx` | `grid-cols-4` with no breakpoints — horizontal overflow | `grid-cols-1 sm:2 lg:4` per row | **Fixed** |
| L-107 | P1 | `Benefits.tsx` | `px-[167px]` + `whitespace-nowrap` band overflow on tablet | `SectionShell` responsive gutters; band wraps | **Fixed** |
| L-108 | P2 | `Features.tsx` | Pills non-interactive vs Figma radio pattern | Defer — static pills acceptable v1 | Deferred |
| L-109 | P2 | `Integrations.tsx` | Lucide placeholders vs brand marks | Defer — `simple-icons` later | Deferred |
| L-110 | P1 | `FAQ.tsx` | Accordion could close all items | Always `setOpenIndex(i)` — one open at a time | **Fixed** |

## Prior Cursor pass (L-001–L-012)

| ID | Status |
|----|--------|
| L-001–L-006 | **Fixed** (see `ba4cbe3`) |
| L-007–L-008, L-011 | Deferred (carousel slides, brands) |
| L-009 | Deferred (org tab copy) |
| L-010 | **Fixed** (responsive stack) |
| L-012 | **Fixed** (`ComingSoonStub`) |

---

## ChatGPT appendix

_Paste rows from [`landing-1234-1440-review-packet.md`](./landing-1234-1440-review-packet.md). Agent will merge into table above._

| ID | Severity | File | Issue | Suggested fix |
|----|----------|------|-------|---------------|
| _(pending user paste)_ | | | | |

---

## Gemini appendix

| ID | Severity | File | Issue | Suggested fix |
|----|----------|------|-------|---------------|
| _(pending user paste)_ | | | | |

---

## Responsive breakpoints (no Figma mobile)

| Width | Behavior |
|-------|----------|
| `≥ 1440px` | Figma absolute geometry (`min-[1440px]:` utilities) |
| `1024–1439px` | Fluid `clamp()` type, reduced gutters via `SectionShell` |
| `< 1024px` (`max-lg`) | Stacked hero, wrapped header, 1-col integrations, single carousel mockup |

Hydration warnings with `data-cursor-ref` in Cursor’s browser are **not** app bugs.

---

## Acceptance checklist

- [x] `/` at 1440px uses MCP hero/CTA positions
- [x] No horizontal scroll at 768px / 375px (integrations grid stacks)
- [x] Stub links use `ComingSoonStub`
- [x] FAQ always keeps one panel open when switching
- [ ] User sign-off vs `linked-node-1234-1440.png`
