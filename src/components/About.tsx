import { profile } from "@/content/profile";
import { GlassSheen } from "./GlassSheen";
import { RichText } from "./RichText";
import { Parallax, Reveal, Stagger, StaggerItem } from "./motion";
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
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32"
    >
      <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-24">
        <div>
          <SectionHeading eyebrow="03 — About" title="How I work." id="about-heading" />

          <Reveal delay={0.1}>
            <div className="mt-10 space-y-6 text-lg leading-relaxed text-ink-soft">
              {profile.about.map((paragraph, index) => (
                <p key={index} className="max-w-[58ch]">
                  <RichText text={paragraph} />
                </p>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Drifts against the scroll so the two columns feel layered rather
            than pasted side by side. */}
        <Parallax distance={34}>
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
      </div>
    </section>
  );
}
