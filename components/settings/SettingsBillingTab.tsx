"use client";

import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatBytes } from "@/convex/plans";

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  personal: "Personal",
  teams: "Teams",
  enterprise: "Enterprise",
};

export function SettingsBillingTab() {
  const sub = useQuery(api.subscriptions.getMySubscription);
  const createCheckout = useAction(api.billing.createCheckoutSession);
  const createPortal = useAction(api.billing.createPortalSession);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (
    planId: "personal" | "teams",
    interval: "monthly" | "annual"
  ) => {
    setBusy(`${planId}-${interval}`);
    setError(null);
    try {
      const { url } = await createCheckout({ planId, interval });
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start checkout.");
      setBusy(null);
    }
  };

  const openPortal = async () => {
    setBusy("portal");
    setError(null);
    try {
      const { url } = await createPortal({});
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open billing portal.");
      setBusy(null);
    }
  };

  if (sub === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-grey-5 border-t-pign-black" />
      </div>
    );
  }

  if (sub === null) {
    return (
      <p className="py-16 text-center text-[16px] text-grey-3">
        Sign in to manage your billing.
      </p>
    );
  }

  const planLabel = PLAN_LABELS[sub.plan] ?? sub.plan;
  const isPaid = sub.plan !== "free";
  const verificationLimitLabel =
    sub.verificationLimit === null ? "Unlimited" : `${sub.verificationLimit}/mo`;

  return (
    <div className="max-w-[640px]">
      {/* Current plan */}
      <div className="border border-grey-6 p-[20px]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[12px] uppercase tracking-wider text-grey-3">
              Current plan
            </p>
            <p className="mt-[4px] text-[24px] font-medium text-pign-black">
              {planLabel}
            </p>
            {sub.status ? (
              <p className="mt-[2px] text-[13px] capitalize text-grey-3">
                {sub.status}
                {sub.interval ? ` · ${sub.interval}` : ""}
              </p>
            ) : null}
          </div>
          {sub.hasStripeCustomer ? (
            <button
              type="button"
              onClick={() => void openPortal()}
              disabled={busy === "portal"}
              className="border border-pign-black px-[18px] py-[10px] text-[14px] font-medium text-pign-black transition-colors hover:bg-grey-7 disabled:opacity-40"
            >
              {busy === "portal" ? "Opening…" : "Manage subscription"}
            </button>
          ) : null}
        </div>

        <dl className="mt-[20px] grid grid-cols-2 gap-[12px] text-[14px]">
          <div>
            <dt className="text-grey-3">Storage</dt>
            <dd className="text-pign-black">
              {formatBytes(sub.storageLimitBytes)}
            </dd>
          </div>
          <div>
            <dt className="text-grey-3">Verifications</dt>
            <dd className="text-pign-black">{verificationLimitLabel}</dd>
          </div>
          {sub.currentPeriodEnd ? (
            <div>
              <dt className="text-grey-3">Renews</dt>
              <dd className="text-pign-black">
                {new Date(sub.currentPeriodEnd).toLocaleDateString()}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>

      {/* Upgrade options */}
      {!isPaid && (
        <div className="mt-[24px]">
          <h3 className="text-[16px] font-medium text-pign-black">
            Upgrade your plan
          </h3>
          <div className="mt-[12px] grid grid-cols-1 gap-[16px] sm:grid-cols-2">
            <PlanCard
              name="Personal"
              blurb="200 GB storage · 500 verifications/mo"
              busyKey={busy}
              onMonthly={() => void startCheckout("personal", "monthly")}
              onAnnual={() => void startCheckout("personal", "annual")}
              planId="personal"
            />
            <PlanCard
              name="Teams"
              blurb="1 TB pooled + 250 GB/seat · unlimited verifications"
              busyKey={busy}
              onMonthly={() => void startCheckout("teams", "monthly")}
              onAnnual={() => void startCheckout("teams", "annual")}
              planId="teams"
            />
          </div>
        </div>
      )}

      {error && (
        <p className="mt-[16px] text-[13px] font-medium text-verify-red">
          {error}
        </p>
      )}
    </div>
  );
}

function PlanCard({
  name,
  blurb,
  planId,
  busyKey,
  onMonthly,
  onAnnual,
}: {
  name: string;
  blurb: string;
  planId: "personal" | "teams";
  busyKey: string | null;
  onMonthly: () => void;
  onAnnual: () => void;
}) {
  return (
    <div className="border border-grey-6 p-[16px]">
      <p className="text-[18px] font-medium text-pign-black">{name}</p>
      <p className="mt-[4px] text-[13px] text-grey-3">{blurb}</p>
      <div className="mt-[16px] flex gap-[10px]">
        <button
          type="button"
          onClick={onMonthly}
          disabled={busyKey !== null}
          className="flex-1 bg-pign-black px-[14px] py-[10px] text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {busyKey === `${planId}-monthly` ? "…" : "Monthly"}
        </button>
        <button
          type="button"
          onClick={onAnnual}
          disabled={busyKey !== null}
          className="flex-1 border border-pign-black px-[14px] py-[10px] text-[13px] font-medium text-pign-black transition-colors hover:bg-grey-7 disabled:opacity-40"
        >
          {busyKey === `${planId}-annual` ? "…" : "Annual"}
        </button>
      </div>
    </div>
  );
}
