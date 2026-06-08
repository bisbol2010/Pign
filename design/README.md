# Pign design assets

Ground-truth design references used by Cursor agents and humans alike when building UI. This folder is intentionally committed to git so the build context is reproducible even if the Figma file moves, is unshared, or the MCP server is offline.

## Folder layout

```
design/
  README.md                  ← this file
  frame-map.md               ← Figma node-id → semantic name cross-walk (UPDATE AS FRAMES ARE NAMED)
  tokens/
    colors.md                ← exported color tokens (filled in week 1)
    typography.md            ← exported type scale + weights
    spacing.md               ← spacing scale
    radii.md                 ← border radii
  screens/                   ← PNG/JPG exports of each top-level frame, 2x
    auth-login@2x.png
    auth-signup@2x.png
    dashboard-empty@2x.png
    dashboard-files-list@2x.png
    dashboard-files-grid@2x.png
    document-viewer@2x.png
    delivery-compose@2x.png
    delivery-inbox@2x.png
    ...
  specs/                     ← per-screen Markdown notes (component breakdown, edge states)
    auth-login.md
    dashboard.md
    ...
  components/                ← exports of reusable components, atoms first
    button-primary@2x.png
    button-secondary@2x.png
    file-row@2x.png
    ...
```

## Workflow when a new screen is being built

1. Pull the latest design from Figma (via MCP) or export the relevant frame to `design/screens/<name>@2x.png`.
2. Update `frame-map.md` with the Figma node-id → file-path mapping (the frames are not well labelled — see `frame-map.md` for the naming convention we apply on our side).
3. If new tokens are introduced (a new accent color, a new spacing unit), add them to `design/tokens/*.md` and propagate to `tailwind.config.ts`.
4. The agent then compares the rendered component (via screenshots / Playwright traces) against the file in `design/screens/`. Visual deltas are listed in the PR description.

## Why not just rely on the Figma MCP?

The Figma MCP server is great for fetching live design data — but it has three weaknesses we offset here:
- **Bus factor**: if the Figma file is moved/deleted/unshared, every reference URL dies.
- **Token cost**: each MCP roundtrip costs latency and context; PNGs in the repo are free.
- **Reviewability**: a PR diff can show "here's the screen I built; here's what Figma said it should look like" without reviewers needing Figma access.

So we use both. MCP for the live "what should this look like" question; this folder for the durable "what did we agree it should look like" record.

## Naming convention

Files in `design/screens/` use `<area>-<state>@2x.<ext>`:
- area: `auth`, `dashboard`, `document`, `delivery`, `share`, `entity`, `admin`, `settings`, `notification`, `mobile`
- state: empty / loading / list / grid / error / focused / hover / etc.
- example: `dashboard-files-empty@2x.png`, `delivery-compose-with-attachments@2x.png`

This works around poorly-labelled Figma frames because the export step forces us to give each one a meaningful name in our repo.
