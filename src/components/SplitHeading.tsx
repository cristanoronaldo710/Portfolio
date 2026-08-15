"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { useJsProgress, useMotionScale } from "./motion";

type SplitHeadingProps = {
  text: string;
  as?: "h1" | "h2";
  id?: string;
  className?: string;
};

/**
 * Splits a heading into words that settle into place at slightly different
 * rates as the heading crosses into view — distinct from the page-level
 * parallax elsewhere, which moves whole blocks. Each word reads its offset
 * from one shared scroll value, so this costs one useScroll call no matter
 * how many words there are.
 *
 * Falls back to a plain heading — same markup, no motion values — under
 * prefers-reduced-motion or before the device check resolves, so there is
 * never a flash of split text with nothing driving it.
 */
export function SplitHeading({ text, as = "h2", id, className }: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const scale = useMotionScale();

  const { scrollYProgress: rawProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.3"],
  });
  /* Each word reads its own offset, phase-shifted slice of this range —
     see useJsProgress for why that needs de-accelerating. */
  const scrollYProgress = useJsProgress(rawProgress);

  if (scale === 0) {
    return as === "h1" ? (
      <h1 ref={ref} id={id} className={className}>
        {text}
      </h1>
    ) : (
      <h2 ref={ref} id={id} className={className}>
        {text}
      </h2>
    );
  }

  const words = text.split(" ");
  /* The space between words is a plain text node here, not a trailing
     character glued inside the previous span — a space that's the LAST
     character inside a display:inline-block box gets collapsed by some
     browsers, which was running every word together. */
  const content = words.map((word, index) => (
    <span key={index}>
      <Word
        word={word}
        index={index}
        progress={scrollYProgress}
        scale={scale}
      />
      {index < words.length - 1 ? " " : null}
    </span>
  ));

  return as === "h1" ? (
    <h1 ref={ref} id={id} className={className}>
      {content}
    </h1>
  ) : (
    <h2 ref={ref} id={id} className={className}>
      {content}
    </h2>
  );
}

function Word({
  word,
  index,
  progress,
  scale,
}: {
  word: string;
  index: number;
  progress: MotionValue<number>;
  scale: number;
}) {
  /* Later words start their entrance slightly after earlier ones, and travel
     a slightly different distance — that phase + distance offset is what
     reads as "different rates" rather than the whole line moving as one
     rigid block. Capped so a long heading doesn't push the last word's
     entrance past where the heading has already fully scrolled into view. */
  const phase = Math.min(index * 0.05, 0.4);
  const distance = (16 + (index % 3) * 9) * scale;

  const y = useTransform(progress, [phase, Math.min(phase + 0.55, 1)], [distance, 0]);
  const opacity = useTransform(
    progress,
    [phase, Math.min(phase + 0.4, 1)],
    [0, 1],
  );

  return (
    <motion.span style={{ y, opacity, display: "inline-block" }}>
      {word}
    </motion.span>
  );
}
