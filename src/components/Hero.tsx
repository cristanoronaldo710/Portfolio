import { profile, socials } from "@/content/profile";
import { Reveal } from "./Reveal";
import { ArrowIcon } from "./icons";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28">
      <Reveal>
        {profile.available && (
          <p className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-2 pl-3 pr-4 text-sm text-ink-muted">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-accent"
            />
            {profile.availabilityNote}
          </p>
        )}
      </Reveal>

      <Reveal delay={60}>
        <h1 className="font-display text-[clamp(2.75rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-ink">
          {profile.name}
        </h1>
      </Reveal>

      <Reveal delay={120}>
        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-lg text-ink-soft sm:text-xl">
          <span>{profile.role}</span>
          <span aria-hidden="true" className="text-line-strong">
            /
          </span>
          <span className="text-ink-muted">{profile.location}</span>
        </p>
      </Reveal>

      <Reveal delay={180}>
        <p className="mt-10 max-w-[34ch] text-balance text-xl leading-relaxed text-ink-soft sm:text-2xl">
          {profile.tagline}
        </p>
      </Reveal>

      <Reveal delay={240}>
        <div className="mt-12 flex flex-wrap items-center gap-3">
          <a
            href="#work"
            className="group inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full bg-ink px-7 text-[15px] font-medium text-paper transition-opacity duration-200 hover:opacity-85"
          >
            See selected work
            <ArrowIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>

          {socials.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel={
                social.href.startsWith("http") ? "noreferrer noopener" : undefined
              }
              className="inline-flex min-h-12 cursor-pointer items-center rounded-full border border-line bg-surface px-6 text-[15px] text-ink-soft transition-colors duration-200 hover:border-ink-muted hover:text-ink"
            >
              {social.label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
