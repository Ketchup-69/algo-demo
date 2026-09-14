"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * A one-pixel line under the header that grows as an article is read. It
 * follows the scroll (scrub), never drives it; the bar is scaled, not resized,
 * so it costs a transform and nothing else. Decorative: hidden from assistive
 * tech, and absent under reduced motion.
 */
export function ReadingProgress({ target }: { target: string }) {
  const scope = useGsapContext<HTMLDivElement>((_self, element) => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Resolved against the document: the GSAP context scopes selector text
      // to this element, and the article is elsewhere on the page.
      const article = document.querySelector(target);
      if (!article) return;
      gsap.fromTo(
        element,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: { trigger: article, start: "top 20%", end: "bottom 80%", scrub: 0.3 },
        },
      );
    });
    return () => mm.revert();
  });

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-px origin-left scale-x-0 bg-accent motion-reduce:hidden"
    />
  );
}
