"use client";

import { motion, useTransform, useScroll, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { RichText } from "./RichText";
import { Reveal, useJsProgress, useMotionScale } from "./motion";

type PinnedAboutRevealProps = {
  paragraphs: readonly string[];
  /** Rendered once, reused in both the pinned and the plain layout. */
  aside: ReactNode;
};

/**
 * Pins the paragraph column in place while the page scrolls past it, and
 * crossfades through the paragraphs one at a time as that scroll happens —
 * the "content advances while the section holds still" pattern.
 *
 * Deliberately gated to `scale === 1` from useMotionScale: roomy desktop
 * viewport, no touch, no reduced-motion. A pin eats real scroll distance and
 * a sticky element under momentum-scroll touch input reads as janky rather
 * than considered, so everywhere else gets the plain stacked layout instead
 * — same content, no pin.
 *
 * The outer div carrying `wrapperRef` renders unconditionally in both modes
 * — only its height/sticky styling changes. useScroll needs its target ref
 * attached from the very first paint; conditionally rendering that element
 * only in the "pinned" branch raced Framer's hydration check, since `scale`
 * starts at 0 (not yet measured) on every render before the client effect
 * in useMotionScale runs.
 */
export function PinnedAboutReveal({ paragraphs, aside }: PinnedAboutRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scale = useMotionScale();
  const pinned = scale === 1;
  const count = paragraphs.length;

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });
  /* Every band below reads a narrow, offset slice of this range (e.g.
     [0.75, 0.8, 1]) — see useJsProgress for why that needs de-accelerating. */
  const progress = useJsProgress(scrollYProgress);

  return (
    <div
      ref={wrapperRef}
      style={pinned ? { height: `${60 + count * 30}vh` } : undefined}
      className="relative"
    >
      <div className={pinned ? "sticky top-20 flex min-h-[70vh] items-center" : undefined}>
        <div className="grid w-full gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-24">
          {pinned ? (
            <div className="relative min-h-[13rem] pl-7 sm:pl-9">
              <div className="absolute inset-y-0 left-0 flex flex-col justify-center gap-2.5">
                {paragraphs.map((_, index) => (
                  <Tick key={index} index={index} total={count} progress={progress} />
                ))}
              </div>

              {paragraphs.map((paragraph, index) => (
                <Band
                  key={index}
                  index={index}
                  total={count}
                  progress={progress}
                  text={paragraph}
                />
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="space-y-6 text-lg leading-relaxed text-ink-soft">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="max-w-[58ch]">
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
            </Reveal>
          )}

          {aside}
        </div>
      </div>
    </div>
  );
}

/** [start, fadeIn, fadeOutStart, end] for band `index` of `total`, monotonic. */
function bandStops(index: number, total: number) {
  const band = 1 / total;
  const start = index * band;
  const end = start + band;
  const fade = Math.min(band / 5, 0.05);
  return { start, fadeIn: start + fade, fadeOutStart: end - fade, end };
}

function Band({
  index,
  total,
  progress,
  text,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  text: string;
}) {
  const { start, fadeIn, fadeOutStart, end } = bandStops(index, total);
  const isLast = index === total - 1;

  const opacity = useTransform(
    progress,
    isLast ? [start, fadeIn, 1] : [start, fadeIn, fadeOutStart, end],
    isLast ? [0, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, fadeIn], [18, 0]);

  return (
    <motion.p
      style={{ opacity, y }}
      className="absolute inset-x-0 top-0 max-w-[58ch] text-lg leading-relaxed text-ink-soft sm:text-xl"
    >
      <RichText text={text} />
    </motion.p>
  );
}

function Tick({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const { start, fadeIn, fadeOutStart, end } = bandStops(index, total);
  const isLast = index === total - 1;

  const opacity = useTransform(
    progress,
    isLast ? [start, fadeIn, 1] : [start, fadeIn, fadeOutStart, end],
    isLast ? [0.28, 1, 1] : [0.28, 1, 1, 0.28],
  );
  const scaleY = useTransform(
    progress,
    isLast ? [start, fadeIn, 1] : [start, fadeIn, fadeOutStart, end],
    isLast ? [0.55, 1, 1] : [0.55, 1, 1, 0.55],
  );

  return (
    <motion.span
      aria-hidden="true"
      style={{ opacity, scaleY }}
      className="h-6 w-[3px] origin-center rounded-full bg-ink"
    />
  );
}
