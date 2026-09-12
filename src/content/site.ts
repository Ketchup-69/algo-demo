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
   * builds its `mailto:` composer from this one constant (§7). The composer
   * itself lands in Phase 3.
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
};

/**
 * Builds the `mailto:` composer used by every CTA and by the contact form.
 * Returns null when no address is configured, so callers can fall back to a
 * copy-to-clipboard line rather than rendering a dead link (§7).
 *
 * Phase 3 wires this to the form. Phase 1 only uses it for plain contact links.
 */
export function buildMailto(options?: {
  subject?: string;
  body?: string;
}): string | null {
  if (!site.contactEmail) return null;
  const params = new URLSearchParams();
  if (options?.subject) params.set("subject", options.subject);
  if (options?.body) params.set("body", options.body);
  const query = params.toString();
  return `mailto:${site.contactEmail}${query ? `?${query}` : ""}`;
}
