"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether CoderBoy's jokes get read aloud via speechSynthesis. Shared
 * between the nav toggle button and CoderBoy's joke scheduler, which live
 * in different component trees — a module-scoped store with
 * useSyncExternalStore is the smallest thing that lets both stay in sync
 * without threading state through props or reaching for a context provider
 * for one boolean.
 *
 * Persisted (unlike the old ambient-sound toggle it replaces): speech
 * synthesis isn't subject to the same autoplay-blocking browsers apply to
 * audible <audio>/AudioContext output, so there's no reason to make every
 * visitor re-opt-in each load the way audio had to.
 */

const STORAGE_KEY = "jokeVoice";

let enabled = false;
let initialized = false;
const listeners = new Set<() => void>();

function ensureInit() {
  if (initialized) return;
  initialized = true;
  try {
    enabled = localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    enabled = false;
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  ensureInit();
  return enabled;
}

function getServerSnapshot() {
  return false;
}

export function setJokeVoiceEnabled(next: boolean) {
  ensureInit();
  enabled = next;
  try {
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    // Private browsing or storage disabled — preference just won't persist.
  }
  if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  listeners.forEach((listener) => listener());
}

/** Reactive — for the toggle button's own rendered state. */
export function useJokeVoiceEnabled() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Plain read — for CoderBoy's imperative setTimeout-driven scheduler. */
export function isJokeVoiceEnabled() {
  ensureInit();
  return enabled;
}
