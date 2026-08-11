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
  { label: "GitHub", href: "https://github.com/" },
];

/** Ready-to-use wa.me link with the greeting pre-filled. */
export const whatsappHref = `https://wa.me/${profile.whatsapp.number}?text=${encodeURIComponent(
  profile.whatsapp.prefill,
)}`;

/** Small numbers under the hero. Delete any you don't want to claim yet. */
export const stats = [
  { value: "10+", label: "Projects shipped" },
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
   * Leave undefined to show a clean typographic placeholder instead.
   */
  image?: string;
  /** Makes the card span the full width on desktop. Use for your best 1–2. */
  featured?: boolean;
  caseStudy?: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: "commerce-platform",
    title: "Commerce Platform",
    client: "Personal project",
    year: "2025",
    summary:
      "Storefront and admin dashboard sharing **one type-safe schema**, built to stay quick on a mid-range phone.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    featured: true,
    caseStudy: {
      role: "Design, frontend, API and schema",
      problem:
        "Storefront templates look fine in a desktop demo and fall apart in the real world: **several hundred kilobytes of JavaScript** before a single product appears, and an admin panel bolted on as a separate app with duplicated types.\n\nThe moment those two drift, ==orders start failing in ways nobody notices until a customer complains==.",
      solution:
        "One repo, one schema, two surfaces. The database schema is the **single source of truth** — Prisma generates the types, both surfaces import the same ones. A column rename becomes a compile error, not a 2am bug.\n\nThe catalogue renders on the server and ships ==almost no JavaScript==; only the cart and filters hydrate. The admin side takes the opposite trade — it's behind a login, nobody's bouncing off it, so it loads a heavier bundle for a better editing experience.",
      stack: [
        { name: "Next.js", why: "Server rendering for the catalogue, so the first paint carries real content instead of a spinner." },
        { name: "TypeScript", why: "The schema-to-UI type chain is the whole point — it is what stops the two surfaces drifting apart." },
        { name: "PostgreSQL", why: "Orders and inventory are relational and need real transactions. This was never a document-store problem." },
        { name: "Prisma", why: "Generates types from the schema and makes migrations reviewable in a pull request." },
        { name: "Tailwind CSS", why: "Keeps styling next to the markup, so deleting a component deletes its CSS too." },
      ],
      summary:
        "Storefront and admin dashboard on **one type-safe data layer**. The catalogue is server-rendered and nearly JavaScript-free; the admin panel trades bundle size for editing comfort, because its users are already committed.",
      conclusion:
        "The single-schema decision paid for itself **the first time I renamed a field** and got a compile error instead of a broken checkout.\n\nWhat I'd change: I reached for a state library on the cart before I had a problem that needed one, then replaced it with a reducer and context in noticeably less code. ==Next time I'd let the pain arrive first==.",
      images: [
        { caption: "Storefront — catalogue with filters applied" },
        { caption: "Product detail, mobile" },
        { caption: "Admin dashboard — order queue" },
      ],
    },
  },
  {
    slug: "realtime-collab",
    title: "Realtime Collaboration Tool",
    client: "Personal project",
    year: "2024",
    summary:
      "A shared board several people edit at once — where **going offline mid-edit is a normal event**, not an error.",
    tags: ["React", "Node.js", "Socket.IO", "Redis", "MongoDB"],
    featured: true,
    caseStudy: {
      role: "Full stack — realtime sync, persistence, and UI",
      problem:
        "Collaborative editing is easy until two people touch the same thing at once. **Last write wins** feels fine with one tester and loses work the moment there are two.\n\nThe harder half is the network. Connections drop in lifts, on trains, on hotel wifi. ==A collaboration tool nobody trusts is worse than a text file==.",
      solution:
        "Edits are modelled as **intent, not snapshots** — \"move this card here\", never \"here is the whole board\". Each operation carries a client id and sequence number, so the server orders them deterministically and drops duplicates on reconnect.\n\nThe client applies changes optimistically and keeps an unacknowledged queue. ==Lose the connection and editing just keeps working==; reconnect and the queue replays against the authoritative order.\n\nRedis holds hot state and the pub/sub channel that fans changes across server instances. MongoDB stores durable history. The UI stays honest about it — live cursors with names, and an indicator that says **reconnecting** rather than pretending.",
      stack: [
        { name: "Socket.IO", why: "Handles reconnection and transport fallback, which is most of what makes realtime painful to write by hand." },
        { name: "Redis", why: "Hot state plus pub/sub, so multiple server instances stay in sync without talking to each other directly." },
        { name: "MongoDB", why: "Boards are deeply nested documents read as a whole. Forcing that into tables would have been fighting the shape of the data." },
        { name: "Node.js", why: "One language across client and server for the operation types, which are the trickiest part to keep aligned." },
        { name: "React", why: "The board is a pure function of board state — a good fit for optimistic updates and rollback." },
      ],
      summary:
        "A multiplayer board with optimistic local edits, an operation queue that **survives disconnection**, and Redis pub/sub so it scales past one server process.",
      conclusion:
        "Modelling edits as intent rather than snapshots was the decision everything rested on — it turned conflict resolution into **a sorting problem instead of a guessing game**.\n\nI under-estimated the UI work: showing people what the system is doing during a reconnect took as long as the sync logic, and ==mattered just as much==. If I rebuilt it I'd reach for an established CRDT library, now that I understand what it's actually doing.",
      images: [
        { caption: "Board with three collaborators and live cursors" },
        { caption: "Reconnection state — queued edits held locally" },
      ],
    },
  },
  {
    slug: "project-three",
    title: "Project Three",
    client: "Open source",
    year: "2024",
    summary: "Keep these to a line or two so the grid stays even.",
    tags: ["Python", "Django"],
  },
  {
    slug: "project-four",
    title: "Project Four",
    client: "Personal project",
    year: "2024",
    summary: "Learning projects count — label them honestly and they still earn a place.",
    tags: ["React", "Firebase"],
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
    role: "Your role",
    org: "Company name",
    period: "2024 — Present",
    description: "One line on scope and what you shipped.",
  },
  {
    role: "Earlier role",
    org: "Company name",
    period: "2023 — 2024",
  },
];

export type EducationEntry = {
  degree: string;
  school: string;
  period: string;
  detail?: string;
};

/**
 * ⚠ PLACEHOLDER — replace with your real education from LinkedIn.
 * LinkedIn requires a login, so these could not be read automatically.
 */
export const education: EducationEntry[] = [
  {
    degree: "Your degree — e.g. B.Tech, Computer Science",
    school: "Your college or university",
    period: "2021 — 2025",
    detail: "Optional: grade, specialisation, or a notable achievement.",
  },
  {
    degree: "Higher Secondary / Class XII",
    school: "Your school",
    period: "2019 — 2021",
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

/**
 * ⚠ PLACEHOLDER — replace with your real certifications from LinkedIn.
 * LinkedIn requires a login, so these could not be read automatically.
 */
export const certifications: Certification[] = [
  {
    name: "Certification name",
    issuer: "Issuing organisation",
    date: "2025",
    href: "https://example.com/credential",
    credentialId: "ABC123",
  },
  {
    name: "Another certification",
    issuer: "Issuing organisation",
    date: "2024",
  },
  {
    name: "A third certification",
    issuer: "Issuing organisation",
    date: "2024",
  },
];
