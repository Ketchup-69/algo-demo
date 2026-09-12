"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { duration, ease, travel } from "@/lib/motion";
import { useGsapContext } from "./useGsapContext";

gsap.registerPlugin(ScrollTrigger);

/**
 * The single section entrance, used everywhere. One treatment, applied
 * consistently — CLAUDE.md §4 lists "fade-and-slide-up on every single section"
 * as an anti-pattern, and the way that anti-pattern actually bites is a
 * DIFFERENT effect per section, each announcing itself. So this is deliberately
 * small enough to be felt rather than watched: 8px, 400ms, once, no reverse.
 *
 * `stagger` opts a section into revealing marked children in sequence rather
 * than as one block. Only the agents section uses it — that is the budget.
 *
 * The imports here are STATIC, and that was measured rather than assumed.
 * Loading gsap and ScrollTrigger dynamically inside the effect looked like the
 * obvious win — they are all below the fold — but nine sections each firing
 * their own dynamic import cost more in scheduling than the deferred bytes
 * saved: total blocking time went 109ms to 156ms and the Lighthouse score fell
 * two points. GSAP is already on the critical path for the hero, so the module
 * is paid for either way.
 *
 * The trigger is always the CONTAINER, never the individual targets. If each
 * staggered child triggered on itself the stagger would never be visible:
 * every child would start its own animation as it crossed the line, which is
 * four separate entrances wearing a stagger's clothing.
 *
 * Copy is never hidden from the document. `fromTo` sets the starting state at
 * mount, below the fold, so nothing is gated behind a scroll trigger (§5) and a
 * crawler or a reader with JS off gets the finished page.
 */
export function Reveal({
  children,
  stagger = false,
  className,
}: {
  children: React.ReactNode;
  stagger?: boolean;
  className?: string;
}) {
  const scope = useGsapContext<HTMLDivElement>((_self, element) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const targets: Element[] = stagger
        ? Array.from(element.querySelectorAll("[data-reveal-item]"))
        : Array.from(element.children);
      if (targets.length === 0) return;

      gsap.fromTo(
        targets,
        { opacity: 0, y: travel.sm },
        {
          opacity: 1,
          y: 0,
          duration: duration.base - 0.1,
          ease: ease.out,
          stagger: stagger ? 0.07 : 0,
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            // Plays once. Replaying on every pass makes a page feel busy and
            // punishes anyone scrolling back to re-read.
            once: true,
          },
        },
      );
    });

    return () => mm.revert();
  });

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
