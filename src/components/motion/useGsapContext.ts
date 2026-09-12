"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

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
): RefObject<T | null> {
  const scope = useRef<T | null>(null);
  // Initialised once; deliberately never reassigned (writing a ref during
  // render is a bug, and the value does not need to change).
  const setupRef = useRef(setup);

  useEffect(() => {
    if (!scope.current) return;
    const element = scope.current;
    const ctx = gsap.context((self) => setupRef.current(self, element), scope);
    return () => ctx.revert();
  }, []);

  return scope;
}
