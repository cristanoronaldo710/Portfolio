import { profile } from "@/content/profile";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6 sm:px-8"
        >
          <a
            href="#main"
            className="font-display text-[15px] font-semibold tracking-tight text-ink"
          >
            {profile.name}
          </a>

          {/* Full nav from 640px up; below that a single Contact action keeps
              the bar from overflowing on a 375px screen. */}
          <ul className="hidden items-center gap-1 sm:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-11 cursor-pointer items-center rounded-full px-3 text-sm text-ink-muted transition-colors duration-200 hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-ink px-5 text-sm font-medium text-paper transition-opacity duration-200 hover:opacity-85 sm:hidden"
          >
            Contact
          </a>
        </nav>
      </header>
    </>
  );
}
