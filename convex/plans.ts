/**
 * Plan / tier limits for billing enforcement (Phase 5).
 *
 * Pure constants + helpers — NO Convex function registration and NO "use node".
 * Safe to import from both V8-runtime files (queries/mutations) and Node-runtime
 * actions. Canonical pricing lives in docs/plan/01-product-and-pricing-strategy.md
 * §4; storage figures are the confirmed decisions in docs/plan/00-master-plan.md
 * (Free = 15 GB, Personal = 200 GB, Teams = 1 TB pooled + 250 GB/seat).
 */

export type PlanId = "free" | "personal" | "teams" | "enterprise";

export type BillingInterval = "monthly" | "annual";

/** Plans the pricing page can initiate live Stripe checkout for. */
export type CheckoutPlanId = "personal" | "teams";

const GB = 1024 * 1024 * 1024;
const TB = 1024 * GB;

/**
 * `verificationsPerMonth: null` means unlimited (fair use).
 * Storage for Teams is computed dynamically from seats — see storageLimitBytes.
 */
export const PLAN_LIMITS: Record<
  PlanId,
  {
    label: string;
    baseStorageBytes: number;
    perSeatStorageBytes: number;
    verificationsPerMonth: number | null;
    minSeats: number;
  }
> = {
  free: {
    label: "Free",
    baseStorageBytes: 15 * GB,
    perSeatStorageBytes: 0,
    verificationsPerMonth: 10,
    minSeats: 1,
  },
  personal: {
    label: "Personal",
    baseStorageBytes: 200 * GB,
    perSeatStorageBytes: 0,
    verificationsPerMonth: 500,
    minSeats: 1,
  },
  teams: {
    label: "Teams",
    // 1 TB pooled + 250 GB per seat.
    baseStorageBytes: 1 * TB,
    perSeatStorageBytes: 250 * GB,
    verificationsPerMonth: null,
    minSeats: 3,
  },
  enterprise: {
    label: "Enterprise",
    baseStorageBytes: 5 * TB,
    perSeatStorageBytes: 0,
    verificationsPerMonth: null,
    minSeats: 1,
  },
};

export function isPlanId(value: string): value is PlanId {
  return value === "free" || value === "personal" || value === "teams" || value === "enterprise";
}

/**
 * Storage allowance in bytes for a plan.
 *
 * NOTE: Teams storage is "1 TB pooled + 250 GB/seat" across the whole team.
 * True pooled enforcement needs team-wide aggregation, which isn't wired up in
 * Phase 5. We enforce per-user against the full team allowance (a safe
 * over-approximation that never blocks a legitimate Teams user). Tightening this
 * to real pooled accounting is a documented follow-up.
 */
export function storageLimitBytes(plan: PlanId, seats: number = 1): number {
  const def = PLAN_LIMITS[plan];
  const effectiveSeats = Math.max(seats, def.minSeats);
  return def.baseStorageBytes + def.perSeatStorageBytes * effectiveSeats;
}

/** Monthly verification limit; `null` = unlimited. */
export function verificationLimit(plan: PlanId): number | null {
  return PLAN_LIMITS[plan].verificationsPerMonth;
}

export function formatBytes(bytes: number): string {
  if (bytes >= TB) return `${(bytes / TB).toFixed(bytes % TB === 0 ? 0 : 1)} TB`;
  if (bytes >= GB) return `${(bytes / GB).toFixed(bytes % GB === 0 ? 0 : 1)} GB`;
  const MB = 1024 * 1024;
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
  return `${bytes} B`;
}

export const VERIFICATION_PERIOD_MS = 30 * 24 * 60 * 60 * 1000;
