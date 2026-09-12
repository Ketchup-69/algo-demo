import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { ThemeScript } from "@/components/ui";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  // PLACEHOLDER: description comes from src/content/site.ts once approved
  description: site.description || undefined,
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
  openGraph: {
    title: site.name,
    description: site.description,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The theme script writes `data-theme` onto <html> before React hydrates,
    // so the server markup and the live DOM legitimately differ here.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col bg-bg font-body text-fg">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-fg focus:outline-2 focus:outline-offset-2 focus:outline-ring"
        >
          Skip to content
        </a>
        {children}
        {/* Analytics slot — intentionally empty in v1 (CLAUDE.md §3).
            <script src="..." defer></script> */}
      </body>
    </html>
  );
}
