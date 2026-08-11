import { NextResponse } from "next/server";

/**
 * Enquiry endpoint.
 *
 * ⚠ NOT YET PERSISTED. Right now a valid enquiry is validated, logged to the
 * server console, and dropped. Wire storage at the marked TODO before relying
 * on this — until then an enquiry submitted in production is lost.
 *
 * Contact details live here rather than in the client bundle so they never
 * appear in the page source. They are returned only after a valid submission.
 */

const TO_EMAIL = process.env.ENQUIRY_TO_EMAIL ?? "";
const TO_PHONE = process.env.ENQUIRY_PHONE ?? "";

const LIMITS = { name: 100, email: 200, subject: 150, message: 4000 };

/* Naive per-IP throttle. Resets on redeploy and is per-instance, which is
   fine for a portfolio — swap for Upstash/Redis if this ever gets real
   traffic. */
const RATE_LIMIT = { windowMs: 60_000, max: 3 };
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT.windowMs,
  );

  if (recent.length >= RATE_LIMIT.max) return true;

  recent.push(now);
  hits.set(ip, recent);

  /* Keep the map from growing without bound. */
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }

  return false;
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries just now. Try again in a minute." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request." },
      { status: 400 },
    );
  }

  /* Honeypot: a real person never fills a hidden field. Answer 200 so bots
     can't tell they were caught. */
  if (clean(body.company_website, 200)) {
    return NextResponse.json({ ok: true, contact: null });
  }

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const subject = clean(body.subject, LIMITS.subject);
  const message = clean(body.message, LIMITS.message);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please add your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    errors.email = "That email doesn't look right.";
  if (message.length < 10)
    errors.message = "A little more detail would help — 10 characters minimum.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const enquiry = {
    name,
    email,
    subject: subject || "(no subject)",
    message,
    receivedAt: new Date().toISOString(),
    ip,
  };

  // TODO: persist. Replace this log with a real write, e.g.
  //   await db.insert(enquiries).values(enquiry)
  // and/or a notification via Resend, Postmark, etc.
  console.info("[enquiry] NOT PERSISTED — wire storage here:", enquiry);

  return NextResponse.json({
    ok: true,
    contact: {
      email: TO_EMAIL || null,
      phone: TO_PHONE || null,
    },
  });
}
