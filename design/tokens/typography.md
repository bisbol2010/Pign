# Typography tokens — marketing landing (Figma `1234:1440`)

Font family: **Bricolage Grotesque** (`--font-bricolage` in [`app/layout.tsx`](../../app/layout.tsx)). Figma also references PP Neue Montreal / PP Right Grotesk for some nodes; we substitute Bricolage for the whole marketing page.

| Role | Figma size | Line height | Weight | Tailwind / CSS |
|------|------------|-------------|--------|----------------|
| Hero eyebrow | 41px | normal | light (300) | `text-[41px] font-light` |
| Hero display | 128px | 112px | ExtraBold (800) | `text-[128px] leading-[112px] font-extrabold text-[#F2F2F2]` |
| Hero CTA | 24px | normal | Bold | `text-[24px] font-bold` |
| Nav / header CTA | 16px | normal | Medium / Bold | `text-base` |
| Benefits band | 48px | normal | Medium | `text-[48px] font-medium` |
| Benefits list | 24px | tight | Medium | `text-[24px] font-medium` |
| Features H2 | 88px | ~1.05 | Medium | `text-[88px] font-medium` |
| Feature card title | 60px | 1 | Medium | `text-[60px] font-medium` |
| Feature card body | 32px | 1.43 | Light | `text-[32px] font-light` |
| Integrations H2 | 56px | 1.1 | Medium | `text-[56px] font-medium` |
| Integration card title | 24px | 1 | Medium | `text-[24px] font-medium` |
| FAQ H2 | 40px | 1.1 | Medium | `text-[40px] font-medium` |
| FAQ item | 20px | 1.4 / 32px body | Medium | `text-[20px] font-medium` |
| Join CTA H2 | 40px | normal | Medium | `text-[40px] font-medium` |
| Footer links | 20px | 1 | Medium | `text-[20px] font-medium` |

CSS variables in [`app/globals.css`](../../app/globals.css): `--landing-display`, `--landing-eyebrow`, etc.

Below 1440px, components use `clamp()` for fluid scaling (no Figma mobile spec).
