import type { Metadata } from "next";
import { HelpContent } from "@/components/marketing/HelpContent";

export const metadata: Metadata = {
  title: "Help & Support — Pign",
  description:
    "Get answers to common questions about your Pign mailbox, document verification, secure sharing, and billing.",
};

export default function HelpPage() {
  return <HelpContent />;
}
