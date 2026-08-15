"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { EASE } from "./motion";
import { MoonIcon, SunIcon } from "./icons";

/**
 * Dark is the CSS default (see globals.css), so this only ever needs to add
 * or remove `data-theme="light"` on <html> — never set "dark" explicitly.
 * The blocking script in layout.tsx applies the stored choice before first
 * paint, so the initial snapshot below just has to read the DOM state it
 * already set, not decide it fresh (avoids a hydration mismatch).
 *
 * Reads/writes through useSyncExternalStore rather than useState+useEffect:
 * syncing DOM state into useState via an effect always costs two renders —
 * once with the wrong SSR-default value, then again once the effect
 * corrects it. Reading the DOM directly in getSnapshot does it in one.
 */

const listeners = new Set<() => void>();

function getSnapshot() {
  return document.documentElement.dataset.theme === "light";
}

function getServerSnapshot() {
  return false;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function setLight(next: boolean) {
  if (next) {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  try {
    localStorage.setItem("theme", next ? "light" : "dark");
  } catch {
    // Private browsing or storage disabled — theme just won't persist.
  }
  listeners.forEach((listener) => listener());
}

export function ThemeToggle({ onNight = false }: { onNight?: boolean }) {
  const isLight = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      onClick={() => setLight(!isLight)}
      className={`relative inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-colors duration-300 ${
        onNight
          ? "border-white/10 bg-white/[0.04] text-night-muted hover:border-white/20 hover:text-night-ink"
          : "border-line bg-subtle text-ink-muted hover:border-line-soft hover:text-ink"
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isLight ? "sun" : "moon"}
          initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="grid place-items-center"
        >
          {isLight ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
