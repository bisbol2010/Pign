"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import {
  LockShieldIllustration,
  StarSparkIllustration,
} from "@/components/illustrations";
import { SectionShell } from "./SectionShell";

type FeatureId = "smart-storage" | "file-verification" | "secure-encrypted";

type Feature = {
  id: FeatureId;
  label: string;
  heading: string;
  body: string;
  cta: string;
  href: string;
};

const FEATURES: Feature[] = [
  {
    id: "smart-storage",
    label: "Smart storage",
    heading: "Smart storage",
    body: "Drop in documents and let Pign do the filing. AI reads, tags and organises everything — and finds any letter, contract or certificate the moment you search for it.",
    cta: "How smart storage works",
    href: "/help#uploads",
  },
  {
    id: "file-verification",
    label: "File verification",
    heading: "File verification",
    body: "Every document is fingerprinted on upload and locked to its owner, so you can prove it’s genuine and untampered. Pign flags duplicates automatically, and you can verify an entire folder in one click.",
    cta: "How verification works",
    href: "/help#verification",
  },
  {
    id: "secure-encrypted",
    label: "Secure & encrypted",
    heading: "Secure & encrypted",
    body: "Your documents are encrypted in transit and at rest, and locked to your account. You decide exactly who can open them — with links you can make one-time, time-limited, or revoke instantly.",
    cta: "How encryption works",
    href: "/privacy",
  },
];

// Figma card geometry (node 1240:467). The whole card is rendered as a fixed
// 1295x597 "stage" that is uniformly scaled to fit, so every coordinate below
// is an exact Figma value.
const STAGE_W = 1295;
const STAGE_H = 597;
// Vertical delta between consecutive text panels. Sized so a panel's
// heading + body + CTA link all sit ABOVE the next (ghosted) panel.
const SLOT = 450;
const TEXT_LEFT = 580;
// Text block is lifted toward the top of the card (was 142 in Figma) to
// reclaim the empty band under the wave crest and make room for the CTA.
const TEXT_TOP = 92;
const TEXT_WIDTH = 634;
const BODY_WIDTH = 557;
// Gap between the section header and the card stage (`mt-[16px]` on the wrap)
// and the top/bottom breathing room used while the section is pinned. Both are
// shared with the scale math so the card is guaranteed to fit the viewport
// (header + card + padding) without the CTA being clipped.
const CARD_GAP = 16;
const PIN_PADDING_Y = 48;
const ARCH = { left: 154, top: 145, width: 247, height: 326 };
const FOLDER = { left: 30, top: 86, width: 266, height: 289 };
const TRAIL = { left: 0, top: 362, width: 526, height: 181 };

// Pinned flowing wave ("water in a glass"). The crest oscillates between a
// peak (y=4) and a trough/baseline (y=28) where it meets the card's side
// walls; an edge envelope eases the amplitude to zero at both ends so the
// stroke endpoints always sit on the wall tops, keeping one closed outline.
const WAVE = {
  base: 28,
  amp: 24,
  k: (2 * Math.PI) / 84, // ~84px wavelength, matching the original crest
  margin: 80, // px over which amplitude ramps in from each edge
  samples: 160, // ~10 points per wavelength so the smoothed curve stays fluid
  height: 30,
  inset: 1, // align endpoints with the 2px border centerline
};

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Build the stroke (open curve) and fill (curve closed to the baseline) path
 *  data for a given travelling-wave phase. Endpoints are pinned at y=base.
 *  Points are joined with quadratic segments (each sample is a control point,
 *  the curve passes through the midpoints) so the crest reads as fluid water
 *  rather than a faceted polyline. */
function buildWavePaths(phase: number) {
  const { base, amp, k, margin, samples, inset } = WAVE;
  const x0 = inset;
  const x1 = STAGE_W - inset;
  const span = x1 - x0;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= samples; i++) {
    const x = x0 + (span * i) / samples;
    const env = smoothstep(0, margin, x) * smoothstep(0, margin, STAGE_W - x);
    const y = base - amp * env * (0.5 + 0.5 * Math.sin(k * x + phase));
    pts.push([x, y]);
  }
  let stroke = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)} `;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    stroke += `Q${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)} `;
  }
  const last = pts[pts.length - 1];
  stroke += `L${last[0].toFixed(2)} ${last[1].toFixed(2)} `;
  const fill = `${stroke}L${x1.toFixed(2)} ${base} L${x0.toFixed(2)} ${base} Z`;
  return { stroke: stroke.trim(), fill };
}

/** Animated, edge-pinned wave crest that forms the top of the card outline. */
function WaveCrest() {
  const strokeRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const initial = buildWavePaths(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const speed = (2 * Math.PI) / 6000; // one wavelength per ~6s
    const tick = (t: number) => {
      const { stroke, fill } = buildWavePaths(t * speed);
      strokeRef.current?.setAttribute("d", stroke);
      fillRef.current?.setAttribute("d", fill);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-0 top-0"
      width={STAGE_W}
      height={WAVE.height}
      viewBox={`0 0 ${STAGE_W} ${WAVE.height}`}
      fill="none"
    >
      <path ref={fillRef} d={initial.fill} fill="#313131" />
      <path
        ref={strokeRef}
        d={initial.stroke}
        stroke="#F2F2F2"
        strokeWidth={2}
        fill="none"
      />
    </svg>
  );
}

/** Arch container (rounded-top outlined frame) that clips its illustration,
 *  mirroring Figma `Frame 29563`. The active illustration crossfades in. */
function Arch({ activeIndex }: { activeIndex: number }) {
  return (
    <div
      aria-hidden
      className="absolute overflow-hidden rounded-t-[360px] border-2 border-grey-7"
      style={{
        left: ARCH.left,
        top: ARCH.top,
        width: ARCH.width,
        height: ARCH.height,
      }}
    >
      <div
        className="absolute transition-opacity duration-500"
        style={{
          left: FOLDER.left,
          top: FOLDER.top,
          width: FOLDER.width,
          height: FOLDER.height,
          opacity: activeIndex === 0 ? 1 : 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/landing/features-folder.svg"
          alt=""
          className="h-full w-full"
        />
      </div>
      {/* TODO(art): placeholder icon for File verification until real art exists. */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{ opacity: activeIndex === 1 ? 1 : 0 }}
      >
        <StarSparkIllustration className="h-[130px] w-[130px] text-white" />
      </div>
      {/* TODO(art): placeholder icon for Secure & encrypted until real art exists. */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{ opacity: activeIndex === 2 ? 1 : 0 }}
      >
        <LockShieldIllustration className="h-[150px] w-[130px] text-white" />
      </div>
    </div>
  );
}

/** The full Figma card rendered at native 1295x597 then scaled uniformly. */
function Stage({
  scale,
  activeIndex,
  single = false,
}: {
  scale: number;
  activeIndex: number;
  single?: boolean;
}) {
  const indices = single ? [activeIndex] : FEATURES.map((_, i) => i);
  return (
    <div
      className="mx-auto"
      style={{ width: STAGE_W * scale, height: STAGE_H * scale }}
    >
      <div
        className="relative"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* Static card body (gradient fill + left/right/bottom borders). */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 top-[28px]"
          style={{
            borderLeft: "2px solid #F2F2F2",
            borderRight: "2px solid #F2F2F2",
            borderBottom: "2px solid #F2F2F2",
            background: "linear-gradient(to bottom, #313131, rgba(49,49,49,0))",
          }}
        />
        {/* Edge-pinned wave crest flowing horizontally like water. */}
        <WaveCrest />

        <Arch activeIndex={activeIndex} />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/landing/curved-arrow.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute select-none"
          style={{
            left: TRAIL.left,
            top: TRAIL.top,
            width: TRAIL.width,
            height: TRAIL.height,
          }}
        />

        <div
          className="absolute overflow-hidden"
          style={{
            left: TEXT_LEFT,
            top: TEXT_TOP,
            width: TEXT_WIDTH,
            height: STAGE_H - TEXT_TOP,
          }}
        >
          <div
            className="relative h-full transition-transform duration-500 ease-out"
            style={{
              transform: single ? "none" : `translateY(${-activeIndex * SLOT}px)`,
            }}
          >
            {indices.map((i) => {
              const feature = FEATURES[i];
              const offset = single ? 0 : i - activeIndex;
              const isActive = offset === 0;
              const headingStyle: CSSProperties = {
                fontSize: isActive ? 44 : 48,
                opacity: offset === 0 ? 1 : offset === 1 ? 0.4 : 0,
              };
              const bodyStyle: CSSProperties = {
                opacity: offset === 0 ? 1 : offset === 1 ? 0.1 : 0,
              };
              return (
                <div
                  key={feature.id}
                  className="absolute left-0 text-white transition-all duration-500"
                  style={{ top: single ? 0 : i * SLOT, width: TEXT_WIDTH }}
                >
                  <h3
                    className="whitespace-nowrap font-medium leading-none tracking-[-0.01em] transition-all duration-500"
                    style={headingStyle}
                  >
                    {feature.heading}
                  </h3>
                  <p
                    className="mt-[28px] font-light transition-opacity duration-500"
                    style={{
                      fontSize: 24,
                      lineHeight: "32px",
                      width: BODY_WIDTH,
                      ...bodyStyle,
                    }}
                  >
                    {feature.body}
                  </p>
                  {/* CTA sits at the end of the body, before the next ghosted
                      panel. The widened SLOT guarantees it never overlaps. */}
                  <Link
                    href={feature.href}
                    tabIndex={isActive ? 0 : -1}
                    aria-hidden={!isActive}
                    className="mt-[24px] inline-flex items-center gap-[10px] font-medium text-white underline-offset-[6px] transition-opacity duration-500 hover:underline"
                    style={{
                      fontSize: 22,
                      ...bodyStyle,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    {feature.cta}
                    <span aria-hidden>&rarr;</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [scale, setScale] = useState(1);

  // Pinned scrollytelling only after hydration and when reduced motion is off.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPinEnabled(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Scale the fixed-size card to the available width so it always spans the
  // section gutters (left/right aligned with the heading and radios). Height
  // is handled by keeping the header compact rather than shrinking the card,
  // which would break gutter alignment.
  useEffect(() => {
    const compute = () => {
      const wrap = cardWrapRef.current;
      if (!wrap) return;
      let next = Math.min(wrap.clientWidth / STAGE_W, 1.05);
      // While pinned the section is locked to one viewport height, so the card
      // must also fit the space left after the header and top/bottom padding —
      // otherwise the card's CTA link is clipped by `overflow-hidden`.
      if (pinEnabled) {
        const headerH = headerRef.current?.offsetHeight ?? 0;
        const avail =
          window.innerHeight - headerH - CARD_GAP - PIN_PADDING_Y * 2;
        if (avail > 0) next = Math.min(next, avail / STAGE_H);
      }
      setScale(Math.max(0.3, next));
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (cardWrapRef.current) ro.observe(cardWrapRef.current);
    if (headerRef.current) ro.observe(headerRef.current);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [pinEnabled]);

  // Map scroll progress through the tall wrapper to the active feature index.
  useEffect(() => {
    if (!pinEnabled) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const denom = rect.height - window.innerHeight;
        const progress = denom > 0 ? -rect.top / denom : 0;
        const clamped = Math.min(0.999999, Math.max(0, progress));
        setActiveIndex(Math.floor(clamped * FEATURES.length));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinEnabled]);

  const goToIndex = useCallback(
    (i: number) => {
      const next = Math.min(FEATURES.length - 1, Math.max(0, i));
      const el = sectionRef.current;
      if (!el || !pinEnabled) {
        setActiveIndex(next);
        return;
      }
      const rect = el.getBoundingClientRect();
      const absTop = rect.top + window.scrollY;
      const denom = rect.height - window.innerHeight;
      const targetProgress = (next + 0.5) / FEATURES.length;
      window.scrollTo({ top: absTop + targetProgress * denom, behavior: "smooth" });
    },
    [pinEnabled],
  );

  const onRadioKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = activeIndex + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = activeIndex - 1;
    if (next === null) return;
    e.preventDefault();
    const clamped = Math.min(FEATURES.length - 1, Math.max(0, next));
    buttonsRef.current[clamped]?.focus();
    goToIndex(clamped);
  };

  return (
    <section
      id="features"
      className="relative bg-surface-ink text-white"
      aria-labelledby="features-heading"
    >
      <div
        ref={sectionRef}
        style={pinEnabled ? { height: `${FEATURES.length * 100}vh` } : undefined}
      >
        <div
          className={
            pinEnabled
              ? "sticky top-0 flex h-dvh flex-col justify-center overflow-hidden py-[48px]"
              : "py-[80px]"
          }
        >
          <SectionShell gutter="64">
            <div ref={headerRef}>
              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                <h2
                  id="features-heading"
                  className="max-w-[1100px] font-medium leading-[1.05] text-white text-[clamp(32px,4vw,56px)]"
                >
                  Everything you need, less
                  <br />
                  of what you don&rsquo;t
                </h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/landing/mailbox-illustration.svg"
                  alt=""
                  aria-hidden
                  className="h-[92px] w-[104px] shrink-0 -rotate-[8deg] max-lg:mx-auto"
                />
              </div>

              <div
                role="radiogroup"
                aria-label="Choose a feature to preview"
                onKeyDown={onRadioKeyDown}
                className="mt-[16px] flex flex-wrap gap-x-[80px] gap-y-[16px]"
              >
                {FEATURES.map((feature, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={feature.id}
                      ref={(node) => {
                        buttonsRef.current[i] = node;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      aria-label={feature.label}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => goToIndex(i)}
                      className="group flex items-center gap-[11px] outline-none"
                    >
                      <span
                        aria-hidden
                        className="flex h-[40px] w-[40px] items-center justify-center rounded-full border-2 border-white group-focus-visible:ring-2 group-focus-visible:ring-white group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-surface-ink"
                      >
                        {isActive && (
                          <span className="h-[24px] w-[24px] rounded-full bg-white" />
                        )}
                      </span>
                      <span className="text-[24px] font-medium tracking-[-0.01em] text-white">
                        {feature.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div ref={cardWrapRef} className="mt-[16px] w-full">
              {pinEnabled ? (
                <Stage scale={scale} activeIndex={activeIndex} />
              ) : (
                <div className="flex flex-col gap-12">
                  {FEATURES.map((feature, i) => (
                    <Stage key={feature.id} scale={scale} activeIndex={i} single />
                  ))}
                </div>
              )}
            </div>
          </SectionShell>
        </div>
      </div>
    </section>
  );
}
