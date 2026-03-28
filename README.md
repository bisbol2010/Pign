This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Development troubleshooting

- **Resend / magic link (`API key is invalid`)** — Set a valid Resend API key on your Convex deployment (e.g. `npx convex env set AUTH_RESEND_KEY re_...`). Match the variable name to your Convex Auth + Resend provider configuration.
- **Password sign-in (`InvalidSecret`)** — Wrong password or email does not match the account used at sign-up (including spelling and casing).
- **Console spam: `params` / `searchParams` is a Promise** — Often triggered when devtools or the in-IDE browser inspects the React tree (`Object.keys` on props). Dynamic routes in this app use client `useParams()` where needed; this is usually tooling noise, not a missing app fix.
- **Hydration warning on `<body>` with `cursor: crosshair`** — Usually the editor’s browser / element picker injecting styles, not the app. Confirm in a normal browser if unsure.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
