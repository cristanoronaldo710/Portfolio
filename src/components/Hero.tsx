"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { profile, socials, stats, whatsappHref } from "@/content/profile";
import { EASE, useJsProgress, useMotionScale } from "./motion";
import { LightLick } from "./Atmosphere";
import { RichText } from "./RichText";
import { ArrowIcon, WhatsAppIcon } from "./icons";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const scale = useMotionScale();

  const { scrollYProgress: rawProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scrollYProgress = useJsProgress(rawProgress);

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 50 * scale]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const auroraY = useTransform(scrollYProgress, [0, 1], [0, 140 * scale]);
  const auroraScale = useTransform(scrollYProgress, [0, 1], [1, 1 + 0.14 * scale]);

  const motionStyle =
    reduce || scale === 0 ? undefined : { y: contentY, opacity: contentOpacity };

  return (
    /* `isolate` keeps the -z-10 aurora inside this section's stacking context —
       without it, it paints behind the body background and disappears. */
    <section
      ref={ref}
      className="relative isolate overflow-hidden px-6 pb-24 pt-28 sm:px-8 sm:pb-32 sm:pt-36"
    >
      <motion.div
        aria-hidden="true"
        style={scale === 0 ? undefined : { y: auroraY, scale: auroraScale }}
        className="pointer-events-none absolute -top-56 left-1/2 -z-10 h-[56rem] w-[92rem] -translate-x-1/2"
      >
        <LightLick />
      </motion.div>

      {/* Scrim: holds contrast behind the text column without hiding the
          light entirely. Built from color-mix against the live theme token
          so it stays correct whichever theme is active — a hardcoded colour
          here would only work for one of the two. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(100deg, color-mix(in oklab, var(--color-canvas) 70%, transparent) 0%, color-mix(in oklab, var(--color-canvas) 38%, transparent) 34%, transparent 64%)",
        }}
      />

      <motion.div style={motionStyle} className="container-prose px-0">
        {profile.available && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-8 inline-flex items-center gap-2.5 rounded-lg border border-line bg-subtle/70 py-1.5 pl-3 pr-4 font-mono text-xs text-ink-soft backdrop-blur-sm"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
            </span>
            {profile.availabilityNote}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.06, ease: EASE }}
          className="heading-tight text-[clamp(2.25rem,6vw,3.5rem)] text-ink"
        >
          {profile.name}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
          className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2"
        >
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink">
            {profile.role}
          </span>
          <span aria-hidden="true" className="h-3.5 w-px bg-ink/25" />
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">
            {profile.location}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
          className="mt-8 max-w-[30ch] text-balance text-xl leading-snug tracking-[-0.015em] text-ink-soft sm:text-2xl"
        >
          <RichText text={profile.tagline} />
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: EASE }}
          className="mt-3 max-w-[46ch] leading-relaxed text-ink-muted"
        >
          <RichText text={profile.taglineSub} />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <motion.a
              href="#work"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="btn btn-primary group"
            >
              See the work
              <ArrowIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </motion.a>

            <motion.a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Message ${profile.name} on WhatsApp`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="btn !w-11 !min-w-11 !px-0 text-[#25D366] hover:!border-[#25D366]/40"
            >
              <WhatsAppIcon className="size-4" />
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
                className="inline-flex min-h-11 cursor-pointer items-center gap-1 font-mono text-xs text-ink-muted underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
              >
                {social.label}
              </a>
            ))}
          </div>
        </motion.div>

        {stats.length > 0 && (
          <motion.dl
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.36, ease: EASE }}
            className="mt-16 grid max-w-lg grid-cols-3 gap-6 border-t border-line-soft pt-7"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-2xl font-semibold tracking-[-0.02em] text-ink tabular-nums">
                    {stat.value}
                  </span>
                  <span className="mt-1 block font-mono text-xs text-ink-muted">
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
