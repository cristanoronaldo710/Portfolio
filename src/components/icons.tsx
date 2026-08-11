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

/** Certificate seal, for the credentials list. */
export function BadgeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" {...base} className={className}>
      <circle cx="8" cy="6.25" r="3.75" />
      <path d="M5.5 9.5 4.5 14.5 8 12.75l3.5 1.75-1-5" />
    </svg>
  );
}
