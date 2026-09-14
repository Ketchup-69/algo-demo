"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

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
 *
 * The same moment is when smooth anchor scrolling is switched on. With
 * `scroll-behavior: smooth` on <html> from the first paint, the browser's own
 * smooth jump to a deep link (/#contact) was cancelled mid-flight by
 * ScrollTrigger's load-time measurements and landed hundreds of pixels short.
 * Deep links now jump instantly, as the browser does on its own; clicks on
 * the nav, made after this point, glide. Not under reduced motion.
 */
export function refreshAfterFonts() {
  if (scheduled || typeof document === "undefined") return;
  scheduled = true;
  const fonts = document.fonts;
  const settle = () => {
    ScrollTrigger.refresh();
    if (!prefersReducedMotion()) {
      document.documentElement.classList.add("scroll-smooth");
    }
  };
  if (!fonts?.ready) {
    settle();
    return;
  }
  fonts.ready.then(settle);
}

/* --------------------------------------------------------------------------
   Deferred setup.

   The hero is the only motion that has to exist at first paint. Everything
   else — the section reveals, the process scene, the console, the counters —
   used to build in the same effect flush, which on a throttled phone was one
   long task standing between the visitor and the headline. Those setups now
   queue here and run once the hero has had its first frame, in an idle slot,
   each in its own short task.
   -------------------------------------------------------------------------- */
type Job = () => void;
const queue: Job[] = [];
let flushArmed = false;

function flush() {
  flushArmed = false;
  // One job per idle slot: short tasks, never one long one.
  const run = () => {
    const job = queue.shift();
    if (!job) return;
    job();
    if (queue.length) idle(run);
  };
  run();
}

function idle(cb: () => void) {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };
  if (typeof w.requestIdleCallback === "function") {
    w.requestIdleCallback(cb, { timeout: 300 });
  } else {
    w.setTimeout(cb, 0);
  }
}

/**
 * Runs `job` after the hero's first frame. Returns a cancel function for an
 * unmount that comes before the job has run.
 */
export function afterFirstFrame(job: Job): () => void {
  queue.push(job);
  if (!flushArmed) {
    flushArmed = true;
    // Two frames: the first lets the hero timeline commit its starting
    // state, the second paints it. Then the queue drains in idle time.
    requestAnimationFrame(() => requestAnimationFrame(() => idle(flush)));
  }
  return () => {
    const i = queue.indexOf(job);
    if (i >= 0) queue.splice(i, 1);
  };
}
