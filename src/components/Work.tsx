import Image from "next/image";
import { projects, type Project } from "@/content/profile";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { ArrowIcon } from "./icons";

export function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28"
    >
      <SectionHeading eyebrow="01 — Work" title="Selected projects" id="work-heading" />

      <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal
            key={`${project.title}-${index}`}
            delay={(index % 2) * 80}
            className={project.featured ? "sm:col-span-2" : undefined}
          >
            <ProjectCard project={project} index={index} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isExternal = project.href?.startsWith("http");

  return (
    <article className="group relative flex h-full flex-col">
      <div
        className={`relative w-full overflow-hidden rounded-lg border border-line bg-surface ${
          project.featured ? "aspect-16/9" : "aspect-4/3"
        }`}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} — ${project.summary}`}
            fill
            sizes={
              project.featured
                ? "(min-width: 1024px) 1152px, 100vw"
                : "(min-width: 640px) 50vw, 100vw"
            }
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <Placeholder index={index} />
        )}
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl font-semibold tracking-[-0.01em] text-ink sm:text-2xl">
            {project.href ? (
              <a
                href={project.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer noopener" : undefined}
                className="cursor-pointer after:absolute after:inset-0 after:content-['']"
              >
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>

          {project.href && (
            <ArrowIcon className="size-4 shrink-0 translate-y-0.5 text-ink-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-ink" />
          )}
        </div>

        <p className="mt-1.5 text-sm text-ink-muted">
          {project.client}
          <span aria-hidden="true" className="mx-2 text-line-strong">
            ·
          </span>
          <span className="tabular-nums">{project.year}</span>
        </p>

        <p className="mt-4 max-w-[52ch] leading-relaxed text-ink-soft">
          {project.summary}
        </p>

        {project.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-line px-3 py-1 text-xs text-ink-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

/** Typographic stand-in shown until a real image is dropped into /public/work. */
function Placeholder({ index }: { index: number }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#f4f4f5_0%,#fafafa_100%)]">
      <span className="font-display text-6xl font-semibold tabular-nums text-line-strong sm:text-7xl">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}
