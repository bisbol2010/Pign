# Spacing tokens

Tailwind default scale unless overridden. Watch for Figma frames that use arbitrary spacing values (e.g. `mt-[18px]`) — those should be rounded to the nearest token or added to the scale.

| Token | px |
|---|---|
| `p-1` / `m-1` | 4 |
| `p-2` / `m-2` | 8 |
| `p-3` / `m-3` | 12 |
| `p-4` / `m-4` | 16 |
| `p-6` / `m-6` | 24 |
| `p-8` / `m-8` | 32 |

## To extract from Figma

Note any non-standard spacing (e.g. 18 px, 22 px) the design uses. Decide per-case:
- Round to nearest Tailwind value (preferred).
- Add to the Tailwind theme extension if used 3+ times.
- Inline arbitrary value `[18px]` only if used exactly once.
