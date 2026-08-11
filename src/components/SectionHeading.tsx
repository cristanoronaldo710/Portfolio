import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  /** Small uppercase eyebrow, e.g. "01 — Work". */
  eyebrow: string;
  title: string;
  id: string;
};

export function SectionHeading({ eyebrow, title, id }: SectionHeadingProps) {
  return (
    <Reveal>
      <div className="border-t border-line pt-6">
        <p className="font-display text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
          {eyebrow}
        </p>
        <h2
          id={id}
          className="mt-5 font-display text-[clamp(1.875rem,4.5vw,3rem)] font-semibold leading-tight tracking-[-0.02em] text-ink"
        >
          {title}
        </h2>
      </div>
    </Reveal>
  );
}
