# Color tokens

Source of truth for color values used in the app. Mirrors what's in `tailwind.config.ts` (or will, once extracted from Figma).

Updated by: extracting from the Figma file's color styles (via MCP or manual inspection).

## Current tokens in the codebase (from existing Tailwind config)

| Token | Hex | Used for |
|---|---|---|
| `pign-black` | _verify in tailwind.config_ | Primary buttons, headings |
| `grey-2` | _verify_ | Body text |
| `grey-3` | _verify_ | Secondary text |
| `grey-4` | _verify_ | Tertiary text / placeholders |
| `grey-5` | _verify_ | Borders |
| `grey-6` | _verify_ | Dividers, card borders |
| `grey-7` | _verify_ | Hover backgrounds |
| `background` | _verify_ | App background |

## Tokens to extract from Figma

_To be populated during the inventory pass. For each Figma color style:_

- Name in Figma
- Hex value
- Tailwind token name (proposed)
- Light/dark variants if applicable
- Where it's used in the design

## Verification color states (new, per SPEC.md § 4.3)

| State | Token | Hex (proposed) | Notes |
|---|---|---|---|
| Verified | `verify-green` | TBD from Figma | Badge background / icon |
| Verification expired | `verify-amber` | TBD | Revoked but historic |
| Disputed | `verify-red` | TBD | Owner declined |
| Pending review | `verify-yellow` | TBD | Awaiting owner decision |
