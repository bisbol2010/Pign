---
description: Two-tone black/white reversible illustration style for spot graphics, empty states, and hero/auth art.
globs:
  - "app/**/*.tsx"
  - "components/**/*.tsx"
  - "public/illustrations/**/*.svg"
alwaysApply: false
---

# Illustration style

For any **new illustration, empty state, hero/auth art, or decorative spot
graphic**, use the two-tone (duotone) black/white **reversible** style and
prefer/extend the `components/illustrations` filled set. See
`components/illustrations/README.md` for the full guide and recipe.

## Rules

- **Reuse first.** Import from `@/components/illustrations` (the `*Duotone`
  set). Only create a new component if no existing concept fits.
- **Ink = `currentColor`.** Primary shapes, detail and strokes use
  `fill="currentColor"` / `stroke="currentColor"` (no baked hex). Set the hue on
  the parent (`text-pign-black` on light, `text-white` on dark) so the ink
  inverts.
- **Secondary = opaque knockout.** Backing/depth regions are filled opaque with
  `fill="var(--illus-surface)"` (the surface color, default `#f7f7f7`), reading
  as the surface showing through the ink silhouette. An optional tertiary step
  stays as `fillOpacity={0.18}` on `currentColor`.
- **Dark surfaces:** add the `illus-on-dark` class on the dark container (or set
  `--illus-surface` inline) so the knockout flips to ink-black while the ink
  goes white via `text-white`.
- **Contrast = ink silhouette + surface negative space.** Opaque ink forms
  carry the shape; the knockout cuts surface-colored holes/panels. The mark sits
  best on a contrasting surface/card (a knockout region equal to the page bg
  will blend by design).
- **Convention:** square `viewBox="0 0 64 64"`, `aria-hidden`, spreads
  `SVGProps<SVGSVGElement>`, default `className` size `h-16 w-16`, name
  `<Concept>Duotone`, server-safe (no `"use client"`).
- **Mirror exports:** every component has a matching
  `public/illustrations/<concept>-duotone.svg` (same paths,
  `fill="currentColor"`, and `fill="var(--illus-surface, #f7f7f7)"` for the
  knockout so the `<img>` fallback stays light).

```tsx
// ✅ ink follows currentColor; knockout uses the surface token
<path fill="currentColor" d="…" />
<path fill="var(--illus-surface)" d="…" />          {/* opaque knockout */}
<path fill="currentColor" fillOpacity={0.18} d="…" /> {/* optional tertiary */}

// ❌ never bake the ink or knockout as a literal hex
<path fill="#1A1A1A" d="…" />
<path fill="white" d="…" />
```

Do **not** use `<img src="/illustrations/…svg">` when you need full
reversibility — an isolated `<img>` resolves `currentColor` to black and ignores
`--illus-surface` (it falls back to the light `#f7f7f7` knockout). Render the
React component for reversible ink + knockout. The existing line-art
`*Illustration` components stay as-is; don't rename them.
