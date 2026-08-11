"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { profile, socials, stats, whatsappHref } from "@/content/profile";
import { EASE, useMotionScale } from "./motion";
import { LightLick, Texture } from "./Atmosphere";
import { RichText } from "./RichText";
import { ArrowIcon, WhatsAppIcon } from "./icons";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const scale = useMotionScale();

  /* Foreground and background drift at different rates as you scroll away,
     which is what actually reads as depth. Travel is scaled per device so a
     flick on a phone doesn't rip the hero off the screen. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 48 * scale]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const auroraY = useTransform(scrollYProgress, [0, 1], [0, 110 * scale]);
  const auroraScale = useTransform(scrollYProgress, [0, 1], [1, 1 + 0.12 * scale]);

  const motionStyle =
    reduce || scale === 0 ? undefined : { y: contentY, opacity: contentOpacity };

  return (
    /* `isolate` keeps the -z-10 aurora inside this section's stacking context —
       without it, it paints behind the body background and disappears. */
    <section
      ref={ref}
      className="relative isolate overflow-hidden px-6 pb-28 pt-24 sm:px-8 sm:pb-36 sm:pt-32"
    >
      {/* Light lick + film texture behind the type. Decoration only. */}
      <motion.div
        aria-hidden="true"
        style={scale === 0 ? undefined : { y: auroraY, scale: auroraScale }}
        className="pointer-events-none absolute -top-56 left-1/2 -z-10 h-[56rem] w-[92rem] -translate-x-1/2"
      >
        <LightLick />
      </motion.div>

      {/* Grain sits above the lick so the light reads as filmed, not painted —
          but light enough that it never competes with the headline. */}
      <Texture tone="light" opacity={0.22} className="-z-10" />

      {/* Scrim: just enough paper behind the text column to hold contrast on
          the small mono line, while leaving the light visible through it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(250,248,244,0.62)_0%,rgba(250,248,244,0.3)_34%,transparent_62%)]"
      />

      <motion.div style={motionStyle} className="mx-auto max-w-6xl">
        {profile.available && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-9 inline-flex items-center gap-2.5 rounded-full border border-line bg-canvas/70 py-2 pl-3.5 pr-5 text-sm text-ink-soft shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-sm"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {profile.availabilityNote}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.06, ease: EASE }}
          className="display-type text-[clamp(3rem,10.5vw,8.5rem)] font-semibold text-ink"
        >
          {profile.name}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.14, ease: EASE }}
          className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          <span className="font-mono text-sm uppercase tracking-[0.16em] text-ink">
            {profile.role}
          </span>
          <span aria-hidden="true" className="h-4 w-px bg-ink/25" />
          <span className="font-mono text-sm uppercase tracking-[0.16em] text-ink-soft">
            {profile.location}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.22, ease: EASE }}
          className="mt-10 max-w-[24ch] text-balance text-3xl leading-[1.15] tracking-[-0.025em] text-ink-soft sm:text-[2.75rem]"
        >
          <RichText text={profile.tagline} />
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease: EASE }}
          className="mt-5 max-w-[42ch] text-lg leading-relaxed text-ink-muted"
        >
          <RichText text={profile.taglineSub} />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.36, ease: EASE }}
          className="mt-11 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <div className="flex flex-wrap items-center gap-3">
            <motion.a
              href="#work"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="group inline-flex min-h-13 cursor-pointer items-center gap-2.5 rounded-full bg-ink px-8 text-[15px] font-medium text-canvas shadow-[0_10px_30px_-10px_rgba(0,0,0,0.55)]"
            >
              See the work
              <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </motion.a>

            <motion.a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Message ${profile.name} on WhatsApp`}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="inline-flex size-13 cursor-pointer items-center justify-center rounded-full border border-ink/20 bg-canvas/50 text-[#128C4A] backdrop-blur-sm transition-colors duration-300 hover:border-[#25D366]/60 hover:bg-[#25D366]/10"
            >
              <WhatsAppIcon className="size-5" />
            </motion.a>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:ml-2">
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  social.href.startsWith("http")
                    ? "noreferrer noopener"
                    : undefined
                }
                className="inline-flex min-h-11 cursor-pointer items-center gap-1 text-sm text-ink-muted underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
              >
                {social.label}
              </a>
            ))}
          </div>
        </motion.div>

        {stats.length > 0 && (
          <motion.dl
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            className="mt-20 grid max-w-2xl grid-cols-3 gap-6 border-t border-line-soft pt-8"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-3xl font-semibold tracking-[-0.02em] text-ink tabular-nums sm:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 block text-sm text-ink-muted">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </motion.dl>
        )}
      </motion.div>
    </section>
  );
}
