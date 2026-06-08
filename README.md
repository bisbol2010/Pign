# Pign

Registered document exchange with a mailbox UX — store, verify, send, and share important documents.

**Product spec:** [`SPEC.md`](./SPEC.md) (v1 locked).  
**Design mapping:** [`design/frame-map.md`](./design/frame-map.md).

## Stack

- Next.js 16 (App Router) + React 19
- Convex + `@convex-dev/auth`
- Tailwind CSS v4

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npx convex dev       # second terminal — required for auth/dashboard
```

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest (smoke + future convex-test) |

### Troubleshooting

- **Resend / magic link (`API key is invalid`)** — Set `AUTH_RESEND_KEY` on the Convex deployment.
- **Password sign-in (`InvalidSecret`)** — Wrong password or email mismatch vs sign-up.
- **Hydration warning with `data-cursor-ref`** — Cursor IDE browser automation; verify in Chrome/Safari.
- **`params` / `searchParams` Promise warnings** — Often devtools noise on Next.js 16; app routes use client `useParams()` where needed.

## CI

GitHub Actions runs lint, typecheck, test, and build on push/PR (see [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)).

Optional: set repo secret `CONVEX_DEPLOY_KEY` to enable `convex deploy --dry-run` in CI.

## Current build status

| Area | Status |
|------|--------|
| Marketing landing (Figma `1234:1440`) | Implemented at `/` |
| Auth (password) | Working locally |
| v1 schema widen (deploy 1) | Tables added in `convex/schema.ts`; mutations follow SPEC weeks 2–9 |
| Sentry | Documented in [`docs/SENTRY.md`](./docs/SENTRY.md) |

## Reviews

Landing code review packet: [`docs/reviews/landing-1234-1440-review-packet.md`](./docs/reviews/landing-1234-1440-review-packet.md).
