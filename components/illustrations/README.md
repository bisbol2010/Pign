# Illustrations

Reusable spot illustrations for Pign. There are **two sets** here, both driven
entirely by `currentColor` so they invert automatically with the parent's text
color (`text-white` on dark surfaces, `text-black`/`text-pign-black` on light).
**No baked hex colors** — that is what makes every icon reversible.

## Two-tone reversible color technique (the duotone set)

The duotone set builds depth from a single ink color at different opacities:

- **Primary shapes** — `fill="currentColor"` (full opacity). The bold, defining
  forms and any crisp detail. Opaque, so they read on top of secondary regions.
- **Secondary tone** — `fillOpacity={0.4}` on `currentColor`. Backing panels,
  shadows, and "depth" regions placed _adjacent to_ or _behind_ the primary
  shapes.
- **Tertiary tone** — `fillOpacity={0.18}` for an optional third, fainter step
  (e.g. the inside of an open box).
- **Outline detail** — thin opaque `stroke="currentColor"` strokes are allowed
  for crispness (rings, checks, ribs).

Because primary, secondary and tertiary are all the same color at different
alphas, the whole mark is one hue and inverts cleanly on any background.

> **Layering rule:** contrast comes from *adjacent* regions of different
> opacity, or from an *opaque primary on top of* a translucent region. Do **not**
> rely on a translucent shape drawn on top of an opaque same-color shape — it is
> invisible. Compose detail as opaque-on-translucent, not translucent-on-opaque.

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

<LockShieldDuotone className="h-16 w-16 text-white" />   // 64px on dark
<LockShieldDuotone className="h-10 w-10 text-pign-black" /> // 40px on light
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

Each duotone component has a matching raw `.svg` that uses
`fill="currentColor"` + `fill-opacity` for the secondary/tertiary tones, so it
stays reversible **when inlined** into the DOM (e.g. via an SVG loader or
`dangerouslySetInnerHTML`), inheriting the parent's `color`.

> **`<img>` caveat:** when loaded through `<img src="/illustrations/...svg">`,
> the SVG is isolated and `currentColor` resolves to its default **black**. To
> tint/reverse it that way, use a CSS `filter` (e.g. `filter: invert(1)` for
> white on dark) — or, for true reversibility, import and render the **React
> component** instead.

## Recipe: add a new illustration in this style

1. **Create** `components/illustrations/<Concept>Duotone.tsx`. Copy an existing
   duotone component as the template (root svg props + JSDoc intent comment).
2. **Design on the 64×64 grid.** Block the silhouette as a secondary-tone
   (`fillOpacity={0.4}`) backing shape, then add the **opaque** primary forms
   and detail on top/adjacent. Use `fillOpacity={0.18}` for a third step only if
   needed. Keep it clean and recognizable at 40px.
3. **No hex.** Only `currentColor`. Detail strokes use `stroke="currentColor"`.
4. **Export** it from `index.ts` under the duotone section.
5. **Mirror** a raw `public/illustrations/<concept>-duotone.svg` (same paths,
   `fill="currentColor"`, `fill-opacity` for the tones).
6. **Add** the row to the table above.
7. **Verify**: `npx eslint <files>` and `npx tsc --noEmit` are clean.
