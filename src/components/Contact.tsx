"use client";

import { motion, useReducedMotion } from "framer-motion";
import { profile, socials, whatsappHref } from "@/content/profile";
import { Reveal } from "./motion";
import { Texture } from "./Atmosphere";
import { EnquiryForm } from "./EnquiryForm";
import { ArrowIcon, WhatsAppIcon } from "./icons";

export function Contact() {
  const reduce = useReducedMotion();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="mx-auto max-w-6xl px-6 pb-16 pt-24 sm:px-8 sm:pt-32"
    >
      <Reveal>
        <div
          data-panel="dark"
          className="relative isolate overflow-hidden rounded-[2rem] bg-night px-8 py-20 sm:px-16 sm:py-28"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-90 blur-[90px] saturate-150"
          >
            <div className="absolute -left-20 top-0 size-[26rem] rounded-full bg-[radial-gradient(circle,rgba(104,158,206,0.52)_0%,transparent_70%)]" />
            <div className="absolute -right-16 bottom-0 size-[24rem] rounded-full bg-[radial-gradient(circle,rgba(150,128,214,0.46)_0%,transparent_70%)]" />
            <div className="absolute left-1/3 top-1/2 size-[20rem] rounded-full bg-[radial-gradient(circle,rgba(232,178,102,0.32)_0%,transparent_72%)]" />
          </div>

          <Texture tone="dark" opacity={0.5} className="-z-10 rounded-[2rem]" />

          <div className="on-night">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-night-muted">
              05 — Contact
            </p>

            <h2
              id="contact-heading"
              className="display-type mt-6 max-w-[16ch] text-balance text-[clamp(2.25rem,6.5vw,5rem)] font-semibold text-night-ink"
            >
              Let&rsquo;s build something.
            </h2>

            <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-16">
              <div>
                <p className="mb-8 max-w-[46ch] text-lg leading-relaxed text-night-muted">
                  Got a role, a project, or a half-formed idea? Send it over and
                  I&rsquo;ll come back to you.
                </p>
                <EnquiryForm />
              </div>

              <div className="lg:pt-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-night-muted">
                  Prefer to chat?
                </p>

                <motion.a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  whileHover={reduce ? undefined : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="group mt-4 inline-flex min-h-13 w-full cursor-pointer items-center gap-3 rounded-full border border-white/12 bg-white/[0.05] px-5 text-[15px] text-night-ink backdrop-blur-xl transition-colors duration-300 hover:border-[#25D366]/50 hover:bg-[#25D366]/10"
                >
                  <WhatsAppIcon className="size-5 shrink-0 text-[#25D366]" />
                  <span className="flex-1 text-left">
                    WhatsApp
                    <span className="block font-mono text-[11px] text-night-muted">
                      {profile.whatsapp.display}
                    </span>
                  </span>
                  <ArrowIcon className="size-4 shrink-0 text-night-muted transition-transform duration-300 group-hover:translate-x-0.5" />
                </motion.a>

                <p className="mt-5 text-sm leading-relaxed text-night-muted">
                  Usually quickest for a short question. For anything with
                  detail, the form is better.
                </p>
              </div>
            </div>

            <ul className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-night-line pt-8">
              {socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      social.href.startsWith("http")
                        ? "noreferrer noopener"
                        : undefined
                    }
                    className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-sm text-night-muted transition-colors duration-300 hover:text-night-ink"
                  >
                    {social.label}
                    <ArrowIcon className="size-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-sm text-ink-muted">
        <p>
          &copy; {new Date().getFullYear()} {profile.name}
        </p>
        <p className="font-mono text-xs">Built with Next.js &amp; Tailwind CSS</p>
      </footer>
    </section>
  );
}
