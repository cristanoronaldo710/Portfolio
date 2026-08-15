"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "./motion";
import { isJokeVoiceEnabled } from "./useJokeVoice";

/**
 * A cursor-following companion — the same interaction pattern as the classic
 * "oneko" cursor pet (walks toward the mouse, idles once it catches up), but
 * original artwork: a small flat-vector coding dinosaur carrying a laptop,
 * drawn side-on in the site's own icon language (stroke + currentColor)
 * rather than the pixel-art dog sprite the reference site uses for that
 * effect. Side profile reads far better than a front-facing figure at this
 * size — the tail and back spikes are what make "dinosaur" legible in a
 * 40px silhouette.
 *
 * Position is driven imperatively via a ref + rAF loop and applied straight
 * to the DOM node's transform — never through React state — so a 60fps
 * mouse chase never costs a re-render. Only `data-cb-state` flips (walk vs
 * idle), which the CSS keyframes in globals.css key off of for the leg/arm
 * animation; the loop itself doesn't animate limbs.
 *
 * The joke bubble is a SEPARATE tracked element, not a child of the dinosaur
 * div — that div gets `scaleX(-1)` when facing left, which would mirror any
 * text inside it into gibberish. The bubble gets its own translate-only
 * transform from the same tick(), so it follows along without ever flipping.
 */

const SPEED = 3.2;
const STOP_DISTANCE = 12;
const HALF = 20;
const BUBBLE_OFFSET_Y = 30;

const JOKE_INTERVAL_MIN = 14000;
const JOKE_INTERVAL_MAX = 30000;
const JOKE_VISIBLE_MS = 5000;

const JOKES = [
  "Why do programmers prefer dark mode? Light attracts bugs.",
  "There are only 10 types of people: those who understand binary, and those who don't.",
  "A SQL query walks into a bar, walks up to two tables, and asks: “Can I join you?”",
  "I'd tell you a UDP joke, but you might not get it.",
  "99 little bugs in the code. 99 little bugs. Take one down, patch it around — 127 little bugs in the code.",
  "Why do Java developers wear glasses? Because they don't C#.",
  "To understand recursion, you must first understand recursion.",
  "It works on my machine.",
  "I'm not a great programmer. I'm just a good programmer with great habits.",
  "Why was the developer unhappy at work? They wanted arrays.",
  "How many programmers does it take to change a light bulb? None — that's a hardware problem.",
  "Real dinosaurs didn't leave because of an asteroid. They just found the codebase undocumented.",
  "I've got 99 problems, and after this deploy, I'll have 100.",
  "!false — it's funny because it's true.",
  "A byte walks into a bar looking miserable. The bartender asks what's wrong. “Parity error,” it says.",
];

/**
 * Speaks a joke aloud if the visitor has turned that on (JokeVoiceToggle,
 * off by default). Cancels whatever utterance is already in flight first —
 * jokes are short and 14-30s apart, but this keeps two from ever overlapping
 * if the interval and speech duration happen to collide.
 */
function speakJoke(text: string) {
  if (!isJokeVoiceEnabled()) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.02;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

export function CoderBoy() {
  const [enabled, setEnabled] = useState(false);
  const [joke, setJoke] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const facingRef = useRef<1 | -1>(1);
  const rafRef = useRef(0);
  const jokeTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastJokeIndexRef = useRef(-1);

  useEffect(() => {
    /* A mouse-chase effect is meaningless on touch, and skipped outright
       under reduced-motion rather than just slowed down — this one is pure
       decoration, not information, so "off" is the correct reduced state. */
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(hasFinePointer && !reduce);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    posRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    mouseRef.current = { ...posRef.current };

    function onMove(event: MouseEvent) {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    }
    window.addEventListener("mousemove", onMove, { passive: true });

    function tick() {
      const el = rootRef.current;
      if (el) {
        const dx = mouseRef.current.x - posRef.current.x;
        const dy = mouseRef.current.y - posRef.current.y;
        const dist = Math.hypot(dx, dy);
        const walking = dist > STOP_DISTANCE;

        if (walking) {
          const step = Math.min(SPEED, dist);
          posRef.current.x += (dx / dist) * step;
          posRef.current.y += (dy / dist) * step;
          facingRef.current = dx >= 0 ? 1 : -1;
        }

        el.style.transform = `translate(${posRef.current.x - HALF}px, ${posRef.current.y - HALF}px) scaleX(${facingRef.current})`;
        el.dataset.cbState = walking ? "walk" : "idle";

        /* Translate-only — never inherits the flip above, so the joke text
           always reads left-to-right regardless of which way he's facing. */
        if (bubbleRef.current) {
          bubbleRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y - BUBBLE_OFFSET_Y}px) translate(-50%, -100%)`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    function scheduleNext() {
      const delay =
        JOKE_INTERVAL_MIN + Math.random() * (JOKE_INTERVAL_MAX - JOKE_INTERVAL_MIN);

      const showId = setTimeout(() => {
        let index = Math.floor(Math.random() * JOKES.length);
        if (index === lastJokeIndexRef.current) {
          index = (index + 1) % JOKES.length;
        }
        lastJokeIndexRef.current = index;
        setJoke(JOKES[index]);
        speakJoke(JOKES[index]);

        const hideId = setTimeout(() => {
          setJoke(null);
          scheduleNext();
        }, JOKE_VISIBLE_MS);
        jokeTimersRef.current.push(hideId);
      }, delay);
      jokeTimersRef.current.push(showId);
    }

    scheduleNext();

    return () => {
      jokeTimersRef.current.forEach(clearTimeout);
      jokeTimersRef.current = [];
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={bubbleRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[91]"
      >
        <AnimatePresence>
          {joke && (
            <motion.div
              key={joke}
              initial={{ opacity: 0, scale: 0.85, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="relative w-max max-w-[13rem] rounded-lg border border-line bg-subtle/95 px-3 py-2 text-xs leading-snug text-ink shadow-[0_12px_28px_-12px_rgba(0,0,0,0.35)] backdrop-blur-sm"
            >
              {joke}
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-b border-r border-line bg-subtle"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        ref={rootRef}
        aria-hidden="true"
        data-cb-state="idle"
        className="pointer-events-none fixed left-0 top-0 z-[90] text-ink"
        style={{ willChange: "transform" }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          {/* Legs — animated opposite-phase for a walk cycle, only while
              [data-cb-state="walk"] (see globals.css). Drawn chunkier than a
              human figure's for a stompier gait. */}
          <rect className="cb-leg-a" x="16" y="28" width="5" height="8" rx="2" fill="currentColor" />
          <rect className="cb-leg-b" x="22" y="28" width="5" height="8" rx="2" fill="currentColor" />

          {/* Body, head, tail and back spikes all bob together while walking —
              everything except the legs (their own cycle) and the tapping arm
              (its own idle animation). Drawn facing right; CoderBoy flips
              scaleX to face left. */}
          <g className="cb-body">
            <path d="M14 25 Q3 26 1 20 Q6 24 14 27 Z" fill="currentColor" />
            <ellipse cx="20" cy="23" rx="7" ry="6.2" fill="currentColor" />
            <circle cx="27" cy="17" r="4.3" fill="currentColor" />
            <path d="M30.5 15.5 35 17.5 30.5 20Z" fill="currentColor" />
            <path d="M14 17 16 11 18 17Z" fill="currentColor" />
            <path d="M18 15.5 20 9.5 22 15.5Z" fill="currentColor" />
            <path d="M22 15.5 24 10.5 26 15.5Z" fill="currentColor" />
            <circle cx="28.5" cy="16" r="0.9" fill="var(--color-canvas)" />
          </g>

          {/* Laptop, carried always — the "coder" tell. Screen glows accent,
              with an always-blinking text cursor for a little life even when
              idle and standing still. */}
          <g transform="translate(13 26)">
            <rect x="0" y="0" width="12" height="8" rx="1.2" fill="var(--color-canvas)" stroke="currentColor" strokeWidth="1.2" />
            <rect x="1.4" y="1.4" width="9.2" height="5.2" rx="0.4" className="text-accent" fill="currentColor" opacity="0.18" />
            <rect className="cb-cursor" x="2.4" y="3.2" width="1.4" height="1.6" fill="currentColor" />
          </g>

          {/* Comically tiny T-rex arm, taps the laptop while idle. */}
          <rect className="cb-hand" x="25" y="22" width="4" height="2.4" rx="1" fill="currentColor" />
        </svg>
      </div>
    </>
  );
}
