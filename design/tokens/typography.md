# Typography tokens

Updated by: extracting from the Figma file's text styles.

## Current setup

- Font family: Geist (loaded via `next/font` in `app/layout.tsx`)
- Tailwind defaults for sizes/weights

## To extract from Figma

For each text style in the Figma file, record:

| Figma style | Tailwind class | Font size | Line height | Weight | Used for |
|---|---|---|---|---|---|
| _populated during inventory pass_ | | | | | |

## Suggested hierarchy (to validate against Figma)

| Role | Class | Size | Weight |
|---|---|---|---|
| H1 (page title) | `text-2xl font-semibold` | 24 px | 600 |
| H2 (section) | `text-lg font-semibold` | 18 px | 600 |
| H3 (card title) | `text-base font-medium` | 16 px | 500 |
| Body | `text-sm` | 14 px | 400 |
| Caption / meta | `text-xs` | 12 px | 400 |
| Button | `text-sm font-medium` | 14 px | 500 |
