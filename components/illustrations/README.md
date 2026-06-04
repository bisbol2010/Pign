# Illustrations

Reusable spot illustrations for Pign. There are **two sets** here. The ink is
driven by `currentColor` so it inverts with the parent's text color
(`text-white` on dark surfaces, `text-pign-black` on light); the duotone set
adds an opaque **knockout** tone via the `--illus-surface` CSS variable. **No
baked ink hex** — that is what keeps every mark reversible.

## Two-tone color technique (the duotone set — knockout model)

The duotone set is a solid ink silhouette with surface-colored negative space:

- **Primary shapes** — `fill="currentColor"` (full opacity). The bold, defining
  forms and crisp detail. The ink.
- **Secondary tone (knockout)** — `fill="var(--illus-surface)"` (opaque).
  Backing panels and "depth" regions, filled with the surface color so they read
  as the surface showing through the ink (dark ink + light holes on a light
  page, and the reverse on dark).
- **Tertiary tone** — `fillOpacity={0.18}` on `currentColor` for an optional
  third, fainter step (e.g. the inside of an open box).
- **Outline detail** — thin opaque `stroke="currentColor"` strokes are allowed
  for crispness (rings, checks, ribs).

`--illus-surface` defaults to the light page (`#f7f7f7`, set in
`app/globals.css`). On a dark surface, add the `illus-on-dark` class to the
container (flips the knockout to `#1a1a1a`) and set `text-white` so the ink
inverts too. You can also set `--illus-surface` inline to match a tinted card.

> **Layering rule:** contrast comes from *opaque ink forms* against *adjacent
> surface-colored knockout* regions. Compose detail as ink-on-knockout. The mark
> reads best on a surface that contrasts with `--illus-surface`; a knockout
> region equal to the page background will blend by design.

### Convention

- **viewBox**: `0 0 64 64` (square) for every duotone icon.
- **Root**: `fill="currentColor"`, `aria-hidden`, spreads `SVGProps<SVGSVGElement>`,
  optional `className` with a sensible default of `h-16 w-16`.
- **Naming**: `<Concept>Duotone` (e.g. `MailboxDuotone`) — deliberately distinct
  from the line-art `<Concept>Illustration` set so the two never collide.
- **Typed**: `SVGProps<SVGSVGElement>`, server-safe (no `"use client"`).

## When to use which set

- **Duotone set (`*Duotone`)** — the default for **new illustrations, empty
  states, hero/auth art, and decorative spot graphics**. Filled, friendly,
  recognizable at ~40–160px. Prefer and extend this set.
- **Line-art set (`*Illustration`)** — the original single-color, hairline
  `stroke="currentColor"` marks. Keep using them where they already appear; they
  suit very large, sketchy hero contexts. Don't remove or rename them.

## Sizing guidance

Set the size with a Tailwind class and the color on the same (or a parent)
element:

```tsx
import { LockShieldDuotone } from "@/components/illustrations";

// 40px on a light surface (default knockout #f7f7f7)
<LockShieldDuotone className="h-10 w-10 text-pign-black" />

// 64px on a dark surface — `illus-on-dark` flips the knockout to ink-black
<div className="illus-on-dark text-white">
  <LockShieldDuotone className="h-16 w-16" />
</div>
```

Recommended footprint: **40–160px**. Below ~32px, prefer `lucide-react` icons.

## Available components

### Duotone set (filled, reversible)

| Component | Public SVG |
| --- | --- |
| `MailboxDuotone` | `/illustrations/mailbox-duotone.svg` |
| `DocumentDuotone` | `/illustrations/document-duotone.svg` |
| `FolderDuotone` | `/illustrations/folder-duotone.svg` |
| `UploadDuotone` | `/illustrations/upload-duotone.svg` |
| `ShareDuotone` | `/illustrations/share-duotone.svg` |
| `LockShieldDuotone` | `/illustrations/lock-shield-duotone.svg` |
| `KeyDuotone` | `/illustrations/key-duotone.svg` |
| `VerifiedBadgeDuotone` | `/illustrations/verified-badge-duotone.svg` |
| `SearchDuotone` | `/illustrations/search-duotone.svg` |
| `TeamDuotone` | `/illustrations/team-duotone.svg` |
| `SuccessCheckDuotone` | `/illustrations/success-check-duotone.svg` |
| `EmptyBoxDuotone` | `/illustrations/empty-box-duotone.svg` |
| `ErrorStateDuotone` | `/illustrations/error-state-duotone.svg` |
| `TrashDuotone` | `/illustrations/trash-duotone.svg` |

### Line-art set (existing)

`MailboxIllustration`, `PaperPlaneIllustration`, `HandsFileIllustration`,
`LightbulbIllustration`, `StarSparkIllustration`, `ShredderIllustration`,
`LockShieldIllustration`.

## Static SVGs in `public/illustrations/`

Each duotone component has a matching raw `.svg` that uses `fill="currentColor"`
for the ink and `fill="var(--illus-surface, #f7f7f7)"` for the knockout, so it
stays reversible **when inlined** into the DOM (e.g. via an SVG loader or
`dangerouslySetInnerHTML`), inheriting the parent's `color` and the
`--illus-surface` token. The optional tertiary step keeps `fill-opacity="0.18"`.

> **`<img>` caveat:** when loaded through `<img src="/illustrations/...svg">`,
> the SVG is isolated — `currentColor` resolves to **black** and
> `--illus-surface` is unavailable, so the knockout falls back to the light
> `#f7f7f7`. To tint/reverse that way, use a CSS `filter` (e.g. `filter:
> invert(1)` for dark surfaces) — or, for true reversibility, import and render
> the **React component** instead.

## Recipe: add a new illustration in this style

1. **Create** `components/illustrations/<Concept>Duotone.tsx`. Copy an existing
   duotone component as the template (root svg props + JSDoc intent comment).
2. **Design on the 64×64 grid.** Block backing/depth shapes as the knockout
   (`fill="var(--illus-surface)"`), then add the **opaque** `currentColor` ink
   forms and detail on top/adjacent. Use `fillOpacity={0.18}` for a faint third
   step only if needed. Keep it clean and recognizable at 40px.
3. **No baked ink hex.** Ink is `currentColor`; knockout is `var(--illus-surface)`.
   Detail strokes use `stroke="currentColor"`.
4. **Export** it from `index.ts` under the duotone section.
5. **Mirror** a raw `public/illustrations/<concept>-duotone.svg` (same paths,
   `fill="currentColor"` for ink and `fill="var(--illus-surface, #f7f7f7)"` for
   the knockout).
6. **Add** the row to the table above.
7. **Verify**: `npx eslint <files>` and `npx tsc --noEmit` are clean.
