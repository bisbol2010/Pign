---
description: Figma → code design discipline. Auto-applied when working on UI files (app/**, components/**, tailwind.config.*).
globs:
  - "app/**/*.tsx"
  - "components/**/*.tsx"
  - "tailwind.config.*"
alwaysApply: false
---

# Figma → code discipline

The Figma file for this project is the source of truth for visual design. The frames are **not well labelled**, so we use `design/frame-map.md` as the canonical cross-walk from Figma node-id → semantic name → PNG export.

## When building any UI

1. Find the relevant frame in `design/frame-map.md`. If the frame isn't mapped yet, **stop and ask the user to identify it**; do NOT guess from Figma's auto-generated frame names.
2. Open the corresponding PNG in `design/screens/<name>@2x.png` (and the spec in `design/specs/<name>.md` if it exists).
3. If the Figma MCP server is connected, fetch live design data for the frame via `mcp__figma__*` tools. Prefer descriptive JSON output over prescriptive React/Tailwind output.
4. Match the design using **existing Tailwind tokens** (see `design/tokens/`). If a value in the design doesn't exist in our tokens:
   - If it's used **3+ times** across the design → propose adding it to `tailwind.config.ts`.
   - If it's used **once or twice** → use an inline arbitrary value (`text-[13px]`), but flag it in the PR description.
   - **Never** paste Figma's raw inline CSS variables (e.g. `text-[color:var(--neutral/dark-100%,black)]`) directly into the codebase.

## Asset rules

- If the Figma MCP server returns a localhost URL for an image or SVG, **use that URL directly** — do not invent placeholder images or substitute icons from other packages.
- For SVG icons, prefer `lucide-react` (already a dependency) over copying SVG bytes from Figma, unless the Figma icon is a Pign-custom design.
- Logo and brand assets live in `/public` and are committed.

## Asking before guessing

- Frame purpose unclear? Ask the user — don't infer from the Figma label.
- Two frames could match the same screen? Ask the user.
- Mobile-vs-desktop variant of the same screen? Read `design/frame-map.md`; if not annotated, ask.

## What to never do

- Don't write screen-specific Tailwind classes that bypass the design tokens (e.g. `bg-[#1a1a1a]` when `bg-pign-black` exists).
- Don't reorder DOM to match Figma's z-order if it harms a11y (e.g. moving the heading below the input).
- Don't import a new icon library, font library, or component library to satisfy a single Figma frame. Ask first.

## What to always do

- Update `design/frame-map.md` when you map a new frame.
- Update `design/tokens/*.md` when you extract new tokens.
- Reference the Figma frame's PNG in the PR description so reviewers can compare without Figma access.
