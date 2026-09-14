/**
 * Site-wide constants. Every user-facing string on the site comes from
 * `src/content/*` — components hold zero hardcoded copy, because the owner
 * edits this weekly without touching JSX (CLAUDE.md §6).
 *
 * Placeholders use the greppable `PLACEHOLDER:` convention. Run
 * `grep -rn "PLACEHOLDER:" src/content/` before launch to find every one.
 */

export type NavItem = {
  label: string;
  /** In-page anchor (`#agents`) or a route (`/blog`). */
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type SiteConfig = {
  /** The only brand name permitted anywhere on this site (§2). */
  name: string;
  tagline: string;
  description: string;
  /**
   * Single source of truth for the contact address. Every form and every CTA
   * builds its `mailto:` composer from this one constant (§7).
   */
  contactEmail: string;
  /** Canonical origin. Used for metadata once the domain is decided. */
  url: string;
  nav: NavItem[];
  /** Repeated in the footer; kept separate so the two can diverge. */
  footerNav: NavItem[];
  legalNav: NavItem[];
  social: SocialLink[];
  contact: {
    addressLines: string[];
    phone: string;
    email: string;
  };
  legalLine: string;
  /** The footer's closing invitation. Resolves to the same composer as every CTA (§7). */
  footerCta: { label: string; href: string };
  /**
   * Chrome strings: labels for controls that are not page copy but are still
   * user-facing. Kept here so a component never holds a string (§6).
   */
  ui: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    menuLabel: string;
    primaryNavLabel: string;
    themeToggle: { neutral: string; toLight: string; toDark: string };
    footerSections: string;
    footerContact: string;
    footerElsewhere: string;
    backToTop: string;
    backToWriting: string;
    readingTime: (minutes: number) => string;
  };
};

export const site: SiteConfig = {
  name: "Algomotive",
  tagline: "AI agents for enterprise finance and operations",
  description:
    "Algomotive deploys AI agents across payables, receivables, procurement and cash. They read from the systems you already run, prepare the work, and wait for a person to approve it.",

  // PLACEHOLDER: replace with the real inbox before launch
  contactEmail: "hello@algomotive.example",

  // PLACEHOLDER: replace when the domain is decided (Pages URL or custom domain)
  url: "https://ketchup-69.github.io/algo-demo",

  nav: [
    { label: "Agents", href: "#agents" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Governance", href: "#governance" },
    { label: "Blog", href: "/blog" },
  ],

  footerNav: [
    { label: "Agents", href: "#agents" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Beyond finance", href: "#beyond-finance" },
    { label: "Governance", href: "#governance" },
    { label: "Integrations", href: "#integrations" },
    { label: "Blog", href: "/blog" },
  ],

  legalNav: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],

  // PLACEHOLDER: replace every href once the owner confirms which profiles are
  // public. Labels are safe; the destinations are not real.
  social: [
    { label: "LinkedIn", href: "#" },
    { label: "X", href: "#" },
  ],

  // PLACEHOLDER: every value in this block is realistic filler, not real
  // contact detail. Replace all four before launch.
  contact: {
    addressLines: ["Office 1204, Emaar Square Building 3", "Downtown Dubai, United Arab Emirates"],
    phone: "+971 4 000 0000",
    email: "hello@algomotive.example",
  },

  // PLACEHOLDER: confirm the registered entity name and year with the owner
  legalLine: "© 2026 Algomotive. All rights reserved.",

  footerCta: { label: "Start a conversation", href: "#contact" },

  ui: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuLabel: "Menu",
    primaryNavLabel: "Primary",
    themeToggle: {
      neutral: "Switch colour theme",
      toLight: "Switch to light theme",
      toDark: "Switch to dark theme",
    },
    footerSections: "Sections",
    footerContact: "Contact",
    footerElsewhere: "Elsewhere",
    backToTop: "Back to top",
    backToWriting: "Back to writing",
    readingTime: (minutes) => `${minutes} min read`,
  },
};

/**
 * Builds the `mailto:` composer used by every CTA and by the contact form.
 * Returns null when no address is configured, so callers can fall back to a
 * copy-to-clipboard line rather than rendering a dead link (§7).
 *
 * The contact form composes through this, and so does every plain contact link.
 */
export function buildMailto(options?: {
  subject?: string;
  body?: string;
}): string | null {
  if (!site.contactEmail) return null;
  // encodeURIComponent, not URLSearchParams: the latter writes spaces as "+",
  // which mail clients show literally in the subject line.
  const params: string[] = [];
  if (options?.subject) params.push(`subject=${encodeURIComponent(options.subject)}`);
  if (options?.body) params.push(`body=${encodeURIComponent(options.body)}`);
  return `mailto:${site.contactEmail}${params.length ? `?${params.join("&")}` : ""}`;
}
