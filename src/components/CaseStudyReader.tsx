"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { Project } from "@/content/profile";
import { EASE } from "./motion";
import { ProjectVisual } from "./ProjectVisual";
import { RichText } from "./RichText";
import { CloseIcon } from "./icons";

export function CaseStudyReader({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<Element | null>(null);

  useEffect(() => {
    if (!project) return;

    restoreFocusTo.current = document.activeElement;

    /* Lock the page behind the reader without letting it jump: replacing the
       scrollbar's width with padding keeps the layout still. */
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbar}px`;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      /* Keep Tab inside the dialog. */
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      (restoreFocusTo.current as HTMLElement | null)?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project?.caseStudy && (
        <motion.div
          key="reader"
          className="fixed inset-0 z-[70] flex justify-center overflow-y-auto overscroll-contain p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {/* Frosted backdrop — click anywhere outside to dismiss. */}
          <button
            type="button"
            aria-label="Close case study"
            onClick={onClose}
            className="fixed inset-0 cursor-pointer bg-ink/45 backdrop-blur-md"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            tabIndex={-1}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.18 } }
                : { opacity: 0, y: 16, scale: 0.99, transition: { duration: 0.2 } }
            }
            transition={{ duration: 0.45, ease: EASE }}
            className="relative z-10 my-0 h-fit w-full max-w-3xl overflow-hidden rounded-none border border-line-soft bg-canvas shadow-[0_40px_120px_-30px_rgba(0,0,0,0.45)] sm:my-6 sm:rounded-3xl"
          >
            <Header project={project} onClose={onClose} />

            <div className="px-6 pb-16 sm:px-10">
              <Section label="The problem" body={project.caseStudy.problem} />
              <Section label="What I built" body={project.caseStudy.solution} />

              <Block label="The stack">
                <ul className="divide-y divide-line-soft border-y border-line-soft">
                  {project.caseStudy.stack.map((item) => (
                    <li
                      key={item.name}
                      className="grid grid-cols-1 gap-x-6 gap-y-1 py-4 sm:grid-cols-[9rem_minmax(0,1fr)]"
                    >
                      <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink sm:pt-1">
                        {item.name}
                      </p>
                      <p className="leading-relaxed text-ink-muted">{item.why}</p>
                    </li>
                  ))}
                </ul>
              </Block>

              <Block label="Screens">
                <div className="space-y-4">
                  {project.caseStudy.images.map((shot, index) => (
                    <figure key={index}>
                      <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-line-soft bg-subtle">
                        {shot.src ? (
                          <Image
                            src={shot.src}
                            alt={shot.caption}
                            fill
                            sizes="(min-width: 768px) 720px, 100vw"
                            className="object-cover"
                          />
                        ) : project.theme ? (
                          <ProjectVisual
                            icon={project.theme.icon}
                            accent={project.theme.accent}
                          />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#f3efe6_0%,#e6ded0_48%,#efe9dd_100%)]">
                            <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] [background-size:32px_32px]" />
                            <span className="relative font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                              Screenshot {index + 1}
                            </span>
                          </div>
                        )}
                      </div>
                      <figcaption className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                        {shot.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </Block>

              <Block label="Summary">
                <Paragraphs body={project.caseStudy.summary} />
              </Block>

              <Block label="Conclusion">
                <Paragraphs body={project.caseStudy.conclusion} />
              </Block>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Header({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 border-b border-line-soft bg-canvas/85 px-6 py-5 backdrop-blur-xl sm:px-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            <span className="tabular-nums">{project.year}</span>
            <span aria-hidden="true" className="mx-2 text-line">
              /
            </span>
            {project.caseStudy?.role}
          </p>
          <h2
            id="case-study-title"
            className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl"
          >
            {project.title}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close case study"
          className="-mr-1 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line-soft text-ink-muted transition-colors duration-300 hover:border-ink-muted hover:text-ink"
        >
          <CloseIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.22em] text-ink-muted">
        {label}
      </h3>
      {children}
    </section>
  );
}

function Section({ label, body }: { label: string; body: string }) {
  return (
    <Block label={label}>
      <Paragraphs body={body} />
    </Block>
  );
}

/** Splits on blank lines and renders **bold** / ==highlight== markers. */
function Paragraphs({ body }: { body: string }) {
  return (
    <div className="space-y-5">
      {body.split("\n\n").map((paragraph, index) => (
        <p key={index} className="text-lg leading-relaxed text-ink-soft">
          <RichText text={paragraph} />
        </p>
      ))}
    </div>
  );
}
