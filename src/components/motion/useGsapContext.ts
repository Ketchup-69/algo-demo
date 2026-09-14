"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { afterFirstFrame } from "./refresh";

/**
 * Runs GSAP setup inside a `gsap.context()` scoped to a container, and reverts
 * it on unmount.
 *
 * `context.revert()` kills every tween, timeline and ScrollTrigger created
 * inside the callback and restores the inline styles GSAP wrote. That is what
 * satisfies CLAUDE.md §5's "kill every ScrollTrigger on unmount. No memory
 * leaks" — without it, a route change leaves ScrollTriggers listening against
 * detached DOM nodes.
 *
 * `defer` runs the setup after the hero's first frame instead of in the mount
 * effect (see refresh.ts). Everything below the fold uses it, so the hero is
 * the only motion on the critical path. The context is created at mount
 * either way and the deferred setup is added into it, so revert-on-unmount
 * covers both timings; an unmount before the setup has run cancels it.
 *
 * The setup callback is captured ONCE, at mount, and never re-read. Two
 * consequences worth knowing:
 *
 *   - Callers pass an inline arrow function without having to memoise it, and
 *     the animation is not rebuilt on every parent render.
 *   - The callback therefore closes over its first-render values. Every setup
 *     on this site is static — it reads the DOM inside its own scope and
 *     nothing else — so that is correct here. A setup that needs to react to
 *     changing props wants a different hook, not a dependency added to this one.
 */
export function useGsapContext<T extends HTMLElement>(
  /** Receives the GSAP context and the scoped container element. */
  setup: (context: gsap.Context, element: T) => void,
  options: { defer?: boolean } = {},
): RefObject<T | null> {
  const scope = useRef<T | null>(null);
  // Initialised once; deliberately never reassigned (writing a ref during
  // render is a bug, and the value does not need to change).
  const setupRef = useRef(setup);
  const deferRef = useRef(options.defer ?? false);

  useEffect(() => {
    if (!scope.current) return;
    const element = scope.current;
    const ctx = gsap.context(() => {}, scope);
    const run = () => ctx.add(() => setupRef.current(ctx, element));
    const cancel = deferRef.current ? afterFirstFrame(run) : (run(), () => {});
    return () => {
      cancel();
      ctx.revert();
    };
  }, []);

  return scope;
}
