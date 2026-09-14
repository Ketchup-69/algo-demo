"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";

let scheduled = false;

/**
 * One ScrollTrigger refresh for the whole page, after the fonts have landed.
 *
 * Every section used to call `ScrollTrigger.refresh()` as it mounted, which
 * on a page of twelve sections is twelve full recomputations of every trigger
 * — each one a forced layout — before the visitor has scrolled a pixel.
 * ScrollTrigger already refreshes itself on load and resize; the one event it
 * cannot see is a late font swap moving every heading, so that is the one
 * refresh this schedules, once, no matter how many sections ask.
 */
export function refreshAfterFonts() {
  if (scheduled || typeof document === "undefined") return;
  scheduled = true;
  const fonts = document.fonts;
  if (!fonts?.ready) return;
  fonts.ready.then(() => ScrollTrigger.refresh());
}
