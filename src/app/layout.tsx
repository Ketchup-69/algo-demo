import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { ThemeScript } from "@/components/ui";
import { Nav, Footer } from "@/components/layout";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.name}: ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  // PLACEHOLDER: description comes from src/content/site.ts once approved
  description: site.description || undefined,
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
  openGraph: {
    title: site.name,
    description: site.description,
    siteName: site.name,
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

/**
 * Structured data for search and assistant crawlers: who this is, where it
 * lives, how to reach it. Every value comes from src/content/site.ts, so the
 * placeholders there are the placeholders here. Social profiles are listed
 * only once they point somewhere real.
 */
function jsonLd() {
  const sameAs = site.social.map((s) => s.href).filter((h) => h.startsWith("http"));
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.contactEmail,
    ...(sameAs.length ? { sameAs } : {}),
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
  };
  return JSON.stringify([organization, website]);
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The theme script writes `data-theme` onto <html> before React hydrates,
    // so the server markup and the live DOM legitimately differ here.
    <html
      lang="en"
      id="top"
      suppressHydrationWarning
      className={`${fontVariables} h-full scroll-smooth antialiased motion-reduce:scroll-auto`}
    >
      <head>
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd() }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-bg font-body text-fg">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-fg focus:outline-2 focus:outline-offset-2 focus:outline-ring"
        >
          {site.ui.skipToContent}
        </a>
        <Nav />
        {children}
        <Footer />
        {/* Analytics slot — intentionally empty in v1 (CLAUDE.md §3).
            <script src="..." defer></script> */}
      </body>
    </html>
  );
}
