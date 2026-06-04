import type { Metadata } from "next";
import { PricingContent } from "@/components/marketing/PricingContent";

export const metadata: Metadata = {
  title: "Pricing — Pign",
  description:
    "Choose a Pign plan. Free forever at 15 GB, Personal Pro at $6/month, Teams from $12/user/month, or contact us for Enterprise and Developer/API pricing.",
};

export default function PricingPage() {
  return <PricingContent />;
}
