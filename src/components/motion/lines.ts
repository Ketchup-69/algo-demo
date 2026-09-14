"use client";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { duration, ease, stagger } from "@/lib/motion";

gsap.registerPlugin(SplitText);

/**
 * The masked line reveal, shared by the hero and every section heading.
 *
 * SplitText divides the heading into its rendered lines, wraps each in a
 * clipping mask, and the line rises out of the mask. Three properties of the
 * way it is set up are load-bearing:
 *
 *   - `autoSplit` re-splits when the fonts finish loading or the element
 *     resizes, and re-runs `onSplit`. Because the animation is RETURNED from
 *     `onSplit`, SplitText reverts it before re-splitting and rebuilds it at
 *     the same progress — a heading that has already revealed stays revealed
 *     through a resize, and a late font swap does not leave lines split
 *     against the wrong metrics.
 *   - `aria: "auto"` puts the original text on the heading as an aria-label
 *     and hides the fragments, so a screen reader hears one heading, not a
 *     list of lines.
 *   - `linesClass: "rl"` is what globals.css styles to keep descenders clear
 *     of the mask edge.
 *
 * The text is in the static HTML the whole time. Only its paint is deferred,
 * which is the line CLAUDE.md §5 draws.
 */
export function revealLines(
  target: Element,
  build: (lines: Element[]) => gsap.core.Tween | gsap.core.Timeline,
): SplitText {
  return SplitText.create(target, {
    type: "lines",
    mask: "lines",
    linesClass: "rl",
    autoSplit: true,
    aria: "auto",
    onSplit: (self) => build(self.lines),
  });
}

/** The standard tween for a set of lines. */
export function linesFrom(
  lines: Element[],
  vars: gsap.TweenVars = {},
): gsap.core.Tween {
  return gsap.from(lines, {
    yPercent: 110,
    duration: duration.lines,
    ease: ease.reveal,
    stagger: stagger.lines,
    ...vars,
  });
}
