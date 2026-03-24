"use client";

import { SignupForm } from "@/components/auth/SignupForm";
import Image from "next/image";
import { useState, useEffect } from "react";

const slides = [
  {
    title: "Smart Storage",
    description: "Smart file management system for saving important files",
  },
  {
    title: "Secure Sharing",
    description: "Share classified documents with colleagues and family safely",
  },
  {
    title: "AI Powered",
    description: "Find and understand your documents with intelligent search",
  },
];

export default function SignupPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-pign-black flex-col items-center justify-center p-12 relative">
        <div className="absolute top-8 left-8">
          <Image
            src="/pign-logo.svg"
            alt="Pign"
            width={80}
            height={35}
            className="invert"
          />
        </div>
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="w-48 h-48 mb-8 flex items-center justify-center">
            <svg
              width="160"
              height="160"
              viewBox="0 0 160 160"
              fill="none"
              className="text-white"
            >
              <rect x="40" y="50" width="80" height="70" rx="4" stroke="currentColor" strokeWidth="2" />
              <path d="M60 50V30a20 20 0 0140 0v20" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
              <rect x="55" y="40" width="50" height="40" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M65 55h30M65 65h20" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="80" cy="135" r="12" stroke="currentColor" strokeWidth="2" />
              <path d="M80 120v-5" stroke="currentColor" strokeWidth="2" />
              <path d="M74 131l6 6 6-6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-semibold mb-2">
            {slides[currentSlide].title}
          </h2>
          <p className="text-grey-4 text-sm leading-relaxed">
            {slides[currentSlide].description}
          </p>
          <div className="flex gap-2 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === currentSlide ? "bg-white" : "bg-grey-3"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <h1 className="text-grey-3 text-2xl mb-1">Get Started</h1>
          <h2 className="text-pign-black text-3xl font-semibold mb-8">
            Create account
          </h2>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
