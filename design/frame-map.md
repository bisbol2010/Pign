# Figma frame map

Because the Figma file uses default/auto-generated frame names ("Frame 12", "Component 4", etc.), this file is the authoritative cross-walk between **Figma node IDs** and the **semantic names** we use in the repo.

## How this gets populated

1. User installs Figma MCP and pastes the Figma file URL into chat.
2. Agent calls `get_figma_data` (or equivalent) to list every top-level frame.
3. Agent exports each top-level frame as a PNG to `design/screens/`.
4. User + agent name each row below by looking at the PNG.
5. Once named, every PR that touches a screen references the **semantic name**, not the Figma URL.

## Table

| Semantic name | Figma node-id | Figma URL | PNG in repo | Status | Notes |
|---|---|---|---|---|---|
| _empty — populate during week 1 inventory pass_ | | | | | |

## Status legend

- `inventory` — frame discovered, not yet named.
- `named` — semantic name assigned, PNG exported.
- `tokens-extracted` — design tokens (colors, type, spacing) pulled into `design/tokens/`.
- `implemented` — code matches design within agreed tolerance.
- `obsolete` — frame retired or replaced.
