"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { EASE } from "./motion";
import { ArrowIcon, CheckIcon } from "./icons";

type Errors = Partial<Record<"name" | "email" | "message" | "form", string>>;
type Contact = { email: string | null; phone: string | null };

const FIELD =
  "min-h-12 w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 text-[15px] text-night-ink outline-none transition-colors duration-300 placeholder:text-night-muted/70 focus:border-white/35 focus:bg-white/[0.07]";

export function EnquiryForm() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [contact, setContact] = useState<Contact | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus("sending");
    setErrors({});

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setErrors(
          result.errors ?? {
            form: result.error ?? "Something went wrong. Try again?",
          },
        );
        setStatus("idle");
        /* Move focus to the first thing that needs fixing. */
        const firstBad = Object.keys(result.errors ?? {})[0];
        if (firstBad) form.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
        return;
      }

      setContact(result.contact);
      setStatus("sent");
      form.reset();
    } catch {
      setErrors({ form: "Couldn't reach the server. Check your connection." });
      setStatus("idle");
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "sent" ? (
        <motion.div
          key="sent"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="rounded-2xl border border-white/12 bg-white/[0.05] p-7 backdrop-blur-xl"
          role="status"
        >
          <div className="flex size-11 items-center justify-center rounded-full bg-night-ink text-night">
            <CheckIcon className="size-5" />
          </div>

          <h3 className="mt-5 text-xl font-semibold tracking-[-0.01em] text-night-ink">
            Got it — thanks.
          </h3>
          <p className="mt-2 leading-relaxed text-night-muted">
            I&rsquo;ll come back to you shortly. In the meantime, here&rsquo;s
            the direct line:
          </p>

          <dl className="mt-6 space-y-3">
            {contact?.email && (
              <div className="flex flex-wrap items-baseline gap-x-3">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-night-muted">
                  Email
                </dt>
                <dd>
                  <a
                    href={`mailto:${contact.email}`}
                    className="cursor-pointer text-night-ink underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>
            )}
            {contact?.phone && (
              <div className="flex flex-wrap items-baseline gap-x-3">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-night-muted">
                  Phone
                </dt>
                <dd className="text-night-ink">{contact.phone}</dd>
              </div>
            )}
          </dl>

          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-7 inline-flex min-h-11 cursor-pointer items-center text-sm text-night-muted underline underline-offset-4 transition-colors hover:text-night-ink"
          >
            Send another
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          noValidate
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="space-y-4"
        >
          {/* Honeypot — hidden from people, catnip for bots. */}
          <div aria-hidden="true" className="absolute left-[-9999px] opacity-0">
            <label htmlFor="company_website">Company website</label>
            <input
              id="company_website"
              name="company_website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" error={errors.name}>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                className={FIELD}
              />
            </Field>

            <Field label="Email" name="email" error={errors.email}>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@company.com"
                className={FIELD}
              />
            </Field>
          </div>

          <Field label="Subject" name="subject" optional>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="Role, project, or just saying hello"
              className={FIELD}
            />
          </Field>

          <Field label="Message" name="message" error={errors.message}>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="What are you working on?"
              className={`${FIELD} resize-y py-3 leading-relaxed`}
            />
          </Field>

          {errors.form && (
            <p role="alert" className="text-sm text-red-300">
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="group inline-flex min-h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-night-ink px-8 text-[15px] font-medium text-night transition-opacity duration-300 hover:opacity-90 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
          >
            {status === "sending" ? "Sending…" : "Send enquiry"}
            {status !== "sending" && (
              <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            )}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  name,
  error,
  optional,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 flex items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-night-muted"
      >
        {label}
        {optional && <span className="normal-case tracking-normal">optional</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
