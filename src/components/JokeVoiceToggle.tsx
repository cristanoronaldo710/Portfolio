"use client";

import { setJokeVoiceEnabled, useJokeVoiceEnabled } from "./useJokeVoice";
import { SpeakerMuteIcon, SpeakerOnIcon } from "./icons";

/**
 * Controls whether CoderBoy reads its joke bubbles aloud via
 * speechSynthesis. Same nav slot and visual language as the ambient-sound
 * toggle it replaces, but persisted across visits — see useJokeVoice.ts for
 * why that's safe to do here when it wasn't for audible audio playback.
 */
export function JokeVoiceToggle({ onNight = false }: { onNight?: boolean }) {
  const enabled = useJokeVoiceEnabled();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={enabled ? "Turn off jokes read aloud" : "Turn on jokes read aloud"}
      title={enabled ? "Turn off jokes read aloud" : "Turn on jokes read aloud"}
      onClick={() => setJokeVoiceEnabled(!enabled)}
      className={`relative inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-colors duration-300 ${
        onNight
          ? "border-white/10 bg-white/[0.04] text-night-muted hover:border-white/20 hover:text-night-ink"
          : "border-line bg-subtle text-ink-muted hover:border-line-soft hover:text-ink"
      } ${enabled ? "!text-accent !border-accent/30" : ""}`}
    >
      {enabled ? <SpeakerOnIcon className="size-4" /> : <SpeakerMuteIcon className="size-4" />}
    </button>
  );
}
