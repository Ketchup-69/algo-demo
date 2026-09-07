import { Geist, Inter } from "next/font/google";

/**
 * Every font in the site is declared here and nowhere else.
 *
 * The pairing is interim — CLAUDE.md §4 expects it to be swapped when the
 * brand book lands. Swapping means editing the two loaders below; nothing
 * else in the codebase names a typeface, because components only ever reach
 * for the `font-display` / `font-body` Tailwind utilities, which resolve
 * through the CSS variables these expose.
 *
 * Google Sans / Product Sans are proprietary and must never appear (§2).
 */

/** Headings and anything at display scale. */
export const displayFont = Geist({
  variable: "--font-algo-display",
  subsets: ["latin"],
  display: "swap",
  // Only the weights the type scale actually uses — every extra weight is
  // another file on the critical path.
  weight: ["400", "500", "600", "700"],
});

/** Body copy, UI labels, everything that is read rather than scanned. */
export const bodyFont = Inter({
  variable: "--font-algo-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

/** Convenience for the root layout — applies both variables in one place. */
export const fontVariables = `${displayFont.variable} ${bodyFont.variable}`;
