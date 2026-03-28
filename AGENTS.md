<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

For **Server Component** `page.tsx` files that receive route props, `params` and `searchParams` are **Promises** in Next.js 16: use an `async` page and `await params` / `await searchParams` (see [sync dynamic APIs](https://nextjs.org/docs/messages/sync-dynamic-apis)). Client pages should keep using `useParams()` / `useSearchParams()` from `next/navigation` where appropriate.
<!-- END:nextjs-agent-rules -->

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
