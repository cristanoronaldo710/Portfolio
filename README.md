# Portfolio — Yash More

Single-page full-stack developer portfolio. Next.js 16, React 19, TypeScript,
Tailwind CSS v4, Framer Motion.

```bash
npm run dev
```

## Editing the content

**Everything comes from one file: [`src/content/profile.ts`](src/content/profile.ts).**

| What to change | Where |
| --- | --- |
| Name, role, location, email, tagline, About paragraphs | `profile` |
| "Open to work" badge | `profile.available` / `availabilityNote` |
| LinkedIn / GitHub / email links | `socials` |
| The three numbers under the hero | `stats` |
| Work grid + case studies | `projects` |
| Tech stack wall | `techStack` |
| Jobs | `experience` |
| **Education** | `education` ⚠ placeholder |
| **Certifications** | `certifications` ⚠ placeholder |

### ⚠ Still needs your real data

LinkedIn requires a login to read a profile, so **education and certifications
could not be imported** — both are clearly-marked placeholders in `profile.ts`.
Replace them with your actual entries. Same for `experience` and `projects`.

The About paragraphs are written prose, not lorem ipsum, but they were written
without knowing your specifics — no invented employers, dates, or numbers. Swap
in the real project that hooked you and they'll read as unmistakably yours.

### Adding project images

Drop files in `public/work/`, then reference them:

```ts
{
  title: "Rebrand",
  image: "/work/rebrand.jpg",
  href: "https://...",   // optional — adds a "Live site" button
  repo: "https://...",   // optional — adds a "Source" button
  featured: true,        // optional — spans both columns
}
```

Use **21:9** for featured cards, **16:10** otherwise, ~1600px wide, WebP or JPG.
Projects without an image get a numbered plate instead, so the grid always looks
deliberate.

### Case studies

Any project with a `caseStudy` object gets a **Read case study** button that
opens a full-screen reader (Escape or click-outside to close). Two are written:
`commerce-platform` and `realtime-collab`.

A case study has `role`, `problem`, `solution`, `stack` (name + why for each),
`summary`, `conclusion`, and `images`. Paragraphs split on a blank line
(`\n\n`).

The `images` array holds **screenshots of the finished site**. Each entry
renders full-width in the reader; leave `src` off and it shows a numbered
plate until you have the real thing:

```ts
images: [
  { src: "/work/commerce-catalogue.jpg", caption: "Catalogue with filters" },
  { caption: "Product detail, mobile" },   // no src yet → placeholder
]
```

⚠ **The two case studies are written as realistic examples, not as a record of
work you did.** They describe plausible projects in your voice so the layout is
filled and you can see the shape. Rewrite them with your real projects before
this goes anywhere public.

### Contact — enquiry form

⚠ **Enquiries are not stored yet.** A valid submission is validated, logged to
the server console, and dropped. Wire storage at the `TODO` in
[`src/app/api/enquiry/route.ts`](src/app/api/enquiry/route.ts) before relying on
it — anything submitted in production until then is lost.

**The email address is never in the page.** It isn't in `profile.ts` and doesn't
reach the client bundle; it lives in `ENQUIRY_TO_EMAIL` server-side and is
returned only in the response to a valid submission, which is what puts it
"behind" the form. Verified absent from `.next/static` and the static HTML.

The **WhatsApp number is public** — a `wa.me` link can't work otherwise. It's in
`profile.whatsapp` and appears in the hero and next to the form.

The endpoint already handles:

| | |
| --- | --- |
| Honeypot | Hidden `company_website` field; bots get `200` so they can't tell |
| Rate limit | 3/minute per IP, in-memory (swap for Redis if traffic is real) |
| Validation | Server-side, per-field errors returned to the form |
| Length caps | Name 100, email 200, subject 150, message 4000 |

Note this makes `/api/enquiry` a dynamic route — the rest of the site is still
prerendered static.

#### Environment variables

`.gitignore` already covers `.env*`, so `.env.local` is not committed. **Set
these on your host too**, or the confirmation screen shows no contact details:

```
ENQUIRY_TO_EMAIL=your@email.com
ENQUIRY_PHONE=+91 00000 00000
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Emphasis in copy

Any copy on the page supports two markers, so you can steer what a skimmer
reads without touching a component:

```
**bold**        key phrase, carries the scan
==highlight==   marker-pen underline, one per section at most
```

Works in `tagline`, `taglineSub`, `about`, project `summary`, and every case
study field. Rendered by [`RichText.tsx`](src/components/RichText.tsx) — about
40 lines, no markdown library in the bundle.

### Doobie

The bubble in the bottom-right is **Doobie**, and it's **rule-based, not an
LLM** — no API key, no network request, nothing to deploy. It keyword-matches
and answers straight out of `profile.ts`, so it stays correct as you edit and
it cannot invent anything. Unmatched questions get an honest "I only know
what's on this page".

To extend it, add a branch to `answer()` in
[`Assistant.tsx`](src/components/Assistant.tsx). That function is the single
seam to replace if you ever want a real model behind it.

### Adding technologies

Browse [devicon.dev](https://devicon.dev) for the class name:

```ts
{ name: "Rust", icon: "devicon-rust-original", color: "#ce9178" }
```

`color` is what the icon fades to on hover — pick something legible on the dark
panel. Icons render monochrome by default and colour on hover.

## Design

Warm cream paper, animated film grain, and a cinematic vignette over a
monochrome ink scale with a single deep-blue accent. Inter for text, JetBrains
Mono for labels. One dark panel (the stack wall) breaks the page rhythm.

- **Type** — Inter + JetBrains Mono via `next/font`, tightened tracking on display sizes
- **Colour** — tokens live in the `@theme` block in [`src/app/globals.css`](src/app/globals.css)
- **Grain** — SVG `feTurbulence` baked to a data URI, drifted in steps so it boils like film stock
- **Contrast** — every text pair clears WCAG AA (body ~5.2:1, headings ~16:1)

### The header

Glass throughout — translucent at 50% with `backdrop-blur-2xl` and a saturation
boost, so it picks up whatever is scrolling underneath rather than sitting on
top as a solid bar. It stays fully transparent until you scroll past 24px.

Sections that need light text carry `data-panel="dark"`. The nav measures those
against a probe line 32px down the viewport and inverts its own text, links and
Contact button when one passes under it. Add the attribute to any new dark
section and it will just work. The scroll-progress bar uses
`mix-blend-difference`, so it inverts against both panels on its own.

### Motion

All in [`src/components/motion.tsx`](src/components/motion.tsx) — `Reveal`,
`Stagger`, `Parallax`, `ScrollScale`, plus a `GlassSheen` cursor highlight.

**Motion adapts to the device.** Scroll travel is measured in pixels, so one
setting feels gentle on a tall desktop display and violent on a phone.
`useMotionScale()` scales every parallax effect:

| Condition | Strength |
| --- | --- |
| `prefers-reduced-motion` | 0 — transforms removed entirely |
| Touch device (`pointer: coarse`) | 0.4 — momentum scrolling makes parallax unstable |
| Viewport under 760px tall | 0.7 |
| Roomy desktop | 1.0 |

Springs are soft and heavily damped so a fast flick lands without overshoot.
Everything animates `transform` and `opacity` only — no layout thrash.

## Deploying

Push to GitHub, import at [vercel.com/new](https://vercel.com/new). Next.js is
detected automatically.

**Set one environment variable** — without it, link previews and `sitemap.xml`
point at localhost:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Already handled in [`next.config.ts`](next.config.ts) and the metadata:

- `robots.txt` and `sitemap.xml` generated at build time
- Open Graph + Twitter card tags, canonical URL, `theme-color`
- Security headers — `nosniff`, `SAMEORIGIN`, strict referrer policy, and a
  `Permissions-Policy` denying camera/mic/geolocation
- Textures served `immutable` with a one-year cache
- AVIF/WebP image formats, `framer-motion` imports tree-shaken
- `poweredByHeader` disabled

Everything prerenders as static HTML — there is no server runtime to pay for.

### Before you go public

- [ ] **Wire enquiry storage** — submissions are currently logged and dropped
- [ ] Set `ENQUIRY_TO_EMAIL`, `ENQUIRY_PHONE`, `NEXT_PUBLIC_SITE_URL` on the host
- [ ] Replace `education` and `certifications` (LinkedIn couldn't be read)
- [ ] Rewrite the two case studies with real projects
- [ ] Replace the placeholder GitHub URL in `socials`
- [ ] Add real screenshots to `public/work/`
