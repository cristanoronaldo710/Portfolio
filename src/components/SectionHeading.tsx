import type { ReactNode } from "react";
import { Reveal } from "./motion";
import { SplitHeading } from "./SplitHeading";

type SectionHeadingProps = {
  /** Small mono eyebrow, e.g. "01 — Work". */
  eyebrow: string;
  title: string;
  id: string;
  children?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  id,
  children,
}: SectionHeadingProps) {
  return (
    <div>
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-ink-muted">
          {eyebrow}
        </p>
      </Reveal>

      <SplitHeading
        as="h2"
        id={id}
        text={title}
        className="display-type mt-5 max-w-[20ch] text-balance text-[clamp(2.25rem,6vw,4.5rem)] text-ink"
      />

      {children && (
        <Reveal delay={0.15}>
          <div className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink-muted">
            {children}
          </div>
        </Reveal>
      )}
    </div>
  );
}
