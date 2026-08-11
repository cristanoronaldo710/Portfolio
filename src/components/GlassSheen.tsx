"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

type GlassSheenProps = {
  children: ReactNode;
  className?: string;
  /** Radius of the highlight in px. */
  size?: number;
  /** Peak opacity of the highlight. */
  intensity?: number;
  /** Use a light highlight for dark surfaces. */
  tone?: "light" | "dark";
};

/**
 * Wraps a card with a soft highlight that tracks the cursor, plus a frosted
 * inner edge. The position is driven by motion values rather than state, so
 * moving the pointer never triggers a React re-render.
 */
export function GlassSheen({
  children,
  className,
  size = 320,
  intensity = 0.5,
  tone = "dark",
}: GlassSheenProps) {
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const opacity = useMotionValue(0);

  const tint =
    tone === "light"
      ? `rgba(255,255,255,${intensity})`
      : `rgba(0,113,227,${intensity * 0.22})`;

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${mouseX}px ${mouseY}px, ${tint}, transparent 70%)`;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - bounds.left);
    mouseY.set(event.clientY - bounds.top);
  }

  return (
    <div
      onPointerMove={reduce ? undefined : handlePointerMove}
      onPointerEnter={() => opacity.set(1)}
      onPointerLeave={() => opacity.set(0)}
      className={`group/sheen relative ${className ?? ""}`}
    >
      {children}

      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { background, opacity }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
      />
    </div>
  );
}
