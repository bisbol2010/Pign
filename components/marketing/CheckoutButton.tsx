"use client";

/**
 * Checkout button for Personal and Teams plans.
 *
 * Interface contract with convex/billing.ts (being built in parallel):
 *   api.billing.createCheckoutSession({ planId: "personal" | "teams", interval: "monthly" | "annual" })
 *   → { url: string }
 *   then window.location.href = url
 *
 * TODO: Remove the `as any` cast once convex/billing.ts is deployed and
 * `api.billing` is present in the generated API.
 */

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { FunctionReference } from "convex/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _billingModule = (api as any)?.billing;

const createCheckoutSessionRef: FunctionReference<"action"> | undefined =
  _billingModule?.createCheckoutSession;

const BILLING_AVAILABLE = Boolean(createCheckoutSessionRef);

type PlanId = "personal" | "teams";
type Interval = "monthly" | "annual";

interface CheckoutButtonProps {
  planId: PlanId;
  interval: Interval;
  className?: string;
  children: React.ReactNode;
}

function LiveCheckoutButton({
  planId,
  interval,
  className,
  children,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safe to call unconditionally — LiveCheckoutButton only mounts when
  // BILLING_AVAILABLE is true, i.e. createCheckoutSessionRef is defined.
  const startCheckout = useAction(createCheckoutSessionRef!);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const { url } = await startCheckout({ planId, interval });
      window.location.href = url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`${className} disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {loading ? "Redirecting…" : children}
      </button>
      {error && (
        <p className="mt-2 text-center text-xs text-verify-red">{error}</p>
      )}
    </div>
  );
}

/** Rendered when billing module is not yet deployed. */
function ComingSoonButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled
      title="Checkout coming soon"
      className={`${className} opacity-50 cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

export function CheckoutButton(props: CheckoutButtonProps) {
  if (!BILLING_AVAILABLE) {
    return (
      <ComingSoonButton className={props.className}>
        {props.children}
      </ComingSoonButton>
    );
  }
  return <LiveCheckoutButton {...props} />;
}
