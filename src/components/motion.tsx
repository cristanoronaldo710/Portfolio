"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Decisive out, gentle settle. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * How much parallax this visitor should get.
 *
 * Scroll travel is a fixed number of pixels, so the same value feels gentle on
 * a tall desktop display and violent on a short laptop or a phone — where a
 * flick covers the whole element in a few frames. This scales the effect to the
 * device instead of shipping one setting for everyone:
 *
 *   0     reduced-motion, or no JS yet
 *   0.4   touch devices — momentum scrolling makes parallax feel unstable
 *   0.7   short viewports
 *   1     roomy desktop displays
 */
export function useMotionScale() {
  const reduce = useReducedMotion();
  const [scale, setScale] = useState(0);

  useEffect(() => {
    function measure() {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const height = window.innerHeight;
      setScale(coarse ? 0.4 : height < 760 ? 0.7 : 1);
    }

    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  return reduce ? 0 : scale;
}

/* ── Scroll progress bar ───────────────────────────────────── */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: "0%" }}
      /* difference blending inverts the bar against whatever is beneath it,
         so it stays visible over both the cream and the dark panels. */
      className="fixed inset-x-0 top-0 z-[61] h-px bg-white mix-blend-difference"
    />
  );
}

/* ── Reveal on scroll ──────────────────────────────────────── */

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, y = 18, className }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ── Staggered children ────────────────────────────────────── */

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

export const childVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={
        reduce ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : childVariants
      }
    >
      {children}
    </motion.div>
  );
}

/* ── Scroll-linked parallax ────────────────────────────────── */

type ParallaxProps = {
  children: ReactNode;
  /** Travel at full strength, in px. Scaled down per device. */
  distance?: number;
  className?: string;
};

/**
 * Moves content gently against the scroll direction. The spring is deliberately
 * soft and heavily damped so a fast flick lands without overshoot.
 */
export function Parallax({ children, distance = 34, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scale = useMotionScale();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const travel = distance * scale;
  const y = useTransform(scrollYProgress, [0, 1], [travel, -travel]);
  const smoothY = useSpring(y, { stiffness: 55, damping: 30, restDelta: 0.5 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={scale === 0 ? undefined : { y: smoothY }}>
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Settles a block into place as it enters view. Kept subtle — a 3% scale
 * change reads as weight, while anything larger reads as a bounce.
 */
export function ScrollScale({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scale = useMotionScale();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.98", "start 0.55"],
  });

  const s = useTransform(scrollYProgress, [0, 1], [1 - 0.03 * scale, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1 - 0.25 * scale, 1]);
  const smoothScale = useSpring(s, { stiffness: 70, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      ref={ref}
      style={scale === 0 ? undefined : { scale: smoothScale, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
