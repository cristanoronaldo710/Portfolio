"use client";

"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { projects, type Project } from "@/content/profile";
import { ScrollScale } from "./motion";
import { GlassSheen } from "./GlassSheen";
import { SectionHeading } from "./SectionHeading";
import { CaseStudyReader } from "./CaseStudyReader";
import { RichText } from "./RichText";
import { ArrowIcon, CodeIcon, ReadIcon } from "./icons";

export function Work() {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32"
    >
      <SectionHeading eyebrow="02 — Work" title="Things I've built." id="work-heading">
        A few projects that show how I think about structure, performance, and
        the details users actually feel.
      </SectionHeading>

      <div className="mt-20 grid gap-6 sm:grid-cols-2">
        {projects.map((project, index) => (
          <ScrollScale
            key={project.slug}
            className={project.featured ? "sm:col-span-2" : undefined}
          >
            <ProjectCard
              project={project}
              index={index}
              onOpen={() => setOpen(project)}
            />
          </ScrollScale>
        ))}
      </div>

      <CaseStudyReader project={open} onClose={() => setOpen(null)} />
    </section>
  );
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <GlassSheen className="h-full overflow-hidden rounded-3xl" size={420}>
      <motion.article
        whileHover={reduce ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line-soft bg-subtle transition-shadow duration-500 hover:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.22)]"
      >
      <div
        className={`relative w-full overflow-hidden ${
          project.featured ? "aspect-21/9" : "aspect-16/10"
        }`}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} — ${project.summary}`}
            fill
            sizes={
              project.featured
                ? "(min-width: 1152px) 1152px, 100vw"
                : "(min-width: 640px) 50vw, 100vw"
            }
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <Placeholder index={index} />
        )}
      </div>

      <div className="flex flex-1 flex-col bg-canvas p-7 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              {project.title}
            </h3>
            <p className="mt-1.5 font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
              {project.client}
              <span aria-hidden="true" className="mx-2 text-line">
                /
              </span>
              <span className="tabular-nums">{project.year}</span>
            </p>
          </div>
        </div>

        <p className="mt-5 max-w-[54ch] flex-1 leading-relaxed text-ink-soft">
          <RichText text={project.summary} />
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line-soft bg-subtle px-3 py-1 font-mono text-[11px] tracking-wide text-ink-muted"
            >
              {tag}
            </li>
          ))}
        </ul>

        {(project.href || project.repo || project.caseStudy) && (
          <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-line-soft pt-6">
            {project.caseStudy && (
              <button
                type="button"
                onClick={onOpen}
                className="group/cta inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-canvas transition-opacity duration-300 hover:opacity-85"
              >
                <ReadIcon className="size-4" />
                Read case study
              </button>
            )}
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer noopener"
                className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-sm transition-all duration-300 ${
                  project.caseStudy
                    ? "border border-line text-ink-soft hover:border-ink-muted hover:text-ink"
                    : "bg-ink font-medium text-canvas hover:opacity-85"
                }`}
              >
                Live site
                <ArrowIcon className="size-3.5" />
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line px-5 text-sm text-ink-soft transition-colors duration-300 hover:border-ink-muted hover:text-ink"
              >
                <CodeIcon className="size-4" />
                Source
              </a>
            )}
          </div>
        )}
        </div>
      </motion.article>
    </GlassSheen>
  );
}

/** Typographic stand-in shown until a real image is dropped into /public/work. */
function Placeholder({ index }: { index: number }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#f3efe6_0%,#e6ded0_48%,#efe9dd_100%)]">
      {/* Exposed grid + plate number: unfinished on purpose, until a real
          screenshot lands in /public/work. */}
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] [background-size:32px_32px]" />
      <span className="relative text-7xl font-semibold tabular-nums tracking-tight text-ink/10 sm:text-8xl">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}
