import { profile } from "@/content/profile";
import { GlassSheen } from "./GlassSheen";
import { Parallax, Stagger, StaggerItem } from "./motion";
import { PinnedAboutReveal } from "./PinnedReveal";
import { SectionHeading } from "./SectionHeading";

const principles = [
  {
    title: "Ship it small",
    body: "Narrow, working slices beat big-bang releases. Every change should be reviewable in one sitting.",
  },
  {
    title: "Own the whole path",
    body: "From the click to the query plan. Knowing both ends is what makes the middle simple.",
  },
  {
    title: "Performance is UX",
    body: "A fast interface feels considered. Budgets and measurements, not vibes.",
  },
];

export function About() {
  /* Built once, handed to PinnedAboutReveal, which renders it beside either
     the pinned paragraph crossfade (roomy desktop) or the plain stacked
     layout (everywhere else) — same markup either way. */
  const aside = (
    <Parallax>
      <Stagger className="space-y-4">
        {principles.map((principle) => (
          <StaggerItem key={principle.title}>
            <GlassSheen className="rounded-2xl" size={260}>
              <div className="rounded-2xl border border-line-soft bg-subtle/80 p-6 backdrop-blur-xl transition-colors duration-500 hover:border-line">
                <h3 className="font-semibold tracking-[-0.01em] text-ink">
                  {principle.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                  {principle.body}
                </p>
              </div>
            </GlassSheen>
          </StaggerItem>
        ))}
      </Stagger>
    </Parallax>
  );

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="container-wide px-6 py-24 sm:px-8 sm:py-32"
    >
      <SectionHeading eyebrow="03 — About" title="How I work." id="about-heading" />

      <div className="mt-16">
        <PinnedAboutReveal paragraphs={profile.about} aside={aside} />
      </div>
    </section>
  );
}
