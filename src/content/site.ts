/**
 * Site-wide constants. Every user-facing string on the site comes from
 * `src/content/*` — components hold zero hardcoded copy, because the owner
 * edits this weekly without touching JSX (CLAUDE.md §6).
 *
 * Everything here is empty on purpose. Nothing about the company is invented;
 * real values get filled in by the owner. Placeholders are marked with the
 * greppable `PLACEHOLDER:` convention so none of them ship by accident.
 */

export type NavItem = {
  label: string;
  /** Internal path or in-page anchor. */
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type SiteConfig = {
  /** The only brand name permitted anywhere on this site (§2). */
  name: string;
  /** Short descriptor used in metadata. */
  tagline: string;
  description: string;
  /**
   * Single source of truth for the contact address. Every form and every CTA
   * builds its `mailto:` composer from this one constant (§7).
   */
  contactEmail: string;
  /** Canonical origin, used for metadata once the domain is decided. */
  url: string;
  nav: NavItem[];
  social: SocialLink[];
  /** True while any field above is still filler. */
  placeholder: boolean;
};

export const site: SiteConfig = {
  name: "Algomotive",
  // PLACEHOLDER: replace when the owner approves positioning copy
  tagline: "",
  // PLACEHOLDER: replace when the owner approves positioning copy
  description: "",
  // PLACEHOLDER: replace with the real contact address before launch
  contactEmail: "",
  // PLACEHOLDER: replace when the domain is decided (GitHub Pages or custom)
  url: "",
  // PLACEHOLDER: replace once the page sections exist to link to
  nav: [],
  // PLACEHOLDER: replace when the owner confirms which profiles are public
  social: [],
  placeholder: true,
};

/**
 * Builds the `mailto:` composer used by every CTA and by the contact form.
 * Returns null when no address is configured yet, so callers can fall back to
 * a copy-to-clipboard line rather than rendering a dead link (§7).
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
