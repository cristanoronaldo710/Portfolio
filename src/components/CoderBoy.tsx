"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A cursor-following companion — the same interaction pattern as the classic
 * "oneko" cursor pet (walks toward the mouse, idles once it catches up), but
 * original artwork: a small flat-vector "coder boy" with a laptop, drawn in
 * the site's own icon language (stroke + currentColor) rather than the
 * pixel-art dog sprite the reference site uses for that effect.
 *
 * Position is driven imperatively via a ref + rAF loop and applied straight
 * to the DOM node's transform — never through React state — so a 60fps
 * mouse chase never costs a re-render. Only `data-cb-state` flips (walk vs
 * idle), which the CSS keyframes in globals.css key off of for the leg/arm
 * animation; the loop itself doesn't animate limbs.
 */

const SPEED = 3.2;
const STOP_DISTANCE = 12;
const HALF = 20;

export function CoderBoy() {
  const [enabled, setEnabled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const facingRef = useRef<1 | -1>(1);
  const rafRef = useRef(0);

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
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-cb-state="idle"
      className="pointer-events-none fixed left-0 top-0 z-[90] text-ink"
      style={{ willChange: "transform" }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        {/* Legs — animated opposite-phase for a walk cycle, only while
            [data-cb-state="walk"] (see globals.css). */}
        <rect className="cb-leg-a" x="15" y="29" width="4" height="8" rx="1.5" fill="currentColor" />
        <rect className="cb-leg-b" x="21" y="29" width="4" height="8" rx="1.5" fill="currentColor" />

        {/* Torso bobs while walking. */}
        <g className="cb-body">
          <rect x="13" y="16" width="14" height="15" rx="4" fill="currentColor" />
          <circle cx="20" cy="10" r="6.5" fill="currentColor" />
          {/* Simple flat hair. */}
          <path d="M13.5 8a6.5 6.5 0 0 1 13 0c-2-1.4-4.2-.6-6.5-.6s-4.5-.8-6.5.6Z" fill="currentColor" />
        </g>

        {/* Laptop, carried always — the "coder" tell. Screen glows accent,
            with an always-blinking text cursor for a little life even when
            idle and standing still. */}
        <g transform="translate(11 24)">
          <rect x="0" y="0" width="12" height="8" rx="1.2" fill="var(--color-canvas)" stroke="currentColor" strokeWidth="1.2" />
          <rect x="1.4" y="1.4" width="9.2" height="5.2" rx="0.4" className="text-accent" fill="currentColor" opacity="0.18" />
          <rect className="cb-cursor" x="2.4" y="3.2" width="1.4" height="1.6" fill="currentColor" />
        </g>

        {/* Arm taps the laptop while idle. */}
        <rect className="cb-hand" x="22" y="24" width="5" height="3" rx="1.2" fill="currentColor" />
      </svg>
    </div>
  );
}
