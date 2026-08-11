"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { ScrollProgress } from "./motion";

const links = [
  { label: "Stack", href: "#stack" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Background", href: "#background" },
];

/** Where the bar's midline sits, in px from the top of the viewport. */
const PROBE_Y = 32;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const { scrollY } = useScroll();
  const darkPanels = useRef<HTMLElement[]>([]);

  useEffect(() => {
    darkPanels.current = Array.from(
      document.querySelectorAll<HTMLElement>('[data-panel="dark"]'),
    );
  }, []);

  /* Invert the bar whenever a dark panel is passing underneath it. Reading
     rects viewport-relative avoids any scroll-offset maths, and with only a
     couple of panels the per-tick layout read is negligible. */
  const sync = useCallback((latest: number) => {
    setScrolled(latest > 24);
    setOnDark(
      darkPanels.current.some((panel) => {
        const rect = panel.getBoundingClientRect();
        return rect.top <= PROBE_Y && rect.bottom >= PROBE_Y;
      }),
    );
  }, []);

  useMotionValueEvent(scrollY, "change", sync);

  useEffect(() => {
    sync(window.scrollY);
  }, [sync]);

  return (
    <>
      <ScrollProgress />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-canvas"
      >
        Skip to content
      </a>

      <motion.header
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        data-on-dark={onDark || undefined}
        className={`sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled
            ? onDark
              ? "border-b border-white/10 bg-night/50 backdrop-blur-2xl backdrop-saturate-150"
              : "border-b border-line-soft/70 bg-canvas/50 backdrop-blur-2xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6 sm:px-8"
        >
          <a
            href="#main"
            className={`text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-500 ${
              onDark ? "text-night-ink" : "text-ink"
            }`}
          >
            {profile.name}
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`inline-flex min-h-11 cursor-pointer items-center rounded-full px-3.5 text-sm transition-colors duration-500 ${
                    onDark
                      ? "text-night-muted hover:text-night-ink"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className={`inline-flex min-h-10 cursor-pointer items-center rounded-full px-5 text-sm font-medium transition-colors duration-500 ${
              onDark ? "bg-night-ink text-night" : "bg-ink text-canvas"
            }`}
          >
            Contact
          </motion.a>
        </nav>
      </motion.header>
    </>
  );
}
