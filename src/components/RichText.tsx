import { Fragment } from "react";

/**
 * Renders the two bits of emphasis the copy uses:
 *
 *   **bold**        key phrase, carries the scan
 *   ==highlight==   marker pen, for the one thing per section that matters
 *
 * Deliberately not a markdown library — this keeps profile.ts plain strings
 * anyone can edit, without adding a parser to the bundle.
 */
export function RichText({
  text,
  tone = "light",
}: {
  text: string;
  /** "dark" = rendered on a dark panel. */
  tone?: "light" | "dark";
}) {
  const parts = text.split(/(\*\*[^*]+\*\*|==[^=]+==)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong
              key={index}
              className={`font-semibold ${
                tone === "dark" ? "text-night-ink" : "text-ink"
              }`}
            >
              {part.slice(2, -2)}
            </strong>
          );
        }

        if (part.startsWith("==") && part.endsWith("==")) {
          return (
            <mark
              key={index}
              /* box-decoration-break keeps the marker intact when a highlight
                 wraps across two lines instead of clipping the second half. */
              className={`bg-transparent font-medium decoration-2 underline-offset-[6px] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] ${
                tone === "dark"
                  ? "text-night-ink underline decoration-white/30"
                  : "text-ink underline decoration-accent/35"
              }`}
            >
              {part.slice(2, -2)}
            </mark>
          );
        }

        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}
