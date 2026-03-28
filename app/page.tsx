import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Search,
  Share2,
  Zap,
  FileCheck,
  Globe,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Storage",
    description:
      "Your important documents are encrypted and stored securely. Access them anywhere, anytime with confidence.",
  },
  {
    icon: Search,
    title: "AI-Powered Search",
    description:
      "Find any document instantly with intelligent search. Our AI understands your documents and helps you learn about them.",
  },
  {
    icon: Share2,
    title: "Secure Sharing",
    description:
      "Share classified documents with colleagues, family and friends through a secure network with full access control.",
  },
  {
    icon: FileCheck,
    title: "Document Verification",
    description:
      "Prevent file forgery through our verification system. Know that your documents are authentic and untampered.",
  },
  {
    icon: Zap,
    title: "Instant Access",
    description:
      "Birth certificates, proof of identity, official letters — all accessible at your fingertips when you need them most.",
  },
  {
    icon: Globe,
    title: "Business Integration",
    description:
      "Integrate with your business to send formal letters and classified documents. Set up teams for mass distribution.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="shrink-0 border-b border-grey-6">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Image src="/pign-logo.svg" alt="Pign" width={70} height={30} />
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-grey-2 hover:text-pign-black transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-pign-black text-white text-sm px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="py-24 px-6" aria-labelledby="landing-hero-heading">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              id="landing-hero-heading"
              className="text-5xl font-bold text-pign-black leading-tight mb-6"
            >
              Your official documents,
              <br />
              <span className="text-grey-3">always within reach.</span>
            </h1>
            <p className="text-lg text-grey-3 max-w-xl mx-auto mb-10 leading-relaxed">
              Pign is your secure digital mailbox for storing important letters and
              documents. No more cluttered inboxes or paper waste — just your
              vital documents, organised and accessible when you need them.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/signup"
                className="bg-pign-black text-white px-8 py-3.5 rounded-lg font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                Start for free
                <ArrowRight size={16} aria-hidden />
              </Link>
              <Link
                href="/login"
                className="border border-grey-5 text-pign-black px-8 py-3.5 rounded-lg font-medium text-sm hover:bg-grey-7 transition-colors"
              >
                Log in
              </Link>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="py-20 px-6 bg-background"
          aria-labelledby="features-heading"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 id="features-heading" className="text-3xl font-bold text-pign-black mb-4">
                Everything you need for your documents
              </h2>
              <p className="text-grey-3 max-w-md mx-auto">
                Born out of real challenges with finding documents for visa
                applications, mortgages, and job applications.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-xl p-6 border border-grey-6 hover:shadow-sm transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-pign-black flex items-center justify-center mb-4">
                    <feature.icon size={20} className="text-white" aria-hidden />
                  </div>
                  <h3 className="text-base font-semibold text-pign-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-grey-3 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6" aria-labelledby="landing-cta-heading">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="landing-cta-heading" className="text-3xl font-bold text-pign-black mb-4">
              Stop searching. Start finding.
            </h2>
            <p className="text-grey-3 mb-10 leading-relaxed">
              Whether it&apos;s a birth certificate, proof of address, or an
              important letter — Pign keeps your documents safe, verified, and
              ready when life demands them.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-pign-black text-white px-8 py-3.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Create your free account
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </section>
      </main>

      <footer className="shrink-0 border-t border-grey-6 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Image src="/pign-logo.svg" alt="Pign" width={50} height={22} />
          <p className="text-xs text-grey-4">
            &copy; {new Date().getFullYear()} Pign. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
