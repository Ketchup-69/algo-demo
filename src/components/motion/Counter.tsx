"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ease, revealStart } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * A figure that counts up as it enters the viewport.
 *
 * Only a value with a number in it animates: "42%", "7 days", "3.2x". A
 * placeholder such as "—" renders exactly as written, so the count-up is
 * inert until the owner supplies real figures (§2 — nothing here can be
 * mistaken for a measured result until it is one).
 *
 * The final value is in the static HTML. The count-up only rewrites the
 * digits for the duration of the tween and lands on the same string.
 */
export function Counter({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
    if (!match) return;

    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/,/g, ""));
    if (!Number.isFinite(target)) return;
    const decimals = (digits.split(".")[1] ?? "").length;
    const grouped = digits.includes(",");

    const format = (n: number) => {
      const fixed = n.toFixed(decimals);
      if (!grouped) return fixed;
      const [whole, frac] = fixed.split(".");
      const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return frac ? `${withCommas}.${frac}` : withCommas;
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
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
          },
        });
      });
    });

    return () => ctx.revert();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
