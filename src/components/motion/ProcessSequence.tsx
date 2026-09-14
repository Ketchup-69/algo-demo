"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "./useGsapContext";
import { refreshAfterFonts } from "./refresh";

gsap.registerPlugin(ScrollTrigger);

/**
 * The one signature scroll moment (CLAUDE.md §5), on "How it works".
 *
 * WHY THIS SECTION: it is the only genuine sequence on the page, so a
 * progressive reveal describes something real rather than decorating.
 * Connect, then prepare, then approve — the reader's position in the steps IS
 * the position in the process, and the board beside them shows that state.
 *
 * WHY IT IS NOT PINNED: the board holds still with CSS `position: sticky`,
 * which is the browser's own scroll, not a hijacked one. Nothing changes the
 * rate the page moves at, nothing captures the wheel, and there is no
 * scroll-distance to "get through" — the section is exactly as tall as its
 * three steps.
 *
 * WHAT THIS DOES: almost nothing. As each step reaches the reading line it
 * writes the stage number onto the board; scrolling back above a step writes
 * the previous one. Everything visible — nodes lifting, beams lighting and
 * travelling, the tick drawing — is CSS in globals.css keyed off that
 * attribute, so the scroll handler costs one attribute write. The rail
 * beside the steps and their markers are the only tweens here.
 *
 * The markup's default is stage 3. Under reduced motion nothing here runs and
 * the reader gets the complete picture beside every step.
 */
export function ProcessSequence({ children }: { children: React.ReactNode }) {
  const scope = useGsapContext<HTMLDivElement>((_self, element) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const board = element.querySelector<HTMLElement>("[data-scene-root]");
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", element);
      if (!board || steps.length < 3) return;

      // A reload that restores a scroll position inside this section, or a
      // deep link to it, would otherwise dim a board the reader is looking at
      // and rebuild it in front of them. Leave the finished picture alone.
      const alreadyReading = board.getBoundingClientRect().top < window.innerHeight * 0.85;

      if (!alreadyReading) {
        board.dataset.stage = "0";
        steps.forEach((step, i) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 72%",
            onEnter: () => {
              board.dataset.stage = String(i + 1);
            },
            onLeaveBack: () => {
              board.dataset.stage = String(i);
            },
          });
        });
      }

      /* ---- the rail beside the steps, and each step's marker ---- */
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
      steps.forEach((step) => {
        const marker = step.querySelector("[data-step-marker]");
        if (!marker) return;
        gsap.fromTo(
          marker,
          { opacity: 0, scale: 0.4 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: "back.out(2)",
            scrollTrigger: { trigger: step, start: "top 72%", toggleActions: "play none none reverse" },
          },
        );
      });

      refreshAfterFonts();
    });

    return () => mm.revert();
  }, { defer: true });

  return <div ref={scope}>{children}</div>;
}
