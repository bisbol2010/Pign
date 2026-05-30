"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { GridBackdrop } from "@/components/landing/GridBackdrop";

const slides = [
  {
    title: "A mailbox just for important post",
    description:
      "Pign keeps your IDs, contracts and official letters in one private place — so you never lose another one.",
    image: "/landing/mailbox-illustration.svg",
  },
  {
    title: "Share without losing control",
    description:
      "Send any document as a signed link. Revoke it the moment you stop needing them to see it.",
    image: "/landing/paper-plane-glyph.svg",
  },
  {
    title: "Verified, every single time",
    description:
      "Each file is fingerprinted on upload, so forged or tampered documents stand out immediately.",
    image: "/landing/sparkle-star.svg",
  },
];

export function AuthIllustration() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative hidden flex-col items-center justify-center bg-pign-black p-12 lg:flex lg:w-1/2">
      <GridBackdrop />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(26,26,26,0) 34%, var(--color-pign-black) 94%)",
        }}
      />

      <div className="absolute left-8 top-8 z-10">
        <Image
          src="/pign-logo.svg"
          alt="Pign"
          width={80}
          height={35}
          className="invert"
        />
      </div>

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        <div className="mb-10 flex h-48 w-48 items-center justify-center text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slides[currentSlide].image}
            alt=""
            aria-hidden
            className="h-auto max-h-40 w-auto max-w-40 object-contain"
          />
        </div>
        <h2 className="text-2xl font-semibold text-white">
          {slides[currentSlide].title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          {slides[currentSlide].description}
        </p>
        <div
          className="mt-8 flex gap-2"
          role="tablist"
          aria-label="Feature highlights"
        >
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="tab"
              aria-selected={i === currentSlide}
              aria-label={s.title}
              onClick={() => setCurrentSlide(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === currentSlide ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
