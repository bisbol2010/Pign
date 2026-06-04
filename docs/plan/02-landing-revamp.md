# Landing Revamp Implementation Plan

## Goal

Revamp the marketing landing page for Pign with:

1. consistent full-bleed 1px section dividers,
2. a restructured Integrations section (left-aligned + 4/3/4 tool layout),
3. a fully functional, accessible, auto-advancing dashboard carousel aligned to Figma.

This is a planning artifact only (no code edits in this step).

## Current Baseline (what exists now)

- Section order is `Hero -> Benefits -> Features -> Integrations -> FAQ -> JoinCTA` in `app/page.tsx` (lines 37-43), with `MarketingFooter` outside `<main>` (line 44).
- `Benefits` currently includes an ad-hoc divider (`<div aria-hidden className="w-full border-t border-white/15" />`) at the end of the section in `components/landing/Benefits.tsx` (line 136).
- `Integrations` currently wraps content in `mx-auto max-w-[1440px] pt-[80px]` and draws its own top/bottom row lines (`border-t`, `border-b`) in `components/landing/Integrations.tsx` (lines 143, 155-175).
- Carousel UI is in `components/landing/JoinCTA.tsx`:
  - static preview image (`dashboard-preview-sm.png`) (lines 39-56),
  - disabled prev/next buttons (`aria-disabled`, `disabled`) (lines 77-109),
  - desktop side peeks already present (lines 20-37 and 58-75).
- Shared layout utility is `SectionShell` with named gutters in `components/landing/SectionShell.tsx` (lines 3-29).

## Workstream 1: Unified Section Dividers

### Objective

Use one reusable divider implementation between **every** landing section, full-bleed at all breakpoints, and remove one-off divider implementations.

### Files

- **New:** `components/landing/SectionDivider.tsx`
- **Update:** `app/page.tsx`
- **Update:** `components/landing/Benefits.tsx`
- **Update:** `components/landing/Integrations.tsx`
- **Optional cleanup:** `components/landing/JoinCTA.tsx` (if boundary lines are replaced by global section boundaries)

### Proposed reusable API

```tsx
type SectionDividerProps = {
  className?: string;
  tone?: "default" | "subtle";
};
```

```tsx
export function SectionDivider({ className = "", tone = "default" }: SectionDividerProps) {
  return (
    <div
      aria-hidden
      className={[
        "relative left-1/2 right-1/2 w-screen -translate-x-1/2 border-t",
        tone === "default" ? "border-white/30" : "border-white/15",
        className,
      ].join(" ")}
    />
  );
}
```

### Placement map (exactly where)

In `app/page.tsx`, insert divider components between:

1. `Hero` and `Benefits`
2. `Benefits` and `Features`
3. `Features` and `Integrations`
4. `Integrations` and `FAQ`
5. `FAQ` and `JoinCTA`
6. `JoinCTA` and `MarketingFooter`

### Implementation notes

- Keep section wrappers (`bg-surface-ink`) unchanged; divider handles only boundary stroke.
- Remove the existing ad-hoc divider in `Benefits.tsx` line 136.
- Remove boundary lines in `Integrations.tsx` currently used as section separators and keep only inner card-grid separators.
- Use `w-screen -translate-x-1/2 left-1/2` approach so the divider ignores `max-w-[1440px]` constraints and remains edge-to-edge.

## Workstream 2: Integrations Section Redesign

### Objectives

1. Divider line must run edge-to-edge across breakpoints (handled by global divider).
2. Left-align all copy and section logo.
3. On desktop, logo + heading + intro sit above tools (stacked, not side-by-side).
4. Tools render in a strict `4 / 3 / 4` desktop layout (11 total cards).

### Files

- **Update:** `components/landing/Integrations.tsx`
- **Optional new data module:** `components/landing/integrations-data.ts`
- **New assets (expected):** `public/landing/integrations/*`

### Component/data shape

```ts
type IntegrationItem = {
  id: string;
  name: string;
  description: string;
  logoSrc: string;
  logoAlt: string;
};

type IntegrationRows = [IntegrationItem[], IntegrationItem[], IntegrationItem[]]; // 4,3,4
```

### Desktop/tablet/mobile layout spec

- **Desktop (`xl` / >=1280):**
  - Header block stacked and left-aligned.
  - Row 1: 4 columns.
  - Row 2: 3 columns (centered row container, same tile width as row 1/3).
  - Row 3: 4 columns.
- **Tablet (`md` to `<xl`):**
  - All rows become 2-column grids.
  - Preserve row order and reading order.
- **Mobile (`<md`):**
  - Single column list.
  - Tile padding reduced; text remains left-aligned.

### Tailwind structure (proposed)

```tsx
<section className="relative bg-surface-ink text-white" aria-labelledby="integrations-heading">
  <SectionShell gutter="56" className="pt-[80px] pb-[80px] min-[1440px]:pt-[96px] min-[1440px]:pb-[112px]">
    <header className="flex flex-col items-start gap-6">
      <img src="/landing/mailbox-illustration.svg" alt="" aria-hidden className="h-[64px] w-[72px]" />
      <h2 id="integrations-heading" className="max-w-[920px] text-left text-[clamp(32px,5vw,56px)] font-medium leading-[1.1]">
        Integrate Pign with your favourite tools to get the most out of it
      </h2>
      <p className="max-w-[760px] text-left text-[clamp(16px,1.8vw,22px)] text-white/80">
        Connect inboxes, cloud drives, workflows, and verification pipelines in minutes.
      </p>
    </header>

    {/* tools grid starts below header */}
  </SectionShell>
</section>
```

### Tool set (11 cards, real mailbox/document workflows)

#### Row 1 (4)

1. **Slack** - "Post verified document alerts to channels with secure deep links."
2. **Google Drive** - "Sync selected folders into Pign with verification metadata."
3. **Dropbox** - "Import contracts and IDs from Dropbox without duplicate uploads."
4. **Box** - "Mirror regulated document libraries and preserve access rules."

#### Row 2 (3)

5. **Microsoft OneDrive** - "Keep personal and team files aligned with Pign records."
6. **SharePoint** - "Route approved documents to enterprise libraries automatically."
7. **Gmail / Google Workspace** - "Forward important emails and attachments to Pign."

#### Row 3 (4)

8. **Outlook / Microsoft 365** - "Capture email threads and attached files for audit trails."
9. **Notion** - "Embed verified documents in workspace pages and project docs."
10. **Zapier** - "Trigger no-code workflows when documents are uploaded or verified."
11. **REST API + Webhooks** - "Build custom automations from upload, verify, and share events."

### Needed/missing logo assets

Expected under `public/landing/integrations/`:

- `slack.svg` (missing)
- `google-drive.svg` (missing)
- `dropbox.svg` (missing)
- `box.svg` (missing)
- `onedrive.svg` (missing)
- `sharepoint.svg` (missing)
- `gmail.svg` (missing)
- `outlook.svg` (missing)
- `notion.svg` (missing)
- `zapier.svg` (missing)
- `api-webhooks.svg` (missing; can be custom glyph)

Current `public/landing/` has no integration logos, so all 11 are new additions.

## Workstream 3: Functional + Accessible Carousel

### Objective

Replace static/disabled carousel behavior in `JoinCTA` with a real, looping carousel including:

- prev/next controls,
- keyboard navigation,
- indicator dots,
- autoplay,
- pause on hover/focus,
- reduced-motion compliance,
- restart after user interaction.

### Files

- **New:** `components/landing/DashboardCarousel.tsx` (client component)
- **New:** `components/landing/dashboard-slides.ts` (typed slide data)
- **Update:** `components/landing/JoinCTA.tsx` (swap static preview area for carousel component)
- **New assets (likely):**
  - `public/landing/carousel/slide-inbox-selected-hover.png`
  - `public/landing/carousel/slide-file-viewer.png`
  - additional slide exports if building beyond 2 slides

### Existing code anchor points

- Disabled buttons in `JoinCTA.tsx` (lines 77-109) become active control buttons.
- Static image stack in `JoinCTA.tsx` (lines 39-56) becomes animated slide track.
- Desktop peek strips (lines 20-37 and 58-75) are retained but fed by prev/next slide images.

### Figma findings to match

#### Node `2737:545` (Selected/hover)

- Inbox/list-state dashboard view with:
  - left nav on "Emails",
  - timeline grouping labels ("Today", "This week", "This month"),
  - one hovered row + selected/checkbox states,
  - dense list-heavy operational state.
- Visual intent: "active mailbox workflow" slide (triage/selection state).

#### Node `2737:717` (file viewer)

- Document viewer mode:
  - central document canvas,
  - top file metadata bar ("My Project.pdf"),
  - print options flyout ("Print with verification/without verification"),
  - left/right nav arrows with page counter (`4/10`).
- Visual intent: "deep file inspection and verification" slide (detail state).

### Carousel API proposal

```ts
export type DashboardSlide = {
  id: string;
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt: string;
  figmaNodeId?: string; // "2737:545", "2737:717"
};

type DashboardCarouselProps = {
  slides: DashboardSlide[];
  autoPlayMs?: number; // default 5000
  className?: string;
};
```

### State model

- `activeIndex: number`
- `isPausedByHover: boolean`
- `isPausedByFocus: boolean`
- `isReducedMotion: boolean` (from `prefers-reduced-motion`)
- `userInteractedAt: number | null` (restart delay control)

Derived:

- `isAutoplayEnabled = !isReducedMotion && !isPausedByHover && !isPausedByFocus`
- `canLoop = slides.length > 1`

### Behavior rules

- **Prev/Next:** wrap using modulo (`(idx +/- 1 + total) % total`).
- **Keyboard:** when carousel region focused:
  - `ArrowLeft` => previous
  - `ArrowRight` => next
  - `Home` => first
  - `End` => last
- **Autoplay:**
  - tick every `autoPlayMs` when enabled,
  - pause on pointer enter + focus within,
  - after any manual action (prev/next/dot/key), restart timer after short cooldown (`~6s`).
- **Reduced motion:**
  - disable autoplay,
  - reduce transition duration or remove transform animation.

### Accessibility spec

- Carousel root:
  - `role="region"`
  - `aria-roledescription="carousel"`
  - `aria-label="Pign product preview carousel"`
- Slide wrapper:
  - each slide `role="group" aria-roledescription="slide"`
  - `aria-label="${index + 1} of ${slides.length}: ${slide.title}"`
  - non-active slides `aria-hidden="true"` and non-focusable.
- Controls:
  - active prev/next buttons with `aria-label="Previous slide"` / `"Next slide"`.
  - dots as buttons with `aria-label="Go to slide X"` and `aria-current` on active.
- Optional polite live region for announcing active slide title.

### Proposed internal component structure

```tsx
<div onMouseEnter={pause} onMouseLeave={resume} onFocusCapture={pause} onBlurCapture={resume}>
  <button onClick={goPrev} />
  <div className="overflow-hidden">
    <ul className="flex transition-transform" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
      {slides.map(...)}
    </ul>
  </div>
  <button onClick={goNext} />
  <div className="mt-6 flex justify-center gap-2">{/* dots */}</div>
</div>
```

### Responsive behavior

- Preserve current `JoinCTA` geometry:
  - desktop 902x642 visual center with side peeks,
  - mobile uses `h-[min(50vh,562px)]` container.
- On mobile/tablet, hide side peeks and prioritize main slide + dots touch targets.
- Ensure arrow controls remain reachable and do not overlap CTA text block.

## Sequencing / Delivery Plan

1. Build `SectionDivider` and wire it in `app/page.tsx`.
2. Remove one-off divider implementations (`Benefits`, `Integrations`, optionally `JoinCTA` boundaries).
3. Refactor `Integrations` into header + three explicit rows with 11 typed cards.
4. Add/update integration logos in `public/landing/integrations/`.
5. Extract and implement `DashboardCarousel` component and slide data module.
6. Replace disabled controls in `JoinCTA` with the new carousel.
7. QA responsive layout, keyboard flow, and motion preferences.

## QA Checklist

- Dividers render exactly once between each section and span full viewport width at all sizes.
- Integrations:
  - desktop row counts are exactly `4 / 3 / 4`,
  - header content is left-aligned and stacked above tools,
  - tablet/mobile reflow matches spec.
- Carousel:
  - prev/next loop correctly,
  - arrows and dots are keyboard operable,
  - autoplay works and pauses/resumes per rules,
  - reduced motion disables autoplay.
- No visual regressions to CTA positioning and footer boundary.

## Risks / Open Questions

- Integration brand assets must be sourced and approved (potential legal/brand usage constraints).
- Figma nodes provided are app-state screenshots; if marketing expects additional states, request 2-3 more target frames for richer carousel storytelling.
- JoinCTA currently has explicit top/bottom lines; confirm whether those should remain as internal decoration once global dividers are adopted.

