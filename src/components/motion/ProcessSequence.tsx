"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ease } from "@/lib/motion";
import { useGsapContext } from "./useGsapContext";
import { refreshAfterFonts } from "./refresh";

gsap.registerPlugin(ScrollTrigger);

/**
 * The one signature scroll moment (CLAUDE.md §5), on "How it works".
 *
 * WHY THIS SECTION: it is the only genuine sequence on the page, so a
 * progressive reveal describes something real rather than decorating.
 * Connect, then prepare, then approve — the reader's position in the steps IS
 * the position in the process, and the scene beside them shows that state.
 *
 * WHY IT IS NOT PINNED: the scene holds still with CSS `position: sticky`,
 * which is the browser's own scroll, not a hijacked one. Nothing changes the
 * rate the page moves at, nothing captures the wheel, and there is no
 * scroll-distance to "get through" — the section is exactly as tall as its
 * three steps. On a small screen the scene sticks to the top instead and the
 * steps pass beneath it, which is the same idea in the other axis.
 *
 * WHAT MOVES: three timelines, one per step, each carrying the scene from the
 * previous state to the next. They play as a step reaches the reading line and
 * reverse if the reader scrolls back, so the scene always agrees with the step
 * beside it. Every connector is a straight line drawn with a scale transform,
 * so the whole thing is transform and opacity. The copy never moves and is
 * never hidden.
 *
 * The markup's default is the FINAL state. Under reduced motion nothing here
 * runs and the reader gets the complete picture beside every step.
 */
export function ProcessSequence({ children }: { children: React.ReactNode }) {
  const scope = useGsapContext<HTMLDivElement>((_self, element) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const scene = element.querySelector("[data-scene-root]");
      // A reload that restores a scroll position inside this section, or a
      // deep link to it, would otherwise hide a scene the reader is looking
      // at and rebuild it in front of them. Leave the static picture alone.
      if (scene && scene.getBoundingClientRect().top < window.innerHeight * 0.85) return;
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", element);
      if (!scene || steps.length < 3) return;

      /** Every element carrying one of the given scene names, flat. */
      const s = (...names: string[]) =>
        names.flatMap((n) => Array.from(scene.querySelectorAll(`[data-scene='${n}']`)));
      /** The straight connectors inside a named group. */
      const lines = (name: string) =>
        Array.from(scene.querySelectorAll<SVGLineElement>(`[data-scene='${name}'] [data-scene-line]`));
      const items = Array.from(scene.querySelectorAll("[data-scene-item]"));

      // A line grows out of its own start point. The origin is written on the
      // element (see ProcessScene); GSAP resolves SVG origins against the
      // element's own bounding box, which for a line is the segment itself.
      const collapsed = (targets: SVGLineElement[]) =>
        gsap.set(targets, {
          scaleX: 0,
          scaleY: 0,
          transformOrigin: (_i: number, el: SVGLineElement) =>
            el.getAttribute("data-scene-line") ?? "0% 0%",
        });

      /* ---- the starting picture: nothing has happened yet ---- */
      const dim = 0.22;
      // Everything is present from the start, at a whisper, so the scene never
      // reads as an empty box while the first step is still arriving.
      gsap.set(s("sources", "agent", "read-tag"), { opacity: dim });
      collapsed(lines("read"));
      gsap.set(s("prepared", "prep-lines"), { opacity: dim });
      collapsed(lines("prep-lines"));
      gsap.set(items, { y: 8 });
      gsap.set(s("approver", "approve-line", "write-line", "record", "audit"), { opacity: dim });
      collapsed(lines("approve-line"));
      collapsed(lines("write-line"));
      gsap.set(s("tick"), { scale: 0, transformOrigin: "50% 50%" });

      const trigger = (step: HTMLElement) => ({
        trigger: step,
        start: "top 72%",
        toggleActions: "play none none reverse",
      });

      /* ---- 1. Connect, read-only ---- */
      gsap.timeline({ defaults: { ease: ease.out }, scrollTrigger: trigger(steps[0]) })
        .to(s("sources"), { opacity: 1, duration: 0.5 }, 0)
        .to(lines("read"), { scaleX: 1, scaleY: 1, duration: 0.5, stagger: 0.08, ease: ease.inOut }, 0.15)
        .to(s("agent"), { opacity: 1, duration: 0.4 }, 0.45)
        .to(s("read-tag"), { opacity: 1, duration: 0.35 }, 0.55);

      /* ---- 2. Agents do the work ---- */
      gsap.timeline({ defaults: { ease: ease.out }, scrollTrigger: trigger(steps[1]) })
        .to(s("prep-lines"), { opacity: 1, duration: 0.3 }, 0)
        .to(lines("prep-lines"), { scaleX: 1, scaleY: 1, duration: 0.45, stagger: 0.08, ease: ease.inOut }, 0)
        .to(s("prepared"), { opacity: 1, duration: 0.3 }, 0.2)
        .to(items, { y: 0, duration: 0.5, stagger: 0.08 }, 0.2);

      /* ---- 3. A person approves ---- */
      gsap.timeline({ defaults: { ease: ease.out }, scrollTrigger: trigger(steps[2]) })
        .to(s("approve-line"), { opacity: 1, duration: 0.2 }, 0)
        .to(lines("approve-line"), { scaleY: 1, duration: 0.35, ease: ease.inOut }, 0)
        .to(s("approver"), { opacity: 1, duration: 0.4 }, 0.25)
        .to(s("tick"), { scale: 1, duration: 0.35, ease: "back.out(2)" }, 0.5)
        .to(s("write-line"), { opacity: 1, duration: 0.2 }, 0.7)
        .to(lines("write-line"), { scaleX: 1, duration: 0.5, ease: ease.inOut }, 0.7)
        .to(s("record"), { opacity: 1, duration: 0.4 }, 1.05)
        .to(s("audit"), { opacity: 1, duration: 0.4 }, 1.2);

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
          { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)", scrollTrigger: trigger(step) },
        );
      });

      refreshAfterFonts();
    });

    return () => mm.revert();
  }, { defer: true });

  return <div ref={scope}>{children}</div>;
}
