"use client";

import gsap from "gsap";
import { duration, ease, travel } from "@/lib/motion";
import { useGsapContext } from "./useGsapContext";

/**
 * The one orchestrated hero moment (CLAUDE.md §5). Roughly 1.25s, plays once
 * on load, never again.
 *
 * It is deliberately not a fade-up applied to each element in turn. The text
 * and the diagram run CONCURRENTLY and overlap heavily: by the time the
 * headline has settled the records are already entering, and the sub-head
 * arrives while the flow lines are drawing. What you read and what you watch
 * describe the same thing at the same time — records arriving, being matched,
 * an exception peeling off, an approval clearing — so the sequence reads as
 * the product explaining itself in one gesture rather than as a list of
 * elements announcing themselves.
 *
 * Everything is transform and opacity, with one documented exception noted on
 * the flow lines below.
 */
export function HeroSequence({ children }: { children: React.ReactNode }) {
  const scope = useGsapContext<HTMLDivElement>(() => {
    const mm = gsap.matchMedia();

    // Reduced motion: clear the CSS guard and stop. The final state is what
    // the static HTML already contains, so there is nothing to build.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-hero-seq]", { clearProps: "opacity" });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Take ownership of opacity from the CSS guard before anything runs. If
      // this component never mounted, the guard would have left the hero
      // invisible — so this is the first act, not a side effect of the tween.
      gsap.set("[data-hero-seq]", { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: ease.out },
        onComplete: () =>
          // Drop the transforms so the compositor stops holding layers for the
          // rest of the visit — but PIN opacity inline at 1.
          //
          // `clearProps: "all"` here is a trap, and it cost a debugging round:
          // clearing opacity hands control back to the `html.js [data-hero-seq]`
          // rule in globals.css, which sets opacity 0. The hero animated in and
          // then disappeared. The inline 1 has to outlive the timeline.
          gsap.set("[data-hero-seq]", { clearProps: "transform", opacity: 1 }),
      });

      /* ---- the sentence ---- */
      tl.to("[data-hero-seq='headline']", {
        opacity: 1,
        y: 0,
        duration: duration.slow,
        startAt: { y: travel.base },
      }, 0)
        .to("[data-hero-seq='sub']", {
          opacity: 1,
          y: 0,
          duration: 0.6,
          startAt: { y: travel.sm + 2 },
        }, 0.12)
        .to("[data-hero-seq='cta']", {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.06,
          startAt: { y: travel.sm },
        }, 0.28)
        .to("[data-hero-seq='supporting']", {
          opacity: 1,
          duration: 0.4,
        }, 0.42);

      /* ---- the diagram, running against the same clock ---- */
      tl.to("[data-hero-seq='visual']", { opacity: 1, duration: 0.4 }, 0.1);

      // Records arrive from the left, in order.
      tl.fromTo(
        "[data-anim='records'] > g",
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.45, stagger: 0.08 },
        0.22,
      );

      /*
        Flow lines draw themselves.

        This is the one place the sequence animates something other than
        transform and opacity: `strokeDashoffset`. There is no transform that
        makes a curved path appear to be traced — scaleX distorts the curve —
        and a plain fade does not read as "flowing through".

        It costs paint on the SVG, not layout, across four short paths inside a
        720x420 viewBox. Measured on the scroll/paint profile it did not drop a
        frame. If that ever changes, deleting this one tween leaves the rest of
        the sequence intact.
      */
      tl.fromTo(
        "[data-anim='flow'] path",
        {
          strokeDasharray: (_i, target: SVGPathElement) => target.getTotalLength(),
          strokeDashoffset: (_i, target: SVGPathElement) => target.getTotalLength(),
        },
        {
          strokeDashoffset: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: ease.inOut,
          onComplete: () =>
            gsap.set("[data-anim='flow'] path", { clearProps: "strokeDasharray,strokeDashoffset" }),
        },
        0.4,
      );

      // The match resolves.
      tl.fromTo(
        "[data-anim='match']",
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.35, transformOrigin: "336px 200px" },
        0.74,
      );

      // What did not reconcile peels off.
      tl.fromTo(
        "[data-anim='exception']",
        { opacity: 0, x: -6 },
        { opacity: 1, x: 0, duration: 0.4 },
        0.88,
      );

      // The approval clears, and only then is anything recorded.
      tl.fromTo(
        "[data-anim='gate']",
        { opacity: 0 },
        { opacity: 1, duration: 0.35 },
        0.94,
      ).fromTo(
        "[data-anim='ledger']",
        { opacity: 0, x: 8 },
        { opacity: 1, x: 0, duration: 0.4 },
        1.02,
      );

      return () => {
        tl.kill();
      };
    });

    return () => mm.revert();
  });

  return <div ref={scope}>{children}</div>;
}
