"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckoutButton } from "./CheckoutButton";

type Interval = "monthly" | "annual";

const PRICING = {
  free: { monthly: 0, annual: 0 },
  personal: { monthly: 6, annual: 5 },
  teams: { monthly: 12, annual: 10 },
} as const;

const CHECK = "✓";
const DASH = "—";

const featureMatrix: {
  feature: string;
  free: string;
  personal: string;
  teams: string;
  enterprise: string;
  developer: string;
}[] = [
  {
    feature: "Storage quota",
    free: "15 GB",
    personal: "200 GB",
    teams: "1 TB + 250 GB/user",
    enterprise: "Unlimited / custom",
    developer: "100 GB",
  },
  {
    feature: "Pign address",
    free: "Standard (@name-NNNN)",
    personal: "Vanity (@name)",
    teams: "Org domain (@slug)",
    enterprise: "Custom domain",
    developer: "Standard",
  },
  {
    feature: "Verifications / month",
    free: "10",
    personal: "500",
    teams: "Unlimited",
    enterprise: "Unlimited + SLA",
    developer: "5,000 req",
  },
  {
    feature: "Cryptographic hashing",
    free: CHECK,
    personal: CHECK,
    teams: CHECK,
    enterprise: CHECK,
    developer: CHECK,
  },
  {
    feature: "AI OCR & summaries",
    free: "Lexical only",
    personal: "Priority AI",
    teams: "Team AI",
    enterprise: "Custom AI tuning",
    developer: "Programmatic OCR",
  },
  {
    feature: "Entity verification badge",
    free: DASH,
    personal: DASH,
    teams: "Company (manual)",
    enterprise: "Domain / KYC",
    developer: DASH,
  },
  {
    feature: "Integrations & API",
    free: DASH,
    personal: DASH,
    teams: "Slack / business",
    enterprise: "Custom SDKs",
    developer: "Full API + webhooks",
  },
  {
    feature: "Audit log & CSV export",
    free: DASH,
    personal: DASH,
    teams: CHECK,
    enterprise: CHECK,
    developer: DASH,
  },
  {
    feature: "SSO (SAML / OIDC / Okta)",
    free: DASH,
    personal: DASH,
    teams: DASH,
    enterprise: CHECK,
    developer: DASH,
  },
  {
    feature: "Support SLA",
    free: "Best effort",
    personal: "24 hours",
    teams: "12 hours",
    enterprise: "Dedicated 24/7",
    developer: "12 hours",
  },
];

const pricingFaqs = [
  {
    q: "What happens if I exceed my storage limit?",
    a: "Pign enforces a hard quota. When you approach 90% of your quota, you will receive an in-app and email alert. If you cross 100%, new uploads and document receipts are paused until you free up space by shredding old documents or upgrading your plan.",
  },
  {
    q: "How do Pign handles work, and can I change mine?",
    a: "When you sign up, you get an auto-generated handle like john-doe-1234@pign.app. On the Personal (Pro) plan, you can claim a custom vanity handle (e.g. john@pign.app) as long as it is available. Organisations on the Teams plan get custom company addresses like billing@acme.pign.app.",
  },
  {
    q: 'What is a "Pending Delivery" and does it cost anything?',
    a: "If you send a document to an external email address that is not registered with Pign, we send them an out-of-band notification. The document remains in a Pending delivery state in our secure queue. Once they sign up for a free Pign account, the delivery auto-materialises in their inbox. This is completely free for both the sender and the recipient.",
  },
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes, you can cancel your subscription at any time from your settings page. If you cancel, your premium features will remain active until the end of your current billing cycle, after which your account will revert to the Free tier. If your stored files exceed 15 GB, you will have 30 days to download and shred files to meet the free quota before account access is restricted.",
  },
  {
    q: "What is the annual billing discount?",
    a: "Annual billing gives you 2 months free compared to monthly billing — Personal drops from $6/mo to $5/mo, and Teams from $12/user/mo to $10/user/mo. You are billed the full annual amount upfront.",
  },
];

export function PricingContent() {
  const [interval, setInterval] = useState<Interval>("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const btnBase =
    "w-full flex items-center justify-center h-12 text-sm font-semibold transition-colors";

  return (
    <>
      {/* Hero */}
      <section className="border-b border-white/10 py-24 md:py-32">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 min-[1440px]:px-[64px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/landing/mailbox-illustration.svg"
            alt=""
            aria-hidden
            className="mb-8 h-[96px] w-[108px] -rotate-[8deg]"
          />
          <p className="mb-6 text-sm font-medium uppercase tracking-widest text-white/50">
            Uncompromising security
          </p>
          <h1 className="max-w-4xl text-[clamp(48px,7vw,112px)] font-extrabold leading-[0.9] tracking-tight text-white">
            Plans that fit your trust scale.
          </h1>
          <p className="mt-8 max-w-2xl text-xl font-light leading-relaxed text-white/70">
            Every account starts with our canonical cryptographic verification
            engine, private folder routing, and dedicated digital mailbox.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="border-b border-white/10 py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 min-[1440px]:px-[64px]">
          {/* Billing interval toggle — placed directly above the cards */}
          <div className="mb-10 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/20 p-1">
              <button
                type="button"
                onClick={() => setInterval("monthly")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  interval === "monthly"
                    ? "bg-white text-pign-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Billed monthly
              </button>
              <button
                type="button"
                onClick={() => setInterval("annual")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  interval === "annual"
                    ? "bg-white text-pign-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Billed annually
                <span className="rounded-full bg-verify-green px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {/* Free */}
            <div className="flex flex-col rounded-sm border border-white/10 bg-surface-ink-soft p-6">
              <div className="mb-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/40">
                  Free
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="mb-1 text-sm text-white/50">/ month</span>
                </div>
                <p className="mt-3 text-sm font-light leading-relaxed text-white/60">
                  The baseline security setup for personal, content-addressable
                  document archives.
                </p>
              </div>
              <ul className="mb-8 flex-1 space-y-2 text-sm text-white/70">
                {[
                  "15 GB secure quota",
                  "10 verifications per month",
                  "Standard @pign.app handle",
                  "50 document transmittals/month",
                  "Lexical full-text search",
                  "PDF, PNG, JPG, JPEG imports",
                  "End-to-end encryption",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-verify-green">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`${btnBase} border border-white/30 text-white hover:bg-white/10`}
              >
                Get started for free
              </Link>
            </div>

            {/* Personal (Pro) — highlighted */}
            <div className="flex flex-col rounded-sm border border-white bg-surface-ink-soft p-6 ring-1 ring-white">
              <div className="mb-6">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                    Personal (Pro)
                  </p>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-pign-black">
                    Popular
                  </span>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    ${PRICING.personal[interval]}
                  </span>
                  <span className="mb-1 text-sm text-white/50">/ month</span>
                </div>
                {interval === "annual" && (
                  <p className="mt-1 text-xs text-verify-green">
                    Billed annually — 2 months free
                  </p>
                )}
                <p className="mt-3 text-sm font-light leading-relaxed text-white/60">
                  For professionals and power users who need vanity handles,
                  high quotas, and priority OCR.
                </p>
              </div>
              <ul className="mb-8 flex-1 space-y-2 text-sm text-white/70">
                {[
                  "200 GB high-performance quota",
                  "500 verifications per month",
                  "Vanity handle (@yourname@pign.app)",
                  "Unlimited document transmittals",
                  "Priority AI OCR within 60 seconds",
                  "Proactive duplicate detection",
                  "1-click folder bulk-verification",
                  "24-hour email support SLA",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-verify-green">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <CheckoutButton
                planId="personal"
                interval={interval}
                className={`${btnBase} bg-white text-pign-black hover:bg-grey-6`}
              >
                Go Pro
              </CheckoutButton>
            </div>

            {/* Teams / Business */}
            <div className="flex flex-col rounded-sm border border-white/10 bg-surface-ink-soft p-6">
              <div className="mb-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/40">
                  Teams / Business
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    ${PRICING.teams[interval]}
                  </span>
                  <span className="mb-1 text-sm text-white/50">
                    / user / month
                  </span>
                </div>
                {interval === "annual" && (
                  <p className="mt-1 text-xs text-verify-green">
                    Billed annually — 2 months free
                  </p>
                )}
                <p className="mt-3 text-sm font-light leading-relaxed text-white/60">
                  For organisations requiring verified entity status, shared
                  folders, and dual-authorisation audits.
                </p>
              </div>
              <ul className="mb-8 flex-1 space-y-2 text-sm text-white/70">
                {[
                  "1 TB shared quota + 250 GB/user",
                  "Unlimited verifications (fair use)",
                  "Entity verification badge",
                  "Custom org address (@role@company.pign.app)",
                  "Role-based access control",
                  "Interactive duplicate flag dashboard",
                  "Comprehensive audit logs (CSV/API)",
                  "12-hour support SLA",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-verify-green">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <CheckoutButton
                planId="teams"
                interval={interval}
                className={`${btnBase} bg-white text-pign-black hover:bg-grey-6`}
              >
                Create team storage
              </CheckoutButton>
            </div>

            {/* Enterprise */}
            <div className="flex flex-col rounded-sm border border-white/10 bg-surface-ink-soft p-6">
              <div className="mb-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/40">
                  Enterprise
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    Custom
                  </span>
                </div>
                <p className="mt-3 text-sm font-light leading-relaxed text-white/60">
                  For global enterprises, financial institutions, and legal firms
                  requiring SOC2 compliance, custom SLAs, and custom identity
                  providers.
                </p>
              </div>
              <ul className="mb-8 flex-1 space-y-2 text-sm text-white/70">
                {[
                  "Unlimited dedicated cloud storage",
                  "Single-tenant database options",
                  "SSO (SAML, OIDC, Okta, Azure AD)",
                  "Custom legal terms & DPAs",
                  "Wildcard DNS & custom domain routing",
                  "Custom AI fine-tuning & data residency",
                  "24/7/365 dedicated support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-verify-green">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:support@pign.storage?subject=Enterprise%20Inquiry"
                className={`${btnBase} border border-white/30 text-white hover:bg-white/10`}
              >
                Contact sales
              </a>
            </div>

            {/* Developer / API */}
            <div className="flex flex-col rounded-sm border border-white/10 bg-surface-ink-soft p-6">
              <div className="mb-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/40">
                  Developer / API
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    Usage-based
                  </span>
                </div>
                <p className="mt-3 text-sm font-light leading-relaxed text-white/60">
                  For systems integrating cryptographic proof and document
                  transmittal pipelines programmatically.
                </p>
              </div>
              <ul className="mb-8 flex-1 space-y-2 text-sm text-white/70">
                {[
                  "$0.02 / GB storage / month",
                  "$0.05 per verification (tiered to $0.02)",
                  "Full cryptographic verify API",
                  "Automated delivery webhooks",
                  "Programmatic @pign mailbox integration",
                  "100 GB base storage allocation",
                  "SDK libraries & dedicated API support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-verify-green">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/help"
                className={`${btnBase} border border-white/30 text-white hover:bg-white/10`}
              >
                Contact us / see docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="border-b border-white/10 py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 min-[1440px]:px-[64px]">
          <h2 className="mb-12 text-[clamp(24px,3vw,40px)] font-bold text-white">
            Full feature comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-4 pr-4 text-left font-medium text-white/50">
                    Feature
                  </th>
                  {["Free", "Personal", "Teams", "Enterprise", "Developer"].map(
                    (col) => (
                      <th
                        key={col}
                        className="pb-4 pr-4 text-left font-semibold text-white last:pr-0"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {featureMatrix.map(
                  ({ feature, free, personal, teams, enterprise, developer }) => (
                    <tr
                      key={feature}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="py-3 pr-4 font-medium text-white/70">
                        {feature}
                      </td>
                      {[free, personal, teams, enterprise, developer].map(
                        (val, i) => (
                          <td
                            key={i}
                            className={`py-3 pr-4 last:pr-0 ${
                              val === CHECK
                                ? "text-verify-green font-bold text-base"
                                : val === DASH
                                ? "text-white/30"
                                : "text-white/70"
                            }`}
                          >
                            {val}
                          </td>
                        )
                      )}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Security trust callouts */}
      <section className="border-b border-white/10 py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 min-[1440px]:px-[64px]">
          <h2 className="mb-12 text-[clamp(24px,3vw,40px)] font-bold text-white">
            Security you can trust
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Cryptographic provenance",
                body: "Every document on Pign is mapped to its SHA-256 hash. Once an approved issuer distributes a document, its hash is recorded in an immutable ledger, protecting it from forgery forever.",
              },
              {
                title: "End-to-end encryption",
                body: "Documents are encrypted in transit using TLS 1.3 and at rest using AES-256. Metadata is isolated and kept strictly private.",
              },
              {
                title: "SOC2-ready architecture",
                body: "Built by cybersecurity engineers. Designed to meet strict compliance guidelines for medical, financial, and legal sectors.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="rounded-sm border border-white/10 bg-surface-ink-soft p-8"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-verify-green/20">
                  <span className="text-sm text-verify-green">✓</span>
                </div>
                <h3 className="mb-3 text-base font-semibold text-white">
                  {title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-white/60">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 min-[1440px]:px-[64px]">
          <h2 className="mb-12 text-[clamp(24px,3vw,40px)] font-bold text-white">
            Pricing FAQ
          </h2>
          <div className="max-w-3xl space-y-3">
            {pricingFaqs.map(({ q, a }, i) => (
              <div
                key={i}
                className="rounded-sm border border-white/10 bg-surface-ink-soft"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-6 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="text-base font-semibold text-white">{q}</span>
                  <span
                    className={`shrink-0 text-white/50 transition-transform ${
                      openFaq === i ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="border-t border-white/10 px-6 pb-6 pt-4">
                    <p className="text-sm font-light leading-relaxed text-white/70">
                      {a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
