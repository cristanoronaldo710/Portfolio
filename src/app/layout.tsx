import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { profile } from "@/content/profile";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/* Plain-text description for search results and link previews — strip the
   **bold** / ==highlight== markers the on-page copy uses. */
const description = `${profile.tagline} ${profile.taglineSub}`.replace(
  /\*\*|==/g,
  "",
);

const title = `${profile.name} — ${profile.role}`;

export const metadata: Metadata = {
  /* Set NEXT_PUBLIC_SITE_URL in your host's env once you have a domain;
     without it, Open Graph image paths stay relative and previews break. */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title,
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    type: "website",
    siteName: profile.name,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#121316" },
  ],
  colorScheme: "dark light",
};

/* Sets data-theme before first paint so there's no flash of the wrong
   theme. Dark is the CSS default (no attribute needed), so this only has
   to act when the visitor previously chose light — the common case does
   nothing. A plain synchronous <script>, not type="module" or defer, so it
   runs during HTML parsing, before the body paints. */
const themeInitScript = `
try {
  if (localStorage.getItem("theme") === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  }
} catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full">
        {children}
        {/* Cinematic overlays sit above content but never intercept input. */}
        <div aria-hidden="true" className="grain-layer" />
        <div aria-hidden="true" className="vignette-layer" />
      </body>
    </html>
  );
}
