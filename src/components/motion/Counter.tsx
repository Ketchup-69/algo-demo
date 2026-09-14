"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ease, revealStart } from "@/lib/motion";
import { afterFirstFrame } from "./refresh";

gsap.registerPlugin(ScrollTrigger);

/**
 * A figure that counts up as it enters the viewport.
 *
 * Only a value with a number in it animates: "42%", "7 days", "3.2x". A
 * placeholder such as "—" renders exactly as written, and `animate={false}`
 * (wired to the section's own placeholder flag) keeps a filler figure such as
 * "00" still as well — nothing here may look like a measured result until it
 * is one (§2).
 *
 * The final value is in the static HTML. The count-up only rewrites the
 * digits for the duration of the tween and lands on the same string. The
 * element reserves its final width before the first frame, so the figure
 * never changes size while it counts.
 */
export function Counter({
  value,
  animate = true,
  className,
}: {
  value: string;
  animate?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;

    const match = value.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
    if (!match) return;

    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/,/g, ""));
    if (!Number.isFinite(target) || target === 0) return;
    const decimals = (digits.split(".")[1] ?? "").length;
    const grouped = digits.includes(",");

    // No zero-padding: "100%" must not pass through "029%". The element
    // reserves its final width instead, and the figures are tabular.
    const format = (n: number) => {
      const fixed = n.toFixed(decimals);
      const [whole, frac] = fixed.split(".");
      const withCommas = grouped ? whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : whole;
      return frac ? `${withCommas}.${frac}` : withCommas;
    };

    const ctx = gsap.context(() => {});
    const cancel = afterFirstFrame(() =>
      ctx.add(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          // Reserve the final width: the static value is what is rendered
          // right now, so its width is the width to hold.
          el.style.minInlineSize = `${el.getBoundingClientRect().width}px`;
          const state = { n: 0 };
          // A small figure has few steps to show; give it less time so "3"
          // does not tick over three values in slow motion.
          const seconds = Math.min(1.4, 0.5 + Math.log10(Math.max(2, target)) * 0.45);
          gsap.to(state, {
            n: target,
            duration: seconds,
            ease: ease.out,
            scrollTrigger: { trigger: el, start: revealStart, once: true },
            onUpdate: () => {
              el.textContent = `${prefix}${format(state.n)}${suffix}`;
            },
            onComplete: () => {
              el.textContent = value;
              el.style.minInlineSize = "";
            },
          });
        });
      }),
    );

    return () => {
      cancel();
      ctx.revert();
    };
  }, [value, animate]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
