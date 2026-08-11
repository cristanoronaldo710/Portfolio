/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE — it is the only file you need to touch.
 *  Everything on the site reads from here.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "Yash More",
  /** Shown under your name in the hero. Keep it to a few words. */
  role: "Designer",
  location: "India",
  email: "hello@example.com",
  /** Big statement at the top of the page. One or two sentences. */
  tagline:
    "I design clear, considered interfaces — and the systems that keep them consistent.",
  /** 2–3 short paragraphs for the About section. */
  about: [
    "Write a short paragraph about how you got into design, what you care about, and the kind of problems you like working on.",
    "A second paragraph works well for how you work — your process, the tools you reach for, or the type of team you do your best work with.",
  ],
  available: true,
  availabilityNote: "Open to freelance and full-time roles",
} as const;

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yash-more-8b9272361/" },
  { label: "Email", href: "mailto:hello@example.com" },
  // { label: "Behance",   href: "https://behance.net/..." },
  // { label: "Dribbble",  href: "https://dribbble.com/..." },
  // { label: "Instagram", href: "https://instagram.com/..." },
];

export type Project = {
  title: string;
  /** Client, or "Personal project", or "Concept". */
  client: string;
  year: string;
  /** One line — what it was and what you did. */
  summary: string;
  /** Shown as small pills on the card. */
  tags: string[];
  /** Optional external link. Omit or leave "" to render a non-clickable card. */
  href?: string;
  /**
   * Drop an image in /public/work/ and reference it as "/work/name.jpg".
   * Leave undefined to show a clean typographic placeholder instead.
   */
  image?: string;
  /** Makes the card span two columns on desktop. Use for 1–2 best pieces. */
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "Project One",
    client: "Client name",
    year: "2025",
    summary:
      "One sentence on the problem, and one on what you made. Specific beats clever.",
    tags: ["Brand identity", "Art direction"],
    featured: true,
  },
  {
    title: "Project Two",
    client: "Personal project",
    year: "2025",
    summary: "What it is, and the one decision you're proudest of.",
    tags: ["UI design", "Figma"],
  },
  {
    title: "Project Three",
    client: "Client name",
    year: "2024",
    summary: "Keep these to a single line so the grid stays even.",
    tags: ["Web design", "Prototyping"],
  },
  {
    title: "Project Four",
    client: "Concept",
    year: "2024",
    summary: "Concept work counts — label it honestly and it still earns its place.",
    tags: ["Illustration"],
  },
];

export const capabilities = [
  {
    title: "Brand & Identity",
    description:
      "Logos, type systems, colour, and the guidelines that keep it all coherent.",
  },
  {
    title: "Product & UI",
    description:
      "Interfaces, design systems, and prototypes that survive contact with engineering.",
  },
  {
    title: "Art Direction",
    description:
      "Visual language across campaigns, photography, and social.",
  },
];

export const tools = [
  "Figma",
  "Adobe Illustrator",
  "Adobe Photoshop",
  "After Effects",
  "Blender",
  "Webflow",
];

export type ExperienceEntry = {
  role: string;
  org: string;
  period: string;
  description?: string;
};

export const experience: ExperienceEntry[] = [
  {
    role: "Your role",
    org: "Company or studio",
    period: "2024 — Present",
    description: "One line on scope and what you shipped.",
  },
  {
    role: "Earlier role",
    org: "Company or studio",
    period: "2023 — 2024",
  },
];

export const education: ExperienceEntry[] = [
  {
    role: "Your degree",
    org: "Your university",
    period: "2021 — 2025",
  },
];
