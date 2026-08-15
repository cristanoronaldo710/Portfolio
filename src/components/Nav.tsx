"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { ScrollProgress } from "./motion";
import { ThemeToggle } from "./ThemeToggle";
import { JokeVoiceToggle } from "./JokeVoiceToggle";

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

  /* Invert the bar whenever a permanently-dark panel (Stack, Contact) is
     passing underneath it — independent of the page's own light/dark
     toggle, since those two panels don't follow it. */
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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-canvas"
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
              : "border-b border-line-soft/70 bg-canvas/60 backdrop-blur-2xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="container-wide flex h-16 items-center justify-between gap-6 px-6 sm:px-8"
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
                  className={`inline-flex min-h-11 cursor-pointer items-center rounded-lg px-3.5 text-sm transition-colors duration-500 ${
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

          <div className={`flex items-center gap-2.5 ${onDark ? "on-night" : ""}`}>
            <JokeVoiceToggle onNight={onDark} />
            <ThemeToggle onNight={onDark} />

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="btn btn-primary"
            >
              Contact
            </motion.a>
          </div>
        </nav>
      </motion.header>
    </>
  );
}
