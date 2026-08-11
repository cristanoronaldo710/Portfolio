"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Grain-and-light texture from /public/textures, blended into a section.
 *
 * `soft-light` on the cream panels modulates contrast without flattening the
 * paper colour; `screen` on the dark panel lets the dust, speckles and
 * scratches read as light hitting the surface rather than dirt on top of it.
 */
export function Texture({
  tone,
  opacity,
  className = "",
}: {
  tone: "light" | "dark";
  opacity?: number;
  className?: string;
}) {
  const isLight = tone === "light";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat ${
        isLight ? "mix-blend-soft-light" : "mix-blend-screen"
      } ${className}`}
      style={{
        backgroundImage: `url(/textures/${isLight ? "light" : "dark"}-texture.jpg)`,
        opacity: opacity ?? (isLight ? 0.55 : 0.5),
      }}
    />
  );
}

/**
 * The light lick — luminous bands sweeping behind the hero type.
 *
 * Kept to cool steels, violets and a single warm highlight so it stays legible
 * as a black-and-white composition: the colour reads as light temperature
 * rather than as hue. Each band drifts on its own slow, offset cycle, so the
 * pattern never visibly loops.
 */
export function LightLick() {
  const reduce = useReducedMotion();

  /* The bands run low-left to upper-right, following the same diagonal the
     headline and tagline sit on, so the light supports the type instead of
     competing with it from the opposite corner. */
  /* Wide, heavily overlapped bands running low-left to upper-right — the same
     diagonal the headline sits on. Oversized and soft-edged on purpose: the
     hero should read as a lit surface, not as coloured blobs placed on it. */
  const bands = [
    {
      className:
        "left-[-6%] top-[10%] h-[36rem] w-[62rem] rotate-[-10deg] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.98)_0%,rgba(196,216,244,0.6)_42%,transparent_74%)]",
      animate: { x: [0, 56, -24, 0], y: [0, 26, -16, 0], scale: [1, 1.12, 0.96, 1] },
      duration: 24,
    },
    {
      className:
        "left-[12%] top-[-14%] h-[34rem] w-[58rem] rotate-[-18deg] bg-[radial-gradient(ellipse_at_center,rgba(104,146,220,0.62)_0%,rgba(134,112,198,0.4)_44%,transparent_76%)]",
      animate: { x: [0, -46, 34, 0], y: [0, 22, -18, 0], scale: [1, 1.1, 0.94, 1] },
      duration: 29,
    },
    {
      className:
        "left-[4%] top-[44%] h-[30rem] w-[64rem] rotate-[7deg] bg-[radial-gradient(ellipse_at_center,rgba(226,172,98,0.56)_0%,rgba(232,202,152,0.3)_46%,transparent_78%)]",
      animate: { x: [0, 44, -34, 0], y: [0, -22, 18, 0], scale: [1, 1.09, 0.96, 1] },
      duration: 33,
    },
    {
      className:
        "right-[-8%] top-[2%] h-[38rem] w-[46rem] rotate-[26deg] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.9)_0%,rgba(206,220,240,0.45)_40%,transparent_72%)]",
      animate: { x: [0, -30, 40, 0], y: [0, 20, -14, 0], scale: [1, 1.11, 0.95, 1] },
      duration: 21,
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 blur-[110px] saturate-[1.6]">
        {bands.map((band, index) => (
          <motion.div
            key={index}
            className={`absolute ${band.className}`}
            animate={reduce ? undefined : band.animate}
            transition={{
              duration: band.duration,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
