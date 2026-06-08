"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import type { DashboardSlide } from "./dashboard-slides";

type DashboardCarouselProps = {
  slides: DashboardSlide[];
  autoPlayMs?: number;
  className?: string;
};

const MANUAL_RESTART_DELAY_MS = 6000;

export function DashboardCarousel({
  slides,
  autoPlayMs = 5000,
  className = "",
}: DashboardCarouselProps) {
  const total = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPausedByHover, setIsPausedByHover] = useState(false);
  const [isPausedByFocus, setIsPausedByFocus] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isRestartBlocked, setIsRestartBlocked] = useState(false);
  const restartTimeoutRef = useRef<number | null>(null);

  const canLoop = total > 1;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setIsReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const pauseAuto = useMemo(
    () => isReducedMotion || isPausedByHover || isPausedByFocus || isRestartBlocked,
    [isPausedByFocus, isPausedByHover, isReducedMotion, isRestartBlocked],
  );

  const scheduleAutoplayRestart = () => {
    if (restartTimeoutRef.current) {
      window.clearTimeout(restartTimeoutRef.current);
    }
    setIsRestartBlocked(true);
    restartTimeoutRef.current = window.setTimeout(() => {
      setIsRestartBlocked(false);
      restartTimeoutRef.current = null;
    }, MANUAL_RESTART_DELAY_MS);
  };

  useEffect(
    () => () => {
      if (restartTimeoutRef.current) {
        window.clearTimeout(restartTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!canLoop || pauseAuto) return;
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, autoPlayMs);
    return () => window.clearInterval(interval);
  }, [autoPlayMs, canLoop, pauseAuto, total]);

  const goToIndex = (nextIndex: number, manual = false) => {
    if (!canLoop) return;
    const normalised = ((nextIndex % total) + total) % total;
    setActiveIndex(normalised);
    if (manual) {
      scheduleAutoplayRestart();
    }
  };

  const goPrev = () => goToIndex(activeIndex - 1, true);
  const goNext = () => goToIndex(activeIndex + 1, true);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!canLoop) return;
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        goPrev();
        break;
      case "ArrowRight":
        event.preventDefault();
        goNext();
        break;
      case "Home":
        event.preventDefault();
        goToIndex(0, true);
        break;
      case "End":
        event.preventDefault();
        goToIndex(total - 1, true);
        break;
      default:
        break;
    }
  };

  const prevSlide = slides[(activeIndex - 1 + total) % total];
  const nextSlide = slides[(activeIndex + 1) % total];

  return (
    <div
      className={`relative ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Pign product preview carousel"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsPausedByHover(true)}
      onMouseLeave={() => setIsPausedByHover(false)}
      onFocusCapture={() => setIsPausedByFocus(true)}
      onBlurCapture={() => setIsPausedByFocus(false)}
    >
      <div
        aria-hidden
        className="absolute left-0 top-[160px] hidden h-[642px] w-[64px] overflow-hidden min-[1440px]:block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={prevSlide.imageSrc}
          alt=""
          className="absolute left-[-838px] top-0 h-full w-[902px] max-w-none object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, var(--surface-ink) 72%, var(--surface-ink) 84%)",
          }}
        />
      </div>

      <div className="relative mx-auto mt-20 h-[min(50vh,562px)] w-full max-w-[902px] overflow-hidden min-[1440px]:absolute min-[1440px]:left-[269px] min-[1440px]:top-[160px] min-[1440px]:mt-0 min-[1440px]:h-[642px]">
        <ul
          className={`flex h-full w-full ${isReducedMotion ? "" : "transition-transform duration-500 ease-out"}`}
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <li
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${total}: ${slide.title}`}
              aria-hidden={index !== activeIndex}
              className="relative h-full w-full shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.imageSrc}
                alt={slide.imageAlt}
                loading={index === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0) 0%, var(--surface-ink) 72%, var(--surface-ink) 84%)",
                }}
              />
            </li>
          ))}
        </ul>
      </div>

      <div
        aria-hidden
        className="absolute right-0 top-[160px] hidden h-[642px] w-[64px] overflow-hidden min-[1440px]:block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={nextSlide.imageSrc}
          alt=""
          className="absolute left-0 top-0 h-full w-[902px] max-w-none object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, var(--surface-ink) 72%, var(--surface-ink) 84%)",
          }}
        />
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={goPrev}
        className="absolute left-6 top-1/2 z-10 flex h-[37px] w-[57px] -translate-y-1/2 items-center justify-center min-[1440px]:left-[90px] min-[1440px]:top-[363px] min-[1440px]:translate-y-0"
      >
        <Image
          src="/landing/carousel-arrow-left.svg"
          alt=""
          aria-hidden
          width={57}
          height={37}
        />
      </button>

      <button
        type="button"
        aria-label="Next slide"
        onClick={goNext}
        className="absolute right-6 top-1/2 z-10 flex h-[37px] w-[57px] -translate-y-1/2 items-center justify-center min-[1440px]:right-[90px] min-[1440px]:top-[363px] min-[1440px]:translate-y-0"
      >
        <Image
          src="/landing/carousel-arrow-right.svg"
          alt=""
          aria-hidden
          width={57}
          height={37}
          className="rotate-180"
        />
      </button>

      <div className="mt-6 flex items-center justify-center gap-2 min-[1440px]:absolute min-[1440px]:left-1/2 min-[1440px]:top-[820px] min-[1440px]:mt-0 min-[1440px]:-translate-x-1/2">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => goToIndex(index, true)}
              className={`h-2 w-2 rounded-full transition-colors ${isActive ? "bg-white" : "bg-white/40 hover:bg-white/70"}`}
            />
          );
        })}
      </div>
    </div>
  );
}
