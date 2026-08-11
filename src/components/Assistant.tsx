"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  certifications,
  education,
  experience,
  profile,
  projects,
  techStack,
} from "@/content/profile";
import { EASE } from "./motion";
import { RichText } from "./RichText";
import { ChatIcon, CloseIcon, SendIcon } from "./icons";

type Message = { from: "bot" | "user"; text: string };

const SUGGESTIONS = [
  "What's your stack?",
  "Show me your projects",
  "Are you available?",
  "How do I contact you?",
];

/**
 * Doobie answers from the data in profile.ts by keyword match — no API key, no
 * network call, nothing to run server-side. It genuinely cannot answer
 * anything that isn't in that file, so it says so rather than inventing.
 */
function answer(input: string): string {
  const q = input.toLowerCase();
  const has = (...words: string[]) => words.some((w) => q.includes(w));

  if (has("hi", "hello", "hey", "yo ", "sup")) {
    return `Hey — I'm Doobie. Ask me about ${profile.name}'s stack, projects, or how to reach him.`;
  }

  if (has("stack", "tech", "language", "framework", "tool", "skill", "know")) {
    const lines = techStack.map(
      (g) => `${g.group}: ${g.items.map((i) => i.name).join(", ")}`,
    );
    return `Here's the full stack.\n\n${lines.join("\n\n")}`;
  }

  if (has("project", "work", "built", "portfolio", "case study", "case-study")) {
    const withStudies = projects.filter((p) => p.caseStudy);
    const list = projects
      .map((p) => `• ${p.title} (${p.year}) — ${p.summary}`)
      .join("\n");
    return `${projects.length} projects on the page:\n\n${list}\n\n${withStudies.length} have full case studies — scroll to Work and hit "Read case study".`;
  }

  if (has("available", "hiring", "hire", "job", "role", "freelance", "open")) {
    return profile.available
      ? `Yes — ${profile.availabilityNote.toLowerCase()}. Drop the details in the **enquiry form** at the bottom of the page and he'll come back to you.`
      : `Not actively looking right now, but always happy to talk — there's an enquiry form at the bottom of the page.`;
  }

  if (has("contact", "email", "reach", "linkedin", "github", "hire you", "talk")) {
    return `Use the **enquiry form** at the bottom of the page — that's the fastest route, and the email address comes straight back to you once you send it.\n\nFor a quick question there's a **WhatsApp** button beside the form (${profile.whatsapp.display}). LinkedIn and GitHub are in the footer.`;
  }

  if (has("experience", "worked", "job history", "career")) {
    return experience
      .map((e) => `${e.role} — ${e.org} (${e.period})`)
      .join("\n");
  }

  if (has("education", "study", "studied", "degree", "college", "university", "school")) {
    return education.map((e) => `${e.degree} — ${e.school} (${e.period})`).join("\n");
  }

  if (has("certif", "credential", "course")) {
    return certifications
      .map((c) => `${c.name} — ${c.issuer} (${c.date})`)
      .join("\n");
  }

  if (has("who", "about", "yourself", "bio", "background")) {
    return profile.about[0];
  }

  if (has("location", "where", "based", "remote", "timezone")) {
    return `${profile.name} is based in ${profile.location}.`;
  }

  if (has("this site", "this website", "built this", "how did you build")) {
    return "Next.js, TypeScript, Tailwind and Framer Motion. Tech wall icons are Devicon, the grain is an SVG turbulence filter, and I'm about 90 lines of keyword matching — no AI, no API key.";
  }

  return `I only know what's on this page — try asking about the stack, projects, experience, education, certifications, or how to get in touch.\n\nFor anything else, use the enquiry form at the bottom of the page.`;
}

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: `Hi, I'm **Doobie** — ${profile.name}'s site guide. Ask me about the work, the stack, or how to get in touch.`,
    },
  ]);

  const reduce = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [messages, reduce]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    inputRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { from: "user", text: trimmed },
      { from: "bot", text: answer(trimmed) },
    ]);
    setInput("");
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-label="Doobie, site assistant"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.15 } }
                : { opacity: 0, y: 12, scale: 0.97, transition: { duration: 0.18 } }
            }
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed bottom-24 right-4 z-[65] flex h-[27rem] w-[calc(100vw-2rem)] max-w-sm origin-bottom-right flex-col overflow-hidden rounded-3xl border border-line-soft bg-canvas/80 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.4)] backdrop-blur-2xl backdrop-saturate-150 sm:right-6"
          >
            <div className="flex items-center justify-between border-b border-line-soft/70 px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-medium text-ink">Doobie</p>
                  <p className="text-[11px] text-ink-muted">
                    Ask about {profile.name.split(" ")[0]}&rsquo;s work
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close Doobie"
                className="-mr-1.5 inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-ink-muted transition-colors duration-300 hover:text-ink"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 py-4"
              aria-live="polite"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <p
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      message.from === "user"
                        ? "bg-ink text-canvas"
                        : "border border-line-soft bg-subtle/70 text-ink-soft"
                    }`}
                  >
                    {message.from === "bot" ? (
                      <RichText text={message.text} />
                    ) : (
                      message.text
                    )}
                  </p>
                </div>
              ))}
            </div>

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 px-5 pb-3">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="cursor-pointer rounded-full border border-line-soft bg-subtle/60 px-3 py-1.5 text-[11px] text-ink-muted transition-colors duration-300 hover:border-ink-muted hover:text-ink"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(event) => {
                event.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-line-soft/70 px-3 py-3"
            >
              <label htmlFor="assistant-input" className="sr-only">
                Ask a question
              </label>
              <input
                id="assistant-input"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask Doobie something…"
                autoComplete="off"
                className="min-h-11 flex-1 rounded-full bg-transparent px-3 text-sm text-ink outline-none placeholder:text-ink-muted"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!input.trim()}
                className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ink text-canvas transition-opacity duration-300 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <SendIcon className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close Doobie" : "Open Doobie, the site assistant"}
        aria-expanded={open}
        whileHover={reduce ? undefined : { scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="fixed bottom-5 right-4 z-[65] inline-flex size-14 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-ink text-canvas shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] sm:right-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "chat"}
            initial={{ opacity: 0, rotate: open ? -90 : 90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: open ? 90 : -90, scale: 0.6 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="grid place-items-center"
          >
            {open ? (
              <CloseIcon className="size-5" />
            ) : (
              <ChatIcon className="size-5" />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </>
  );
}
