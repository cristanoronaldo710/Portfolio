/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE — it is the only file you need to touch.
 *  Everything on the site reads from here.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "Yash More",
  /** Shown under your name in the hero. */
  role: "Full-Stack Developer",
  location: "India",
  /**
   * The email address is deliberately NOT here — it would end up in the static
   * HTML for scrapers. It lives server-side in ENQUIRY_TO_EMAIL and is only
   * revealed after someone actually submits the enquiry form.
   *
   * The WhatsApp number is public by necessity: a wa.me link can't work
   * without it.
   */
  whatsapp: {
    /** Digits only, including country code — this is what wa.me needs. */
    number: "919511283516",
    display: "+91 95112 83516",
    /** Pre-filled first message. */
    prefill: "Hi Yash — I saw your portfolio and wanted to get in touch.",
  },
  /**
   * Big statement at the top of the page. Keep it to one line if you can.
   * Supports **bold** and ==highlight== anywhere in the copy on this page.
   */
  tagline: "I build web apps that stay **fast** when the network doesn't.",
  /** One line under the tagline. Context, not a second pitch. */
  taglineSub: "Interface to database — ==one person, whole stack==.",
  /**
   * About copy. Written to sound like you without claiming anything specific
   * I couldn't verify — no invented employers, dates, or numbers. Swap in your
   * own details (the project that hooked you, the stack you actually reach for)
   * and it'll read as unmistakably yours.
   */
  about: [
    "I like following a problem **the whole way through** — from the first rough sketch of an interface down to the query that makes it fast. I started out chasing the thrill of making something appear on a screen. I stayed for the harder part: ==making it hold up once real people are using it==.",
    "Most of what I build starts small and deliberately unfinished. I'd rather **ship a narrow slice that works end to end** than polish something nobody has touched yet. Same instinct in the code: clear names over clever ones, and a real reason for every dependency.",
    "The details I care about are the ones people feel but never name — how fast a page settles, whether a form says what actually went wrong. ==Performance and accessibility aren't a final polish pass==. They're part of what makes something finished.",
    "Right now I want a team that'll **push back on my assumptions** and hand me problems slightly bigger than I'm comfortable with.",
  ],
  available: true,
  availabilityNote: "Open to full-time roles and freelance",
} as const;

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yash-more-8b9272361/" },
  { label: "GitHub", href: "https://github.com/cristanoronaldo710" },
];

/** Ready-to-use wa.me link with the greeting pre-filled. */
export const whatsappHref = `https://wa.me/${profile.whatsapp.number}?text=${encodeURIComponent(
  profile.whatsapp.prefill,
)}`;

/** Small numbers under the hero. Delete any you don't want to claim yet. */
export const stats = [
  { value: "6+", label: "Projects shipped" },
  { value: "15+", label: "Technologies" },
  { value: "2+", label: "Years building" },
];

/* ── Projects ──────────────────────────────────────────────── */

/**
 * The long-form write-up behind a project. Any project with a `caseStudy`
 * gets a "Read case study" button that opens a full-screen reader.
 */
export type CaseStudy = {
  /** One-line framing shown under the title in the reader. */
  role: string;
  /** What was wrong / what needed to exist. 1–2 paragraphs. */
  problem: string;
  /** What you actually built, and the decisions behind it. 1–2 paragraphs. */
  solution: string;
  /** Why each piece of the stack is there. */
  stack: { name: string; why: string }[];
  /** The short version, for someone skimming. */
  summary: string;
  /** What you'd keep, change, or learned. */
  conclusion: string;
  /**
   * Screenshots of the finished site. Drop files in /public/work/ and
   * reference them as "/work/name.jpg". Each renders full-width in the
   * reader; empty slots show a numbered plate until you add the real thing.
   */
  images: { src?: string; caption: string }[];
};

/** Icon key used for the themed placeholder — see ProjectVisual.tsx for the mapping. */
export type ProjectIconKey =
  | "media"
  | "focus"
  | "cafe"
  | "barber"
  | "kanban"
  | "ticket";

export type Project = {
  /** URL-safe id. Used for the case study anchor. */
  slug: string;
  title: string;
  /** Client, or "Personal project", or "Open source". */
  client: string;
  year: string;
  summary: string;
  /** Shown as small pills on the card. */
  tags: string[];
  /** Live site. Omit for no button. */
  href?: string;
  /** Source code. Omit for no button. */
  repo?: string;
  /**
   * Drop an image in /public/work/ and reference it as "/work/name.jpg".
   * Leave undefined to show a themed icon placeholder instead (see `theme`).
   */
  image?: string;
  /** Icon + accent shown in place of a real screenshot, until one exists. */
  theme?: { icon: ProjectIconKey; accent: string };
  /** Makes the card span the full width on desktop. Use for your best 1–2. */
  featured?: boolean;
  caseStudy?: CaseStudy;
};

/**
 * ⚠ AI-DRAFTED CASE STUDIES — titles are your real projects, but I only had
 * the names (from your checklist), not the actual details. Everything below
 * — problem, solution, stack choices, the numbers, the "what I'd change"
 * — is my plausible best guess from the name alone, written in your voice,
 * NOT verified fact. Treat this as a first draft to correct, not a
 * transcript of what you actually built.
 *
 * Before this goes anywhere someone might ask you about specifics (an
 * interview, a client), read each one and fix anything that isn't true —
 * the real stack, the real problem, the real trade-off you made. Same
 * `summary`/`tags`/`year` fields as before still need your input too.
 */
export const projects: Project[] = [
  {
    slug: "media-os",
    title: "Media OS",
    client: "Personal project",
    year: "20XX",
    summary:
      "A media library built on **tags and collections instead of folders** — searchable metadata, thumbnail-first browsing, one canonical asset per version.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    featured: true,
    theme: { icon: "media", accent: "#7c6fd6" },
    caseStudy: {
      role: "Design, frontend, and the media pipeline",
      problem:
        "Small teams end up with footage and assets spread across drives, chat threads, and a dozen \"FINAL_v3\" filenames. Nobody can tell which cut is actually final, and ==finding a specific clip from three months ago takes longer than reshooting it==.\n\nA folder tree assumes you already know where you put something. Most people don't.",
      solution:
        "**Tags and collections instead of folders.** Every asset gets searchable metadata at upload — project, type, status — so the same clip can live in three collections without three copies.\n\nThe browser is thumbnail-first and scrubs on hover, so you can identify a take without opening it. Version history sits on the asset itself: one canonical item, a stack of versions underneath, ==never a duplicate file with a different name==.",
      stack: [
        { name: "Next.js", why: "Server-rendered library views stay fast even paging through a few thousand thumbnails." },
        { name: "TypeScript", why: "Asset metadata has real shape — type, status, version — worth enforcing end to end." },
        { name: "PostgreSQL", why: "Tags and collections are a many-to-many relationship. That's a database problem, not a file-system one." },
        { name: "Object storage (S3-compatible)", why: "Keeps large media out of the database, behind signed URLs instead of public paths." },
        { name: "Tailwind CSS", why: "A dense, thumbnail-heavy interface needed tight spacing more than custom components." },
      ],
      summary:
        "A media library built around **tags and collections, not folders** — searchable metadata at upload, thumbnail-first browsing, and one canonical asset per version instead of a graveyard of duplicates.",
      conclusion:
        "Treating organization as the actual product — not a folder tree bolted onto storage — was the right call early, before the library filled up with content nobody could find again.\n\n==What I'd tighten next==: bulk tagging on import, since tagging one file at a time doesn't survive contact with a real shoot's worth of footage.",
      images: [
        { caption: "Library — thumbnail grid with collection filters" },
        { caption: "Asset detail — version history" },
      ],
    },
  },
  {
    slug: "neurofence",
    title: "Neurofence",
    client: "Personal project",
    year: "20XX",
    summary:
      "A focus tool built on **friction, not willpower** — commit to a session ahead of time, and the block holds regardless of how you feel five minutes in.",
    tags: ["Next.js", "TypeScript", "Browser extension"],
    featured: true,
    theme: { icon: "focus", accent: "#3f9e7a" },
    caseStudy: {
      role: "Design and frontend, focus-session logic",
      problem:
        "Most blockers are one tap away from being disabled, which means they only work on days you don't actually need them. Apps that ask ==how much willpower you have left== are asking the wrong question — by the time you're deciding whether to open the blocked app, you've already lost.",
      solution:
        "**Friction, not willpower.** A focus session is a commitment made before you need it — pick a duration and what's blocked, and it holds for that window regardless of how you feel five minutes in.\n\nThe dashboard reports where attention actually went, in plain numbers, ==not a guilt-driven streak counter==. The goal was a tool that treats discipline as a design problem, not a character flaw.",
      stack: [
        { name: "Browser extension APIs", why: "Blocking has to happen at the browser level, before a distracting page even loads." },
        { name: "Next.js", why: "The session dashboard and history live outside the extension, as a normal web app." },
        { name: "TypeScript", why: "Session state — active, blocked list, time remaining — is exactly the kind of state machine worth typing properly." },
        { name: "IndexedDB", why: "Session history needs to survive offline and sync later, with no reason to round-trip to a server for local stats." },
      ],
      summary:
        "A **commitment-device** focus blocker: sessions locked in ahead of time, plain-number attention reports instead of guilt streaks, blocking enforced at the browser level so it can't be talked out of.",
      conclusion:
        "The friction-over-willpower framing held up — the sessions people actually kept were the ones committed to in advance, not the ones with an escape hatch.\n\n==Next==: shared sessions, so a block can be a team agreement instead of a solo one.",
      images: [
        { caption: "Session start — duration and blocked list" },
        { caption: "Attention report, plain numbers" },
      ],
    },
  },
  {
    slug: "cafe-crm",
    title: "Cafe (CRM)",
    client: "Personal project",
    year: "20XX",
    summary:
      "A counter-sized CRM — order history, customer notes, and a simple points-per-order loyalty rule, built for speed during a rush.",
    tags: ["Next.js", "PostgreSQL", "Node.js"],
    theme: { icon: "cafe", accent: "#b5793a" },
    caseStudy: {
      role: "Full stack — schema, backend, and counter-facing UI",
      problem:
        "Small cafes run loyalty and regulars out of a notebook or a spreadsheet the owner half-remembers to update. There's no real answer to \"who are our regulars\" beyond a feeling — ==the data that would justify a loyalty program was never collected in the first place==.",
      solution:
        "A CRM sized for a counter, not an enterprise. Order history and customer notes live on one screen, and the loyalty layer is a simple points-per-order rule rather than a configurable rules engine nobody at a five-person cafe needed.\n\nThe staff-facing UI stays **deliberately minimal** — big touch targets, one screen per task — because it has to work fast during a rush, not look impressive in a demo.",
      stack: [
        { name: "Next.js", why: "One app for the counter view and the owner's reporting view, sharing the same data layer." },
        { name: "PostgreSQL", why: "Orders, customers and loyalty points are relational, with running totals that need to stay correct." },
        { name: "Node.js / Express", why: "A small, boring API layer — this didn't need more than CRUD plus one loyalty-points rule." },
        { name: "Tailwind CSS", why: "Fast to hit large, thumb-friendly touch targets for a screen that lives next to a till." },
      ],
      summary:
        "A **counter-sized CRM** for a small cafe — order history, customer notes, and a simple points-per-order loyalty rule, built for speed during a rush rather than configurability nobody needed.",
      conclusion:
        "Keeping the loyalty logic to one simple rule instead of a rules engine was the right trade — it shipped fast and the owner could explain it to a new hire in one sentence.\n\n==What I'd add==: a lightweight low-stock nudge, since inventory kept coming up as the next thing owners wanted to track.",
      images: [
        { caption: "Counter view — order entry and customer lookup" },
        { caption: "Owner dashboard — regulars and loyalty points" },
      ],
    },
  },
  {
    slug: "barber-shop",
    title: "Barber Shop",
    client: "Personal project",
    year: "20XX",
    summary:
      "A real-time booking calendar shared between online bookings and walk-ins, with SMS reminders cutting no-shows.",
    tags: ["Next.js", "PostgreSQL", "Twilio"],
    theme: { icon: "barber", accent: "#3a4a5c" },
    caseStudy: {
      role: "Full stack — booking logic and calendar UI",
      problem:
        "Walk-ins and online bookings collide constantly without a shared source of truth — a barber double-booked on paper looks fine right up until two clients arrive at once. ==No-shows are expensive, and nobody was tracking those either==.",
      solution:
        "One real-time calendar per barber, so an online booking instantly blocks that slot for walk-ins too. Clients get a reminder before their appointment, and **no-show history quietly informs which slots get held with a deposit** versus booked freely.\n\nThe booking flow is three taps — service, barber, time — because a client comparing five barbershop apps at 11pm will bounce off anything longer.",
      stack: [
        { name: "Next.js", why: "Booking pages need to be fast on mobile — most bookings happen on a phone, one-handed." },
        { name: "PostgreSQL", why: "Availability is a real scheduling problem — overlapping slots and per-barber calendars need actual constraints." },
        { name: "Node.js", why: "Reminder scheduling runs as background jobs, decoupled from the request that created the booking." },
        { name: "Twilio (SMS)", why: "Email reminders get ignored; a text the morning of an appointment is what actually cuts no-shows." },
      ],
      summary:
        "A **real-time booking calendar** shared between online bookings and walk-ins, with SMS reminders and no-show history informing which slots need a deposit.",
      conclusion:
        "Making walk-ins and online bookings share one calendar — instead of two systems someone has to reconcile by hand — was the decision that actually stopped double-bookings.\n\n==Next==: letting a client rebook their usual barber and slot in two taps, since that's most of what a regular actually wants.",
      images: [
        { caption: "Booking flow — service, barber, time" },
        { caption: "Barber's day view" },
      ],
    },
  },
  {
    slug: "jira-clone",
    title: "Jira Clone",
    client: "Personal project",
    year: "20XX",
    summary:
      "A kanban clone built to learn the **relational model** underneath a real project-management tool, not just the drag-and-drop.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    theme: { icon: "kanban", accent: "#3b7dd8" },
    caseStudy: {
      role: "Full stack — learning project",
      problem:
        "Understanding how a real project-management tool models its data — boards, sprints, issue types — is faster to learn by building one than by reading about one. ==Most tutorials stop at a kanban board with three columns==; the interesting part is everything underneath it.",
      solution:
        "A kanban board with drag-and-drop, issue types, and sprints, but the actual point was **getting the relational model right** — issues belong to epics, epics belong to sprints, and moving a card is a tracked status change, not just a DOM reorder.\n\nFeature breadth was deliberately capped so the data layer could be correct rather than wide.",
      stack: [
        { name: "Next.js", why: "Board and backlog views share the same issue data without a separate API layer to keep in sync." },
        { name: "TypeScript", why: "Issue → epic → sprint relationships are easy to get subtly wrong without types." },
        { name: "PostgreSQL", why: "A real relational schema for issues, epics and sprints — the part actual PM tools get right and tutorials skip." },
        { name: "dnd-kit", why: "Drag-and-drop that persists a real status change, not a visual reorder that resets on refresh." },
      ],
      summary:
        "A kanban clone built to **learn the data model**, not just the drag-and-drop — issues, epics and sprints as a real relational schema, with status changes tracked as history.",
      conclusion:
        "Capping the feature list early was the right call — a correct three-column board taught more than a half-working ten-column one would have.\n\n==Learning project, labelled honestly==: it clones the mechanics, not the years of edge cases the real thing has actually solved.",
      images: [
        { caption: "Board — drag-and-drop issue status" },
        { caption: "Backlog — issues grouped by epic" },
      ],
    },
  },
  {
    slug: "itsm",
    title: "ITSM",
    client: "Personal project",
    year: "20XX",
    summary:
      "A lightweight IT service-management tool — four-state ticket lifecycle, SLA timers that actually escalate, sized for a small team.",
    tags: ["Next.js", "PostgreSQL", "Node.js"],
    theme: { icon: "ticket", accent: "#6b7280" },
    caseStudy: {
      role: "Full stack — ticketing and SLA logic",
      problem:
        "Enterprise ITSM tools are built for organizations with a dedicated admin to configure them. A small IT team just wants ==a ticket queue that doesn't require a training session to use==.",
      solution:
        "A ticket lifecycle kept to four states — open, in progress, resolved, closed — with **SLA timers that actually escalate** instead of displaying a countdown nobody checks. A minimal knowledge base sits next to the queue so common fixes get linked instead of re-typed.\n\nRole-based access is two roles, not twelve, because that's what a small team actually has.",
      stack: [
        { name: "Next.js", why: "The ticket queue and knowledge base share one app, so linking an article to a ticket is one lookup, not a context switch." },
        { name: "PostgreSQL", why: "SLA timers and escalation rules need reliable, queryable timestamps — not something to fake client-side." },
        { name: "Node.js", why: "A background job checks SLA breaches on a schedule and fires escalations independently of anyone having the app open." },
        { name: "Role-based access (custom)", why: "Two roles — requester and agent — covers what a small team needs without a permissions system to maintain." },
      ],
      summary:
        "A **lightweight ITSM** — four-state ticket lifecycle, SLA timers that actually escalate, and a knowledge base linked directly into tickets, sized for a small IT team instead of an enterprise one.",
      conclusion:
        "Keeping SLA escalation server-driven rather than a client-side countdown was the detail that made it trustworthy — a timer nobody enforces is just decoration.\n\n==Next==: auto-suggesting a knowledge-base article from the ticket's text, since most tickets turn out to repeat the same handful of fixes.",
      images: [
        { caption: "Ticket queue with SLA status" },
        { caption: "Ticket detail — linked knowledge base article" },
      ],
    },
  },
];

/* ── Tech stack wall ───────────────────────────────────────── */

export type Tech = {
  name: string;
  /** A devicon class — browse them at https://devicon.dev */
  icon: string;
  /** Brand colour revealed on hover. Tuned to stay legible on the dark panel. */
  color: string;
};

export const techStack: { group: string; items: Tech[] }[] = [
  {
    group: "Frontend",
    items: [
      { name: "HTML5", icon: "devicon-html5-plain", color: "#e54d26" },
      { name: "CSS3", icon: "devicon-css3-plain", color: "#3d8fc6" },
      { name: "JavaScript", icon: "devicon-javascript-plain", color: "#f0db4f" },
      { name: "TypeScript", icon: "devicon-typescript-plain", color: "#3178c6" },
      { name: "React", icon: "devicon-react-original", color: "#61dafb" },
      { name: "Next.js", icon: "devicon-nextjs-plain", color: "#ffffff" },
      { name: "Tailwind CSS", icon: "devicon-tailwindcss-original", color: "#38bdf8" },
      { name: "Redux", icon: "devicon-redux-original", color: "#a67ee8" },
      { name: "Sass", icon: "devicon-sass-original", color: "#cc6699" },
      { name: "Vite", icon: "devicon-vitejs-plain", color: "#ffdd35" },
    ],
  },
  {
    group: "Backend",
    items: [
      { name: "Node.js", icon: "devicon-nodejs-plain", color: "#5fa04e" },
      { name: "Express", icon: "devicon-express-original", color: "#ffffff" },
      { name: "Python", icon: "devicon-python-plain", color: "#ffd845" },
      { name: "Django", icon: "devicon-django-plain", color: "#44b78b" },
      { name: "Flask", icon: "devicon-flask-original", color: "#ffffff" },
      { name: "Java", icon: "devicon-java-plain", color: "#ea2d2e" },
      { name: "Spring", icon: "devicon-spring-original", color: "#5fb832" },
      { name: "PHP", icon: "devicon-php-plain", color: "#9ba3e0" },
      { name: "GraphQL", icon: "devicon-graphql-plain", color: "#e434aa" },
      { name: "Socket.IO", icon: "devicon-socketio-original", color: "#ffffff" },
    ],
  },
  {
    group: "Data",
    items: [
      { name: "MongoDB", icon: "devicon-mongodb-plain", color: "#4faa41" },
      { name: "PostgreSQL", icon: "devicon-postgresql-plain", color: "#6c9fd1" },
      { name: "MySQL", icon: "devicon-mysql-original", color: "#4479a1" },
      { name: "Redis", icon: "devicon-redis-plain", color: "#e8503a" },
      { name: "Firebase", icon: "devicon-firebase-plain", color: "#ffa000" },
      { name: "Supabase", icon: "devicon-supabase-plain", color: "#3ecf8e" },
      { name: "Prisma", icon: "devicon-prisma-original", color: "#8ea6c8" },
    ],
  },
  {
    group: "Tooling & Infra",
    items: [
      { name: "Git", icon: "devicon-git-plain", color: "#f34f29" },
      { name: "GitHub", icon: "devicon-github-original", color: "#ffffff" },
      { name: "Docker", icon: "devicon-docker-plain", color: "#019bc6" },
      { name: "Kubernetes", icon: "devicon-kubernetes-plain", color: "#326ce5" },
      { name: "AWS", icon: "devicon-amazonwebservices-plain-wordmark", color: "#ff9900" },
      { name: "Vercel", icon: "devicon-vercel-original", color: "#ffffff" },
      { name: "Nginx", icon: "devicon-nginx-original", color: "#00b74a" },
      { name: "Linux", icon: "devicon-linux-plain", color: "#ffffff" },
      { name: "Jest", icon: "devicon-jest-plain", color: "#c2557a" },
      { name: "Postman", icon: "devicon-postman-plain", color: "#f37036" },
      { name: "Figma", icon: "devicon-figma-plain", color: "#f24e1e" },
    ],
  },
];

/* ── Background ────────────────────────────────────────────── */

export type ExperienceEntry = {
  role: string;
  org: string;
  period: string;
  description?: string;
};

export const experience: ExperienceEntry[] = [
  {
    // LinkedIn's role title says "Python Developer"; the description on the
    // same entry says "Full-Stack Developer" — kept both as literally shown.
    // Worth reconciling on LinkedIn if one is stale.
    role: "Python Developer",
    org: "Vyatirikht · Freelance",
    period: "Jan 2025 — Present",
    description:
      "Full-stack developer role — designing, developing and maintaining web applications and digital products across frontend and backend systems.",
  },
  {
    role: "Python Developer",
    org: "Heuristic Technopark Pvt Ltd · Internship",
    period: "Jan 2023 — Apr 2023",
    description: "Python, Django, and related backend work.",
  },
];

export type EducationEntry = {
  degree: string;
  school: string;
  period: string;
  detail?: string;
};

/**
 * ⚠ STILL PLACEHOLDER — degree confirmed (BCA), but school and dates are not.
 * LinkedIn requires a login, so these couldn't be read automatically — fill
 * in `school` and `period` (and `detail` if you want a grade/specialisation).
 */
export const education: EducationEntry[] = [
  {
    degree: "Bachelor of Computer Application (BCA)",
    school: "Your college or university",
    period: "20XX — 20XX",
  },
  {
    degree: "Higher Secondary / Class XII",
    school: "Your school",
    period: "20XX — 20XX",
  },
];

export type Certification = {
  name: string;
  issuer: string;
  /** e.g. "Mar 2025" */
  date: string;
  /** Optional link to the credential. */
  href?: string;
  /** Optional credential ID. */
  credentialId?: string;
};

export const certifications: Certification[] = [
  {
    name: "Junior Cybersecurity Analyst Career Path",
    issuer: "Cisco",
    date: "Sep 2025",
  },
  {
    name: "AI Aware Badge - AI For All",
    issuer: "United Latino Students Association",
    date: "Sep 2025",
    // Shown on LinkedIn as this literal string, not a normal-looking ID —
    // worth checking the badge issuer's page in case it's a display bug.
    credentialId: "U2FsdGVkX1p1L2u3SyoOs1L2a3S4h6GTiys1L2a3S4hyA4q1iYwkxnys1L2a3S4huDomBQqrYe1Q2uAl",
  },
  {
    name: "Certificate of Attendance",
    issuer: "Hacker School (a subsidiary of Cartel Software Pvt. Ltd.)",
    date: "Feb 2025",
    credentialId: "743544",
  },
  {
    // Title/issuer as entered on LinkedIn — likely swapped by mistake there
    // (reads like "Hacking School, a unit of One Byte Labs"). Fix on
    // LinkedIn and here if so.
    name: "A unit of one byte labs",
    issuer: "Hacking School",
    date: "Aug 2025",
  },
  {
    name: "Machine Learning I",
    issuer: "Columbia+",
    date: "Aug 2025",
    href: "https://badges.plus.columbia.edu/d12c69f8-e206-470e-97c8-91cecf0e1bef",
    credentialId: "159358790",
  },
  {
    name: "Deloitte Australia - Cyber Job Simulation",
    issuer: "Forage",
    date: "Feb 2025",
    href: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/9PBTqmSxAf6zZTseP/E9pA6qsdbeyEkp3ti_9PBTqmSxAf6zZTseP_S5ztc9auXn8crnnLv_1740171237739_completion_certificate.pdf",
    credentialId: "WByXrdxBKPJwCJ9bi",
  },
  {
    name: "Tata Group - Cybersecurity Analyst Job Simulation",
    issuer: "Forage",
    date: "Dec 2024",
    href: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/ifobHAoMjQs9s6bKS/gmf3ypEXBj2wvfQWC_ifobHAoMjQs9s6bKS_S5ztc9auXn8crnnLv_1735122467964_completion_certificate.pdf",
    credentialId: "pHqcGBkFhTQRh7pDc",
  },
];
