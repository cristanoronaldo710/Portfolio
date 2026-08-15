type IconProps = {
  className?: string;
};

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

/** Diagonal arrow, for links that navigate or lead outward. */
export function ArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <path d="M4.5 11.5 11.5 4.5" />
      <path d="M5.5 4.5h6v6" />
    </svg>
  );
}

/** Angle brackets, for source-code links. */
export function CodeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <path d="m5.5 5.5-3 2.5 3 2.5" />
      <path d="m10.5 5.5 3 2.5-3 2.5" />
      <path d="M9.25 3.75 6.75 12.25" />
    </svg>
  );
}

/** Close cross, for dismissing the case study reader. */
export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <path d="m4 4 8 8M12 4l-8 8" />
    </svg>
  );
}

/** Document lines, for "read case study". */
export function ReadIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <path d="M3.5 2.5h9v11h-9z" />
      <path d="M6 5.5h4M6 8h4M6 10.5h2.5" />
    </svg>
  );
}

/** Chat bubble, for the assistant launcher. */
export function ChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <path d="M13.5 9.5a1.5 1.5 0 0 1-1.5 1.5H6l-3 2.5V4A1.5 1.5 0 0 1 4.5 2.5h7.5A1.5 1.5 0 0 1 13.5 4z" />
    </svg>
  );
}

/** Paper plane, for sending a message. */
export function SendIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <path d="M14 2 7.5 8.5M14 2l-4.25 12-2.25-5.5L2 6.25z" />
    </svg>
  );
}

/** Tick, for the enquiry confirmation. */
export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

/**
 * WhatsApp glyph. Filled rather than stroked, since the official mark is a
 * solid shape — stroking it would misrepresent the brand.
 */
export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07s.89 2.4 1.02 2.57c.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

/** Play glyph in a circle — media / video projects. */
export function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <circle cx="8" cy="8" r="6" />
      <path d="M6.75 5.5v5l4-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Shield with a check — focus / protection projects. */
export function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <path d="M8 2 13 3.6v3.9c0 3.5-2.2 5.9-5 6.5-2.8-.6-5-3-5-6.5V3.6z" />
      <path d="M5.75 7.75 7.25 9.25 10.25 6" />
    </svg>
  );
}

/** Coffee cup with steam — cafe / hospitality projects. */
export function CupIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <path d="M3.5 6.5h7v3.25a3.5 3.5 0 0 1-3.5 3.5 3.5 3.5 0 0 1-3.5-3.5z" />
      <path d="M10.5 7.25h1a1.75 1.75 0 0 1 0 3.5h-1" />
      <path d="M5.5 2.75c0 .55-.5.55-.5 1.1M8 2.75c0 .55-.5.55-.5 1.1" />
    </svg>
  );
}

/** Crossed blades — barber / booking projects. */
export function ScissorsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <circle cx="4.25" cy="4.25" r="1.5" />
      <circle cx="4.25" cy="11.75" r="1.5" />
      <path d="M5.6 5.3 13 12.5M5.6 10.7 13 3.5" />
    </svg>
  );
}

/** Three columns — kanban / board projects. */
export function KanbanIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <rect x="2.25" y="2.5" width="3" height="11" rx="1" />
      <rect x="6.5" y="2.5" width="3" height="7" rx="1" />
      <rect x="10.75" y="2.5" width="3" height="9" rx="1" />
    </svg>
  );
}

/** Perforated ticket stub — ticketing / ITSM projects. */
export function TicketIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <path d="M2.5 5.75a1.15 1.15 0 1 0 0-2.3V3a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v.45a1.15 1.15 0 1 0 0 2.3v3.5a1.15 1.15 0 1 0 0 2.3V13a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-.45a1.15 1.15 0 1 0 0-2.3z" />
      <path d="M8 3v1.3M8 6.35v1.3M8 9.7v1.3M8 13v-1" />
    </svg>
  );
}

/** Sun, for switching to light theme. */
export function SunIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5v1.5M8 13v1.5M3.5 3.5l1 1M11.5 11.5l1 1M1.5 8h1.5M13 8h1.5M3.5 12.5l1-1M11.5 4.5l1-1" />
    </svg>
  );
}

/** Moon, for switching to dark theme. */
export function MoonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <path d="M13.5 9.3A5.75 5.75 0 1 1 6.7 2.5a4.6 4.6 0 0 0 6.8 6.8Z" />
    </svg>
  );
}

/** Forward slash, for the command-palette shortcut hint. */
export function SlashIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <path d="M10.5 2.5 5.5 13.5" />
    </svg>
  );
}

/** Small bird in flight — the ambient-sound toggle. */
export function BirdIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <path d="M1.5 8.5c1.5-2 3-2 4 0 1-2 2.5-2.5 4-1.5 1.2.8 2 .6 3-.5" />
      <path d="M8 7.5C9.5 6 11.5 5.5 14.5 6" />
    </svg>
  );
}

/** Speaker with an X — muted state of the ambient toggle. */
export function SpeakerMuteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <path d="M2 6.5h2.5L8 4v8L4.5 9.5H2z" />
      <path d="m10.5 6 3 4M13.5 6l-3 4" />
    </svg>
  );
}

/** Certificate seal, for the credentials list. */
export function BadgeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <circle cx="8" cy="6.25" r="3.75" />
      <path d="M5.5 9.5 4.5 14.5 8 12.75l3.5 1.75-1-5" />
    </svg>
  );
}
