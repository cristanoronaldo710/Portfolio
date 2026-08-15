"use client";

import { useEffect, useRef, useState } from "react";
import { BirdIcon, SpeakerMuteIcon } from "./icons";

/**
 * Morning bird ambience, synthesised entirely with the Web Audio API — no
 * audio file, so there's nothing to license, host, or hotlink. Every chirp
 * is a short, randomised oscillator burst; a very quiet filtered-noise bed
 * sits underneath for outdoor "air".
 *
 * Tries to start itself on mount — genuinely, not just for show. It almost
 * always won't: browsers only let an AudioContext produce audible sound
 * before any click if this exact origin has already earned enough of the
 * browser's own "media engagement" (Chrome/Safari track this per-site,
 * building up after previous visits where you actually played audio here).
 * A brand new visitor will always get the silent, blocked outcome — that
 * is the platform's decision, not a bug in this component — so it checks
 * `ctx.state` right after creation and tears everything down instead of
 * leaving a "playing" button with no sound coming out of it. Either way the
 * toggle underneath always reflects what's actually true.
 */

type Voice = { baseFreq: number; pan: number; avgIntervalMs: number };

const VOICES: Voice[] = [
  { baseFreq: 2600, pan: -0.55, avgIntervalMs: 2200 },
  { baseFreq: 3400, pan: 0.5, avgIntervalMs: 2800 },
  { baseFreq: 2100, pan: 0.05, avgIntervalMs: 3600 },
];

export function AmbientSound({ onNight = false }: { onNight?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  /* Dev's StrictMode mounts, cleans up, and mounts again — without this,
     the first mount's async start() can resolve after the second mount has
     already begun and clobber its refs with a context nobody can stop. */
  const aliveRef = useRef(false);

  useEffect(() => {
    aliveRef.current = true;

    /* The genuine autoplay attempt. Fails silently and cleanly for the
       overwhelming majority of visitors — see the note above. */
    start().then((started) => setPlaying(started));

    return () => {
      aliveRef.current = false;
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearTimers() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  function stop() {
    clearTimers();
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (ctx && master) {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.4);
      setTimeout(() => ctx.close().catch(() => {}), 450);
    }
    ctxRef.current = null;
    masterRef.current = null;
  }

  function playChirp(ctx: AudioContext, master: GainNode, voice: Voice) {
    const now = ctx.currentTime;
    const notes = 2 + Math.floor(Math.random() * 3);
    const pan = new StereoPannerNode(ctx, { pan: voice.pan + (Math.random() - 0.5) * 0.15 });
    pan.connect(master);

    let t = now;
    for (let i = 0; i < notes; i++) {
      const osc = ctx.createOscillator();
      osc.type = Math.random() > 0.5 ? "sine" : "triangle";
      const freq = voice.baseFreq * (0.9 + Math.random() * 0.3);
      const sweep = freq * (1 + (Math.random() - 0.3) * 0.35);

      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(sweep, 200), t + 0.07);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.5, t + 0.008);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(env);
      env.connect(pan);
      osc.start(t);
      osc.stop(t + 0.12);

      t += 0.06 + Math.random() * 0.05;
    }
  }

  function scheduleVoice(ctx: AudioContext, master: GainNode, voice: Voice) {
    const delay = voice.avgIntervalMs * (0.6 + Math.random() * 0.9);
    const id = setTimeout(() => {
      if (ctxRef.current !== ctx) return; // stopped since this was scheduled
      playChirp(ctx, master, voice);
      scheduleVoice(ctx, master, voice);
    }, delay);
    timeoutsRef.current.push(id);
  }

  function startNoiseBed(ctx: AudioContext, master: GainNode) {
    const length = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1200;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = 0.015;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    noise.start();
  }

  /** Returns whether audio is actually audible — never assume it is. */
  async function start(): Promise<boolean> {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();

    try {
      await ctx.resume();
    } catch {
      // Falls through to the state check below either way.
    }

    if (ctx.state !== "running" || !aliveRef.current) {
      // Blocked, or this component unmounted while resume() was pending —
      // either way, this context must never become the active one.
      await ctx.close().catch(() => {});
      return false;
    }

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1);
    master.connect(ctx.destination);

    ctxRef.current = ctx;
    masterRef.current = master;

    startNoiseBed(ctx, master);
    VOICES.forEach((voice) => scheduleVoice(ctx, master, voice));
    return true;
  }

  async function toggle() {
    if (playing) {
      stop();
      setPlaying(false);
    } else {
      const started = await start();
      setPlaying(started);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Turn off ambient bird sound" : "Turn on ambient bird sound"}
      title={playing ? "Turn off ambient sound" : "Turn on ambient sound"}
      className={`relative inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-colors duration-300 ${
        onNight
          ? "border-white/10 bg-white/[0.04] text-night-muted hover:border-white/20 hover:text-night-ink"
          : "border-line bg-subtle text-ink-muted hover:border-line-soft hover:text-ink"
      } ${playing ? "!text-accent !border-accent/30" : ""}`}
    >
      {playing ? <BirdIcon className="size-4" /> : <SpeakerMuteIcon className="size-4" />}
      {playing && (
        <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-accent" />
      )}
    </button>
  );
}
