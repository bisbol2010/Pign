# Figma → React component map

Authoritative mapping between Figma components (in the Pign design system, file `DH23JKHKdPD3NEgtz6cU6G`) and React components in `components/ui/`. This is the **manual** version of Figma Code Connect, which requires a paid Org/Enterprise seat.

When the workspace upgrades, this table can be auto-published with `send_code_connect_mappings` (already built into the agent flow) or by running the `figma connect publish` CLI against the per-component `.figma.ts` files.

## Mappings

| React component | Source | Figma component | Figma node ID | Variant axes → React props |
|---|---|---|---|---|
| `Button` | `components/ui/Button.tsx` | Button | `2691:56` | `Style=Primary` → `variant="primary"` · `Size=Sm` → `size="sm"` · `State=Disabled` → `disabled` |
| `Input` | `components/ui/Input.tsx` | Input | `2693:22` | `State=Error` → `error` · `State=Disabled` → `disabled` · `label` / `placeholder` / `helper` props pass through |
| `Label` | `components/ui/Label.tsx` | Label | `2694:2` | TEXT `text` → children · BOOLEAN `required` → `required` |
| `Badge` | `components/ui/Badge.tsx` | Badge | `2695:17` | `Variant=Verified` → `variant="verified"` (and `expired` / `disputed` / `pending`) · BOOLEAN `showDot` → `showDot` |
| `Avatar` | `components/ui/Avatar.tsx` | Avatar | `2696:8` | `Size=Md` → `size="md"` · TEXT `initials` → `initials` |
| `IconButton` | `components/ui/IconButton.tsx` | IconButton | `2697:20` | `Size=Sm` → `size="sm"` · `State=Disabled` → `disabled` · `icon` slot is INSTANCE_SWAP |
| `Card` | `components/ui/Card.tsx` | Card | `2698:8` | `Variant=Elevated` → `variant="elevated"` (or `"outline"`) · TEXT `title` / `body` |
| `ProgressBar` | `components/ui/ProgressBar.tsx` | ProgressBar | `2699:2` | Resize the inner `Fill` rectangle in Figma → set `value` (0–100) in code |
| `NavItem` | `components/ui/NavItem.tsx` | NavItem | `2700:44` | `State=Active` → `active` · `HasBadge=True` → `badge` prop set · TEXT `label` / `badge` |

## Conventions

- Every React component in `components/ui/` mirrors a Figma component on its own page (`Button`, `Input`, etc.) under the `———  Components  ———` separator.
- Visual properties bind to Figma variables; the equivalent CSS variables live in `app/globals.css`. They are deliberately kept in sync 1:1.
- New components must be added to **both** sides simultaneously and to this table, otherwise the design system drifts.
