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
| `landing/page` (master) | `1234:1440` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=1234-1440) | `design/screens/_inventory/linked-node-1234-1440.png` | `implemented` | Composes the 7 sections below. Routed at `/` via `app/page.tsx`. |
| `landing/hero` | `1234:1600` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=1234-1600) | — | `implemented` | `components/landing/Hero.tsx` + `MarketingHeader.tsx` + `GridBackdrop.tsx`. Mailbox SVG at `public/landing/mailbox-illustration.svg`. |
| `landing/benefits` | `1234:1575` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=1234-1575) | — | `implemented` | `components/landing/Benefits.tsx`. Combines the "Avoid junk emails ★ Filter priority mails ★ Smart AI verification" band + tabs + 7-bullet card. Side illustration at `public/landing/benefits-illustration.svg`. |
| `landing/features` | `1234:1464` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=1234-1464) | — | `implemented` | `components/landing/Features.tsx`. Uses `public/landing/features-wave-bg.svg`, `features-folder.svg`, `features-document.svg`, `curved-arrow.svg`. |
| `landing/integrations` | `1240:473` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=1240-473) | — | `implemented` | `components/landing/Integrations.tsx`. 4+3+2 brand grid; placeholder "Slack × 9" replaced per open decision #1 with Slack/Drive/Dropbox/Notion/Gmail/Teams/Zapier/Linear/Asana. Icons via lucide-react. |
| `landing/faq` | `1240:527` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=1240-527) | — | `implemented` | `components/landing/FAQ.tsx`. 5 accordion items, first open by default. |
| `landing/join-cta` | `1240:565` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=1240-565) | — | `implemented` | `components/landing/JoinCTA.tsx`. Dashboard-mockup carousel uses `public/landing/dashboard-preview.png` (per open decision #2) with `carousel-arrow-left/right.svg` nav. |
| `landing/footer` | `1240:526` | [link](https://www.figma.com/design/DH23JKHKdPD3NEgtz6cU6G/Pgin---pign---pijn-Digital-mail-box?node-id=1240-526) | — | `implemented` | `components/landing/MarketingFooter.tsx`. Link row + 5 social icons + `footer-up-arrow.svg` scroll-to-top button. |

## Status legend

- `inventory` — frame discovered, not yet named.
- `named` — semantic name assigned, PNG exported.
- `tokens-extracted` — design tokens (colors, type, spacing) pulled into `design/tokens/`.
- `implemented` — code matches design within agreed tolerance.
- `obsolete` — frame retired or replaced.
