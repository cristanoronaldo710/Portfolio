"use client";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useMemo, useRef, useState, type PointerEvent } from "react";
import { techStack, type Tech } from "@/content/profile";
import { EASE, Reveal } from "./motion";
import { Texture } from "./Atmosphere";

const ALL = "All";

export function TechWall() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(ALL);

  const groups = useMemo(() => [ALL, ...techStack.map((g) => g.group)], []);

  const visible = useMemo(() => {
    const source =
      active === ALL
        ? techStack.flatMap((g) => g.items.map((t) => ({ ...t, group: g.group })))
        : (techStack.find((g) => g.group === active)?.items ?? []).map((t) => ({
            ...t,
            group: active,
          }));
    return source;
  }, [active]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const glowY = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);

  /* Cursor spotlight. Motion values update outside React's render loop, so
     tracking the pointer costs no re-renders. */
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.09), transparent 72%)`;

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - bounds.left);
    mouseY.set(event.clientY - bounds.top);
  }

  return (
    <section
      ref={ref}
      id="stack"
      aria-labelledby="stack-heading"
      onPointerMove={reduce ? undefined : handlePointerMove}
      data-panel="dark"
      className="on-night relative isolate overflow-hidden bg-night py-24 sm:py-28"
    >
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: glowY }}
        className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 mx-auto h-[30rem] w-[64rem] max-w-none opacity-90 blur-[110px]"
      >
        <div className="absolute left-[10%] top-0 size-[24rem] rounded-full bg-[radial-gradient(circle,rgba(232,178,102,0.46)_0%,transparent_70%)]" />
        <div className="absolute right-[12%] top-24 size-[22rem] rounded-full bg-[radial-gradient(circle,rgba(150,128,214,0.42)_0%,transparent_70%)]" />
        <div className="absolute left-1/2 top-44 size-[20rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(104,158,206,0.44)_0%,transparent_70%)]" />
      </motion.div>

      {/* Exposed build grid — the "raw" underneath the polish. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,#000_35%,transparent_78%)]"
      />

      {/* Dust, speckles and scratches — screened so they read as light on the
          surface rather than dirt over it. */}
      <Texture tone="dark" opacity={0.55} className="-z-10" />

      {/* Follows the cursor across the whole panel. */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { background: spotlight }}
        className="pointer-events-none absolute inset-0 -z-10"
      />

      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-night-muted">
                01 — Stack
              </p>
              <h2
                id="stack-heading"
                className="display-type mt-4 text-balance text-[clamp(2rem,5vw,3.75rem)] font-semibold text-night-ink"
              >
                The tools I reach for.
              </h2>
            </div>

            <p className="max-w-[34ch] text-[15px] leading-relaxed text-night-muted">
              Filter by layer, or hover any tile to bring it to life.
            </p>
          </div>
        </Reveal>

        {/* Glass filter bar — the active pill is a shared layout element, so it
            slides between filters instead of cutting. */}
        <Reveal delay={0.08}>
          <div
            role="tablist"
            aria-label="Filter technologies by layer"
            className="mt-10 inline-flex flex-wrap gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur-xl"
          >
            {groups.map((group) => {
              const isActive = group === active;
              return (
                <button
                  key={group}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(group)}
                  className={`relative cursor-pointer rounded-full px-4 py-2 text-sm transition-colors duration-300 sm:px-5 ${
                    isActive
                      ? "text-night"
                      : "text-night-muted hover:text-night-ink"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="stack-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 -z-10 rounded-full bg-night-ink"
                    />
                  )}
                  {group}
                </button>
              );
            })}
          </div>
        </Reveal>

        <motion.ul
          layout={!reduce}
          className="mt-10 grid grid-cols-4 gap-2.5 sm:grid-cols-6 lg:grid-cols-8"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((tech) => (
              <TechTile key={tech.name} tech={tech} reduce={!!reduce} />
            ))}
          </AnimatePresence>
        </motion.ul>

        <Reveal>
          <p className="mt-8 font-mono text-xs tabular-nums text-night-muted">
            {String(visible.length).padStart(2, "0")} technologies
            {active !== ALL && ` in ${active.toLowerCase()}`}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function TechTile({ tech, reduce }: { tech: Tech; reduce: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.li
      layout={!reduce}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      /* Exit runs at ~60% of enter so the grid reflows before your eye
         follows it, rather than after. */
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.16 } }}
      transition={{ duration: 0.28, ease: EASE }}
    >
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={reduce ? undefined : { y: -5, scale: 1.04 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        title={tech.name}
        className="group flex aspect-square cursor-default flex-col items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-2 backdrop-blur-md transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.09]"
      >
        <i
          aria-hidden="true"
          className={`${tech.icon} text-[1.625rem] sm:text-[1.875rem]`}
          style={{ color: hovered ? tech.color : "#f5f5f7" }}
        />
        <span className="line-clamp-1 px-0.5 text-center text-[10px] leading-tight text-night-muted transition-colors duration-300 group-hover:text-night-ink sm:text-[11px]">
          {tech.name}
        </span>
      </motion.div>
    </motion.li>
  );
}
