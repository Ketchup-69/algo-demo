"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "./useGsapContext";

gsap.registerPlugin(ScrollTrigger);

/**
 * The one signature scroll moment (CLAUDE.md §5), on "How it works".
 *
 * WHY THIS SECTION: it is the only genuine sequence on the page, so a
 * progressive reveal is describing something real rather than decorating.
 * Connect, then prepare, then approve — the reader's position in the section
 * IS the position in the process.
 *
 * WHY IT IS NOT PINNED: pinning means taking the scroll away, and every pin
 * has to earn back the disorientation it causes. Here it would buy nothing the
 * reader does not already get by scrolling normally — the steps are short, they
 * read top to bottom, and there is no spatial transformation that needs holding
 * still to be understood. It would also be the most expensive thing on the page
 * on a mid-range phone, which §5 explicitly guards against. So: no pin, no
 * scroll-jacking, no hijacked speed. The page scrolls at exactly the rate the
 * visitor asked for, and the steps light up as they arrive.
 *
 * WHAT ACTUALLY MOVES: each step's rail marker fills and its number brightens
 * as that step reaches the reading position, and the connecting rail draws down
 * behind them. The text does not move and is never hidden — it is in the static
 * HTML and stays in the accessibility tree throughout (§5).
 */
export function StepSequence({ children }: { children: React.ReactNode }) {
  const scope = useGsapContext<HTMLDivElement>(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // The rail draws down as the section passes through the viewport. Tied to
      // scroll position via `scrub`, which follows the scroll rather than
      // driving it — no jacking.
      gsap.fromTo(
        "[data-step-rail]",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-step-list]",
            start: "top 72%",
            end: "bottom 70%",
            scrub: 0.4,
          },
        },
      );

      // Each step resolves as it reaches the reading line. Markers and numbers
      // only — never the copy.
      // `fromTo` sets the starting state at mount rather than in CSS. This
      // section is below the fold, so the reader never sees the pre-GSAP state
      // and no `html.js` guard is needed here — unlike the hero, which is
      // visible at first paint. If GSAP fails to load, these simply stay at
      // their final state, which is what the markup already says.
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
      steps.forEach((step) => {
        const marker = step.querySelector("[data-step-marker]");
        const trigger = {
          trigger: step,
          start: "top 78%",
          toggleActions: "play none none reverse",
        } as const;

        // The step NUMBER is deliberately not animated. Fading it in from a low
        // opacity put 14px accent text on the page at 1.4:1, which Lighthouse
        // correctly failed — being aria-hidden exempts it from the
        // accessibility tree, not from being looked at. The marker carries the
        // reveal instead: it is a bordered circle with no text, so there is no
        // contrast to fail.
        gsap.fromTo(
          marker,
          { opacity: 0, scale: 0.4 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: "back.out(2)",
            scrollTrigger: trigger,
          },
        );
      });

      // Anything the browser reflowed after we measured (late fonts, an image)
      // would leave the triggers pointing at stale offsets.
      ScrollTrigger.refresh();
    });

    // Reduced motion: markers and numbers are already at their final opacity
    // in the markup, so there is nothing to undo.
    return () => mm.revert();
  });

  return <div ref={scope}>{children}</div>;
}
