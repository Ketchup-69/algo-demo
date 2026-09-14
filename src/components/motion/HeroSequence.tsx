"use client";

import gsap from "gsap";
import type { SplitText } from "gsap/SplitText";
import { duration, ease, stagger, travel } from "@/lib/motion";
import { useGsapContext } from "./useGsapContext";
import { linesFrom, revealLines } from "./lines";

/**
 * The one orchestrated hero moment (CLAUDE.md §5). About 1.8s, plays once on
 * load, then hands over to a quiet ambient loop on the diagram.
 *
 * The text and the diagram run CONCURRENTLY and overlap heavily: the headline
 * is still rising out of its masks when the records start arriving, and the
 * sub-head lands while the flow lines are drawing. What you read and what you
 * watch describe the same thing at the same time — records arriving, being
 * matched, an exception peeling off, an approval clearing, the status flipping
 * — so the sequence reads as the product explaining itself in one gesture
 * rather than as a list of elements announcing themselves.
 *
 * Everything is transform and opacity, with one documented exception on the
 * flow lines below.
 */
export function HeroSequence({ children }: { children: React.ReactNode }) {
  const scope = useGsapContext<HTMLDivElement>((_self, element) => {
    const mm = gsap.matchMedia();
    let split: SplitText | undefined;

    // Reduced motion: clear the CSS guard and stop. The final state is what
    // the static HTML already contains, so there is nothing to build — and the
    // header pill should read "approved", which is where the story ends.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-hero-seq]", { clearProps: "opacity" });
      gsap.set("[data-status='pending']", { opacity: 0 });
      gsap.set("[data-anim='pulse']", { opacity: 0 });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Take ownership of opacity from the CSS guard before anything runs. If
      // this component never mounted, the guard would have left the hero
      // invisible — so this is the first act, not a side effect of a tween.
      gsap.set("[data-hero-seq]", { opacity: 0 });

      /* ---- the headline: masked lines, on the same clock as everything else ---- */
      const headline = element.querySelector<HTMLElement>("[data-hero-seq='headline']");
      if (headline) {
        // The lines start below their masks, so the heading itself can be
        // fully opaque from the first frame. autoSplit rebuilds this tween
        // (at the same progress) if the font swaps in late.
        gsap.set(headline, { opacity: 1 });
        split = revealLines(headline, (lines) => linesFrom(lines));
      }

      const tl = gsap.timeline({
        defaults: { ease: ease.out },
        onComplete: () => {
          // Drop the transforms so the compositor stops holding layers for the
          // rest of the visit — but PIN opacity inline at 1.
          //
          // `clearProps: "all"` here is a trap, and it cost a debugging round:
          // clearing opacity hands control back to the `html.js [data-hero-seq]`
          // rule in globals.css, which sets opacity 0. The hero animated in and
          // then disappeared. The inline 1 has to outlive the timeline.
          gsap.set("[data-hero-seq]:not([data-hero-seq='headline'])", {
            clearProps: "transform",
            opacity: 1,
          });
          startAmbient();
        },
      });

      /* ---- the rest of the sentence ---- */
      tl.to("[data-hero-seq='sub']", {
        opacity: 1,
        y: 0,
        duration: duration.slow,
        startAt: { y: travel.sm },
      }, 0.18)
        .to("[data-hero-seq='cta']", {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          startAt: { y: travel.sm },
        }, 0.32)
        .to("[data-hero-seq='supporting']", { opacity: 1, duration: 0.4 }, 0.5);

      /* ---- the diagram, running against the same clock ---- */
      tl.to("[data-hero-seq='visual']", {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: ease.reveal,
        startAt: { y: travel.lg },
      }, 0.12);

      // Header pill: starts pending, flips at the end.
      tl.set("[data-status='approved']", { opacity: 0 }, 0);

      // Records arrive from the left, in order.
      tl.fromTo(
        "[data-anim='records'] > g",
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.5, stagger: stagger.records },
        0.36,
      );

      /*
        Flow lines draw themselves.

        This is the one place the sequence animates something other than
        transform and opacity: `strokeDashoffset`. There is no transform that
        makes a curved path appear to be traced — scaleX distorts the curve —
        and a plain fade does not read as "flowing through".

        It costs paint on the SVG, not layout, across four short paths. Measured
        on the scroll/paint profile in Phase 2 it did not drop a frame. If that
        ever changes, deleting this one tween leaves the rest intact.
      */
      const drawn = "[data-anim='flow'] path, [data-anim='gate-line']";
      tl.fromTo(
        drawn,
        {
          strokeDasharray: (_i, target: SVGPathElement) => target.getTotalLength(),
          strokeDashoffset: (_i, target: SVGPathElement) => target.getTotalLength(),
        },
        {
          strokeDashoffset: 0,
          duration: 0.6,
          stagger: 0.07,
          ease: ease.inOut,
          onComplete: () =>
            gsap.set(drawn, { clearProps: "strokeDasharray,strokeDashoffset" }),
        },
        0.58,
      );

      // The match resolves.
      tl.fromTo(
        "[data-anim='match']",
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.4, transformOrigin: "444px 210px" },
        0.96,
      );

      // What did not reconcile peels off.
      tl.fromTo(
        "[data-anim='exception']",
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.45 },
        1.08,
      );

      // The approval clears, and only then is anything recorded.
      tl.fromTo("[data-anim='gate']", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.16)
        .fromTo(
          "[data-anim='ledger']",
          { opacity: 0, x: 10 },
          { opacity: 1, x: 0, duration: 0.45 },
          1.3,
        );

      // The status pill: pending gives way to approved.
      tl.to("[data-status='pending']", { opacity: 0, duration: 0.25 }, 1.55)
        .to("[data-status='approved']", { opacity: 1, duration: 0.3 }, 1.6);

      /*
        Ambient loop. After the intro, three small pulses ride the flow: from a
        record, through the match, through the gate, into the ledger. One every
        few seconds, offset so they never bunch. It is the only thing on the
        page that moves without being asked, and it is small enough to be felt
        rather than watched.

        Each pulse is a progress value tweened from 0 to 1; on every frame the
        dot is placed at that fraction of the path's length. That is the whole
        of MotionPathPlugin's job for a dot on a fixed path, and doing it by
        hand keeps the plugin's 10KB out of the bundle.
      */
      const ambient: gsap.core.Timeline[] = [];
      const startAmbient = () => {
        const pulses = gsap.utils.toArray<SVGCircleElement>("[data-anim='pulse']");
        const flows = gsap.utils.toArray<SVGPathElement>("[data-anim='flow'] path");
        const gateLine = element.querySelector<SVGPathElement>("[data-anim='gate-line']");
        if (!gateLine || pulses.length !== flows.length) return;

        const ride = (dot: SVGCircleElement, path: SVGPathElement, seconds: number) => {
          const length = path.getTotalLength();
          const state = { p: 0 };
          return gsap.to(state, {
            p: 1,
            duration: seconds,
            onUpdate: () => {
              const { x, y } = path.getPointAtLength(state.p * length);
              dot.setAttribute("cx", String(x));
              dot.setAttribute("cy", String(y));
            },
          });
        };

        pulses.forEach((dot, i) => {
          const loop = gsap.timeline({
            repeat: -1,
            repeatDelay: 3.2,
            delay: 0.8 + i * 1.1,
            defaults: { ease: "none" },
          });
          loop
            .set(dot, { opacity: 0 })
            .to(dot, { opacity: 1, duration: 0.2 }, 0)
            .add(ride(dot, flows[i], 1.1), 0)
            .add(ride(dot, gateLine, 0.9), 1.1)
            .to(dot, { opacity: 0, duration: 0.25 }, 1.8);
          ambient.push(loop);
        });
      };

      return () => {
        tl.kill();
        ambient.forEach((a) => a.kill());
      };
    });

    return () => {
      split?.revert();
      mm.revert();
    };
  });

  return <div ref={scope}>{children}</div>;
}
