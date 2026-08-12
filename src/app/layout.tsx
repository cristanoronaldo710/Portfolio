import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { profile } from "@/content/profile";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* Display face for headings. Ships a single 400 weight — hierarchy comes from
   size and tracking, never font-weight, or the browser will synthesise a fake
   bold and wreck the letterforms. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
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
  themeColor: "#faf8f4",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full">
        {children}
        {/* Cinematic overlays sit above content but never intercept input. */}
        <div aria-hidden="true" className="grain-layer" />
        <div aria-hidden="true" className="vignette-layer" />
      </body>
    </html>
  );
}
