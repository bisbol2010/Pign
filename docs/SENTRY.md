# Sentry setup (SPEC Week 1 — deferred wiring)

Sentry is specified in [`SPEC.md`](../SPEC.md) but not wired until `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_DSN` are set.

1. Create projects `pign-frontend` and `pign-backend` in Sentry.
2. Run `npx @sentry/wizard@latest -i nextjs` when ready.
3. Add env vars per SPEC §7.

Until then, errors surface via browser console and Convex dashboard logs.
