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
 * digits are padded to the final value's width and the element reserves its
 * final width before the first frame, so the figure never changes size while
 * it counts.
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
    const wholeWidth = digits.split(".")[0].replace(/,/g, "").length;

    const format = (n: number) => {
      const fixed = n.toFixed(decimals);
      const [whole, frac] = fixed.split(".");
      const padded = whole.padStart(wholeWidth, "0");
      const withCommas = grouped ? padded.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : padded;
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
          gsap.to(state, {
            n: target,
            duration: 1.4,
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
