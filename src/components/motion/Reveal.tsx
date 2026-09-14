"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SplitText } from "gsap/SplitText";
import { duration, ease, revealStart, stagger, travel } from "@/lib/motion";
import { useGsapContext } from "./useGsapContext";
import { linesFrom, revealLines } from "./lines";
import { refreshAfterFonts } from "./refresh";

gsap.registerPlugin(ScrollTrigger);

/**
 * The section entrance. One wrapper per section; the markup inside declares
 * what kind of arrival each part gets with a `data-reveal` attribute, and this
 * component builds the animations off those hooks. Sections therefore stay
 * server components with copy in the static HTML, and the motion is a client
 * concern layered on top (§5).
 *
 *   data-reveal="lines"   a heading. Masked line reveal.
 *   data-reveal="fade"    body copy. Opacity only.
 *   data-reveal="group"   a container whose children fade in, in sequence.
 *                         Children are `[data-reveal-item]` if any are marked,
 *                         otherwise the direct children. Opacity only.
 *   data-reveal="rise"    a panel. Opacity plus 14px of travel. Used twice on
 *                         the page — the console and the form — and nowhere
 *                         else, because "everything slides up" is the §4
 *                         anti-pattern and the headings already carry the
 *                         movement.
 *   data-reveal="draw"    a horizontal rule. Scales in from the left.
 *
 * Everything triggers off the SECTION, not off each target. If every item
 * triggered on itself a stagger would never be visible: each child would start
 * as it crossed the line, which is N separate entrances wearing a stagger's
 * clothing. Plays once; replaying on every pass makes a page feel busy and
 * punishes anyone scrolling back to re-read.
 *
 * Order inside a section is fixed: lines first, then fades and rises a beat
 * later, so the heading is always what arrives first.
 *
 * The starting state is set by `from`, not in CSS, so a visitor with
 * JavaScript off (or a crawler) sees the finished page. The imports are static
 * on purpose — dynamic-importing GSAP per section was measured in Phase 2 and
 * cost more in scheduling than it saved.
 *
 * Nothing is built until the section is within a viewport of the fold, and
 * never before the hero has had its first frame (see refresh.ts). A page of
 * twelve sections splitting every heading and registering every tween at
 * mount was measured at roughly double the main-thread time of the page
 * before it; building on approach puts that work where the reader is, and a
 * section that is never reached never costs anything. The section is fully
 * visible until then, which the reader cannot see because it is off-screen —
 * and which a crawler with a tall viewport simply gets all at once.
 *
 * Anything already past the reveal line when it is built — a reload that
 * restores a mid-page scroll position, a deep link — is left exactly as the
 * static HTML has it. Hiding something the reader is looking at in order to
 * fade it back in is a flash, not an entrance.
 */
export function Reveal({
  children,
  className,
  start = revealStart,
}: {
  children: React.ReactNode;
  className?: string;
  /** ScrollTrigger `start`. Override for very short sections. */
  start?: string;
}) {
  const scope = useGsapContext<HTMLDivElement>(
    (_self, element) => {
      const mm = gsap.matchMedia();
      const splits: SplitText[] = [];

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = (selector: string) =>
          Array.from(element.querySelectorAll<HTMLElement>(selector));

        const trigger = { trigger: element, start, once: true } as const;

        const build = () => {
          // The reveal line, as a pixel row. Anything above it is already
          // being read and is left alone.
          const line = window.innerHeight * 0.85;
          const pending = (els: HTMLElement[]) =>
            els.filter((el) => el.getBoundingClientRect().top >= line);

          // Headings: each one is split independently so autoSplit can rebuild
          // it on its own, but they all share the section's trigger.
          for (const heading of pending(q("[data-reveal='lines']"))) {
            splits.push(
              revealLines(heading, (lines) =>
                linesFrom(lines, { scrollTrigger: { ...trigger } }),
              ),
            );
          }

          const fades = pending(q("[data-reveal='fade']"));
          if (fades.length) {
            gsap.from(fades, {
              opacity: 0,
              duration: duration.base,
              ease: ease.out,
              delay: 0.2,
              stagger: 0.05,
              scrollTrigger: { ...trigger },
            });
          }

          const rises = pending(q("[data-reveal='rise']"));
          if (rises.length) {
            gsap.from(rises, {
              opacity: 0,
              y: travel.base,
              duration: duration.base,
              ease: ease.out,
              delay: 0.25,
              stagger: stagger.items,
              scrollTrigger: { ...trigger },
            });
          }

          const rules = pending(q("[data-reveal='draw']"));
          if (rules.length) {
            gsap.from(rules, {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 1.1,
              ease: ease.inOut,
              delay: 0.2,
              scrollTrigger: { ...trigger },
            });
          }

          for (const group of q("[data-reveal='group']")) {
            const marked = Array.from(
              group.querySelectorAll<HTMLElement>("[data-reveal-item]"),
            );
            const items = pending(marked.length ? marked : (Array.from(group.children) as HTMLElement[]));
            if (!items.length) continue;
            gsap.from(items, {
              opacity: 0,
              duration: duration.base,
              ease: ease.out,
              delay: 0.3,
              // A long list should not hold the reader for N × stagger. The
              // spread is capped so a 12-item list still lands inside a second.
              stagger: items.length > 8 ? 0.05 : stagger.items,
              scrollTrigger: { trigger: group, start, once: true },
            });
          }
        };

        // Build on approach: a viewport before the section reaches the fold.
        // One observer, not a ScrollTrigger: it costs nothing until it fires.
        const approach = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting)) return;
            approach.disconnect();
            build();
          },
          { rootMargin: "100% 0px 100% 0px" },
        );
        approach.observe(element);

        refreshAfterFonts();
        return () => approach.disconnect();
      });

      return () => {
        // Reverting a split puts the original text nodes back, which is what
        // the accessibility tree and any later navigation should find.
        splits.forEach((s) => s.revert());
        mm.revert();
      };
    },
    { defer: true },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
