"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  certifications,
  education,
  experience,
  type Certification,
} from "@/content/profile";
import { Reveal } from "./motion";
import { SectionHeading } from "./SectionHeading";
import { ArrowIcon, BadgeIcon } from "./icons";

export function Background() {
  return (
    <section
      id="background"
      aria-labelledby="background-heading"
      className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32"
    >
      <SectionHeading
        eyebrow="04 — Background"
        title="Experience, education, credentials."
        id="background-heading"
      />

      <div className="mt-20 space-y-20">
        {experience.length > 0 && (
          <div>
            <GroupLabel>Experience</GroupLabel>
            <ol className="mt-8">
              {experience.map((entry, index) => (
                <Reveal key={`${entry.org}-${index}`} delay={index * 0.05}>
                  <li className="grid gap-x-8 gap-y-2 border-t border-line-soft py-8 sm:grid-cols-[10rem_minmax(0,1fr)]">
                    <p className="font-mono text-xs uppercase tracking-[0.14em] tabular-nums text-ink-muted sm:pt-1.5">
                      {entry.period}
                    </p>
                    <div>
                      <h4 className="text-lg font-semibold tracking-[-0.01em] text-ink">
                        {entry.role}
                      </h4>
                      <p className="mt-1 text-ink-soft">{entry.org}</p>
                      {entry.description && (
                        <p className="mt-3 max-w-[58ch] leading-relaxed text-ink-muted">
                          {entry.description}
                        </p>
                      )}
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <GroupLabel>Education</GroupLabel>
            <ol className="mt-8">
              {education.map((entry, index) => (
                <Reveal key={`${entry.school}-${index}`} delay={index * 0.05}>
                  <li className="grid gap-x-8 gap-y-2 border-t border-line-soft py-8 sm:grid-cols-[10rem_minmax(0,1fr)]">
                    <p className="font-mono text-xs uppercase tracking-[0.14em] tabular-nums text-ink-muted sm:pt-1.5">
                      {entry.period}
                    </p>
                    <div>
                      <h4 className="text-lg font-semibold tracking-[-0.01em] text-ink">
                        {entry.degree}
                      </h4>
                      <p className="mt-1 text-ink-soft">{entry.school}</p>
                      {entry.detail && (
                        <p className="mt-3 max-w-[58ch] leading-relaxed text-ink-muted">
                          {entry.detail}
                        </p>
                      )}
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        )}

        {certifications.length > 0 && (
          <div>
            <GroupLabel>Certifications</GroupLabel>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert, index) => (
                <Reveal key={`${cert.name}-${index}`} delay={index * 0.05}>
                  <CertificationCard cert={cert} />
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-ink">
        {children}
      </h3>
    </Reveal>
  );
}

function CertificationCard({ cert }: { cert: Certification }) {
  const reduce = useReducedMotion();

  return (
    <motion.li
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="group relative flex h-full flex-col rounded-2xl border border-line-soft bg-subtle p-6 transition-all duration-500 hover:border-line hover:shadow-[0_20px_44px_-22px_rgba(0,0,0,0.2)]"
    >
      <div className="flex items-start justify-between gap-3">
        <BadgeIcon className="size-5 shrink-0 text-ink-muted transition-colors duration-300 group-hover:text-accent" />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] tabular-nums text-ink-muted">
          {cert.date}
        </span>
      </div>

      <h4 className="mt-5 font-semibold leading-snug tracking-[-0.01em] text-ink">
        {cert.href ? (
          <a
            href={cert.href}
            target="_blank"
            rel="noreferrer noopener"
            className="cursor-pointer after:absolute after:inset-0 after:content-['']"
          >
            {cert.name}
          </a>
        ) : (
          cert.name
        )}
      </h4>

      <p className="mt-1.5 text-sm text-ink-soft">{cert.issuer}</p>

      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        {cert.credentialId ? (
          <p className="font-mono text-[11px] text-ink-muted">
            ID {cert.credentialId}
          </p>
        ) : (
          <span />
        )}
        {cert.href && (
          <ArrowIcon className="size-4 shrink-0 text-ink-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-ink" />
        )}
      </div>
    </motion.li>
  );
}
