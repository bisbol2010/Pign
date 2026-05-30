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
- **No baked hex.** Color comes from `currentColor` only. Set the hue on the
  parent (`text-white` on dark, `text-pign-black` on light) so the art inverts.
- **Two tones via opacity:** primary shapes `fill="currentColor"`; secondary
  depth `fillOpacity={0.4}`; optional tertiary `fillOpacity={0.18}`. Thin
  `stroke="currentColor"` strokes are fine for crisp detail.
- **Contrast = adjacency.** Opaque primary on top of (or beside) translucent
  secondary. Never rely on translucent-on-opaque same-color detail — it is
  invisible on every background.
- **Convention:** square `viewBox="0 0 64 64"`, `aria-hidden`, spreads
  `SVGProps<SVGSVGElement>`, default `className` size `h-16 w-16`, name
  `<Concept>Duotone`, server-safe (no `"use client"`).
- **Mirror exports:** every component has a matching
  `public/illustrations/<concept>-duotone.svg` (same paths, `fill="currentColor"`
  + `fill-opacity`).

```tsx
// ✅ reversible: one ink color, two opacities
<path fill="currentColor" d="…" />
<path fill="currentColor" fillOpacity={0.4} d="…" />

// ❌ never bake colors
<path fill="#1A1A1A" d="…" />
<path fill="white" d="…" />
```

Do **not** use `<img src="/illustrations/…svg">` when you need reversibility —
inlined `currentColor` only inherits via the React component (an isolated
`<img>` resolves `currentColor` to black; tint with a CSS `filter` if you must).
The existing line-art `*Illustration` components stay as-is; don't rename them.
