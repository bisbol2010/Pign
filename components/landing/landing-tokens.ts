/**
 * Marketing landing typography + layout tokens (Figma node 1234:1440).
 * Used via Tailwind arbitrary values and CSS variables in globals.css.
 */
export const landingLayout = {
  maxWidth: 1440,
  gutterSm: 56,
  gutterMd: 64,
  gutterBenefits: 167,
} as const;

export const landingType = {
  eyebrow: "41px",
  display: "128px",
  displayLh: "112px",
  h2Features: "88px",
  h2Integrations: "56px",
  h2Faq: "40px",
  h2Cta: "40px",
  pill: "24px",
  bodyLg: "32px",
  bodyMd: "24px",
  bodySm: "20px",
  nav: "16px",
  ctaLg: "24px",
  ctaSm: "16px",
} as const;
