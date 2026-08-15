"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { projects, type Project } from "@/content/profile";
import { Parallax, ScrollScale, useJsProgress, useMotionScale } from "./motion";
import { GlassSheen } from "./GlassSheen";
import { SectionHeading } from "./SectionHeading";
import { CaseStudyReader } from "./CaseStudyReader";
import { ProjectVisual } from "./ProjectVisual";
import { RichText } from "./RichText";
import { ArrowIcon, CodeIcon, ReadIcon } from "./icons";

export function Work() {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="container-wide px-6 py-24 sm:px-8 sm:py-32"
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
        <CardMedia project={project} index={index} />

        {/* A gentler, opposite-feeling drift than the media above it — the
            two layers moving at different rates is what makes a flat card
            read as having depth as you scroll past it. */}
        <Parallax distance={9} className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col bg-canvas p-7 sm:p-8">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[11px] tabular-nums text-ink-muted">
                PRJ-{String(index + 1).padStart(3, "0")}
              </span>
              {project.href && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
                  <span className="size-1 rounded-full bg-accent" />
                  Live
                </span>
              )}
            </div>

            <div className="mt-2 flex items-start justify-between gap-4">
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
                  className="rounded-md border border-line-soft bg-subtle px-2.5 py-1 font-mono text-[11px] tracking-wide text-ink-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>

            {(project.href || project.repo || project.caseStudy) && (
              <div className="mt-7 flex flex-wrap items-center gap-2.5 border-t border-line-soft pt-6">
                {project.caseStudy && (
                  <button type="button" onClick={onOpen} className="btn btn-primary">
                    <ReadIcon className="size-3.5" />
                    Read case study
                  </button>
                )}
                {project.href && (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={project.caseStudy ? "btn" : "btn btn-primary"}
                  >
                    Live site
                    <ArrowIcon className="size-3.5" />
                  </a>
                )}
                {project.repo && (
                  <a href={project.repo} target="_blank" rel="noreferrer noopener" className="btn">
                    <CodeIcon className="size-3.5" />
                    Source
                  </a>
                )}
              </div>
            )}
          </div>
        </Parallax>
      </motion.article>
    </GlassSheen>
  );
}

/**
 * The image (or placeholder) sits in an oversized inner layer that drifts
 * vertically as the card crosses the viewport. Scaled up by a fixed margin
 * so the drift never uncovers an edge — `overflow-hidden` on the parent
 * crops the rest.
 */
function CardMedia({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const scale = useMotionScale();

  const { scrollYProgress: rawProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scrollYProgress = useJsProgress(rawProgress);

  const travel = 9 * scale;
  const y = useTransform(scrollYProgress, [0, 1], [`-${travel}%`, `${travel}%`]);

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden ${
        project.featured ? "aspect-21/9" : "aspect-16/10"
      }`}
    >
      <motion.div
        style={scale === 0 ? undefined : { y }}
        className="absolute inset-0 scale-[1.2]"
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
        ) : project.theme ? (
          <ProjectVisual
            icon={project.theme.icon}
            accent={project.theme.accent}
            index={index}
          />
        ) : (
          <Placeholder index={index} />
        )}
      </motion.div>
    </div>
  );
}

/**
 * Plain numbered plate — the fallback for a project with neither a real
 * screenshot nor a theme set yet.
 */
function Placeholder({ index }: { index: number }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#f3efe6_0%,#e6ded0_48%,#efe9dd_100%)]">
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] [background-size:32px_32px]" />
      <span className="relative text-7xl font-semibold tabular-nums tracking-tight text-ink/10 sm:text-8xl">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}
