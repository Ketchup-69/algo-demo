/**
 * Shared motion vocabulary.
 *
 * One set of durations and curves for the whole site, so the page reads as a
 * single system rather than a collection of effects. CLAUDE.md §4 asks for the
 * boldness to be spent in one place; the corollary is that everything else uses
 * the same quiet treatment.
 */

/** Seconds. GSAP works in seconds; Framer Motion also accepts them. */
export const duration = {
  /** Button presses, focus rings — must feel instant. */
  instant: 0.12,
  /** Theme swap, hover, small state changes. */
  quick: 0.2,
  /** Section entrances, menu. */
  base: 0.5,
  /** Hero beats. */
  slow: 0.7,
} as const;

/**
 * A single easing curve for entrances. Decelerating, no overshoot — overshoot
 * reads as playful, and this audience is not here to be charmed.
 */
export const ease = {
  out: "power2.out",
  inOut: "power2.inOut",
} as const;

/** The same curve as a cubic-bezier array, for Framer Motion. */
export const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

/** Distance elements travel on entrance. Deliberately small. */
export const travel = { sm: 8, base: 14 } as const;

/**
 * True when the visitor has asked for less motion, or when there is no window
 * to ask (SSR).
 *
 * Note this is only a convenience for Framer Motion components. GSAP code uses
 * `gsap.matchMedia()` instead, which re-evaluates when the preference changes
 * mid-session and cleans up the animations it created.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
