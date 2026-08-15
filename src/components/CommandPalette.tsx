"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { profile, socials, whatsappHref } from "@/content/profile";
import { EASE } from "./motion";
import { ArrowIcon, SlashIcon, WhatsAppIcon } from "./icons";

type Item = {
  label: string;
  hint: string;
  href: string;
  external?: boolean;
};

const ITEMS: Item[] = [
  { label: "Stack", hint: "Jump to section", href: "#stack" },
  { label: "Work", hint: "Jump to section", href: "#work" },
  { label: "About", hint: "Jump to section", href: "#about" },
  { label: "Background", hint: "Jump to section", href: "#background" },
  { label: "Contact", hint: "Jump to section", href: "#contact" },
  ...socials.map((s) => ({ label: s.label, hint: s.href.replace(/^https?:\/\//, ""), href: s.href, external: true })),
  { label: "WhatsApp", hint: profile.whatsapp.display, href: whatsappHref, external: true },
];

/**
 * Opens on "/" (ignored while a text field has focus, so it doesn't hijack
 * normal typing) and closes on Escape or a backdrop click. A minimal,
 * keyboard-first jump list — the site's answer to the reference's
 * "/ to navigate" footer hint.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q),
    );
  }, [query]);

  /* Reset the highlight whenever the query changes — adjusted inline during
     render rather than in an effect, so there's no extra render pass and no
     one-frame flash of the old index against the new filtered list. React's
     own recommended pattern for "derived state that resets on a dependency
     change": https://react.dev/learn/you-might-not-need-an-effect */
  const [queryForIndex, setQueryForIndex] = useState(query);
  if (query !== queryForIndex) {
    setQueryForIndex(query);
    setActiveIndex(0);
  }

  /* Shared by both entry points (the "/" key and the discoverability
     button) so neither can drift out of sync with the other. Resetting the
     query here — rather than in an effect keyed on `open` — also resets
     activeIndex for free, via the render-time adjustment above. */
  function openPalette() {
    setOpen(true);
    setQuery("");
  }

  useEffect(() => {
    function isTyping() {
      const el = document.activeElement;
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (el as HTMLElement).isContentEditable
      );
    }

    function onKeyDown(event: KeyboardEvent) {
      if (!open && event.key === "/" && !isTyping()) {
        event.preventDefault();
        openPalette();
        return;
      }

      if (!open) return;

      if (event.key === "Escape") {
        setOpen(false);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (event.key === "Enter") {
        event.preventDefault();
        const item = results[activeIndex];
        if (item) select(item);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, results, activeIndex]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function select(item: Item) {
    setOpen(false);
    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      window.location.hash = item.href;
    }
  }

  return (
    <>
      {/* Discoverability — a small always-visible trigger, bottom-left. */}
      <button
        type="button"
        onClick={openPalette}
        aria-label="Open command palette"
        className="fixed bottom-5 left-4 z-[65] hidden min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-subtle/80 px-3 font-mono text-xs text-ink-muted backdrop-blur-xl transition-colors duration-300 hover:border-line-soft hover:text-ink sm:inline-flex"
      >
        <SlashIcon className="size-3" />
        navigate
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="palette"
            className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[18vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close command palette"
              onClick={() => setOpen(false)}
              className="fixed inset-0 cursor-pointer bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.15 } }
              }
              transition={{ duration: 0.28, ease: EASE }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-line bg-canvas-deep shadow-[0_30px_80px_-24px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center gap-2.5 border-b border-line-soft px-4 py-3">
                <SlashIcon className="size-3.5 shrink-0 text-ink-muted" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Jump to a section or link…"
                  autoComplete="off"
                  className="min-h-8 flex-1 bg-transparent font-mono text-sm text-ink outline-none placeholder:text-ink-muted"
                />
              </div>

              <ul className="max-h-72 overflow-y-auto p-1.5">
                {results.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-ink-muted">
                    Nothing matches &ldquo;{query}&rdquo;.
                  </li>
                )}
                {results.map((item, index) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => select(item)}
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-100 ${
                        index === activeIndex ? "bg-subtle" : ""
                      }`}
                    >
                      <span>
                        <span className="text-sm text-ink">{item.label}</span>
                        <span className="ml-2.5 font-mono text-xs text-ink-muted">
                          {item.hint}
                        </span>
                      </span>
                      {item.external ? (
                        item.label === "WhatsApp" ? (
                          <WhatsAppIcon className="size-3.5 shrink-0 text-ink-muted" />
                        ) : (
                          <ArrowIcon className="size-3.5 shrink-0 text-ink-muted" />
                        )
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-4 border-t border-line-soft px-4 py-2.5 font-mono text-[11px] text-ink-muted">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
