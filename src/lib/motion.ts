/**
 * Shared motion vocabulary.
 *
 * One set of durations, curves and distances for the whole site, so the page
 * reads as a single system rather than a collection of effects. CLAUDE.md §4
 * asks for the boldness to be spent in one place; the corollary is that
 * everything else uses the same quiet treatment, and this file is where that
 * treatment is defined.
 *
 * Three treatments exist, and every entrance on the site is one of them:
 *
 *   lines  — headings. Each line rises out of a clipped mask. The text is in
 *            the document the whole time; only the paint is deferred.
 *   fade   — body copy. Opacity only. No travel, because moving a paragraph
 *            is the "fade-and-slide-up on every section" anti-pattern.
 *   rise   — lists, rows, small blocks. Opacity plus a few pixels of travel,
 *            staggered, so a group reads as one arrival rather than N.
 */

/** Seconds. GSAP works in seconds. */
export const duration = {
  /** Button presses, focus rings. Must feel instant. */
  instant: 0.12,
  /** Theme swap, hover, small state changes. */
  quick: 0.2,
  /** Fades and rises. */
  base: 0.6,
  /** Hero beats. */
  slow: 0.8,
  /** A masked line reveal. Long, because the curve does all its work early. */
  lines: 1.1,
} as const;

/**
 * Curves. Decelerating, never overshooting: overshoot reads as playful, and
 * this audience is not here to be charmed.
 *
 *   out     — small fades and rises.
 *   reveal  — masked lines. Sharper at the start, longer settle.
 *   inOut   — anything that draws (a rail, a path).
 */
export const ease = {
  out: "power2.out",
  reveal: "power4.out",
  inOut: "power2.inOut",
} as const;

/** The reveal curve as a cubic-bezier string, for the CSS side of the system. */
export const easeCss = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Distance elements travel on entrance, in px. Deliberately small. */
export const travel = { sm: 8, base: 14, lg: 24 } as const;

/** Gaps between siblings in a staggered group, in seconds. */
export const stagger = { lines: 0.09, items: 0.07, records: 0.1 } as const;

/**
 * Where a section starts revealing, as a ScrollTrigger `start`. The section
 * top crossing 85% of the viewport height: early enough that a reader never
 * waits, late enough that the entrance is seen.
 */
export const revealStart = "top 85%";

/**
 * True when the visitor has asked for less motion, or when there is no window
 * to ask (SSR). GSAP code uses `gsap.matchMedia()` instead, which re-evaluates
 * when the preference changes mid-session and cleans up what it created; this
 * is for the few places outside GSAP (the theme wipe, the page transition).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
