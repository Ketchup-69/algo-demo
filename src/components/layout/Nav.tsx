"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { hero } from "@/content/sections";
import { Button, Container, ThemeToggle } from "@/components/ui";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

/**
 * Sticky header. Transparent over the hero; once the page moves it compresses
 * by a few pixels, takes a translucent ground and a hairline. The compression
 * is a height transition on the bar itself, which is the one layout-affecting
 * animation on the site — it is 8px, it happens once, and it is what makes
 * the header feel attached to the scroll rather than stuck on top of it.
 *
 * Links know where the reader is. An IntersectionObserver watches the
 * sections the nav points at and marks the current one with `aria-current`;
 * a hairline underneath it grows in from the left. On other routes the
 * pathname decides instead.
 */
export function Nav() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const anchors = site.nav.filter((item) => item.href.startsWith("#"));
    const targets = anchors
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    // A section is current while it occupies the band just below the header.
    // Track every section in that band and pick the highest one, so scrolling
    // back above the first target clears the indicator instead of leaving the
    // last section lit.
    const inBand = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target);
          else inBand.delete(entry.target);
        }
        const current = targets.find((t) => inBand.has(t));
        setActive(current ? `#${current.id}` : null);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [pathname]);

  // Anchor links are only ever current on the page that has the sections.
  const isCurrent = (href: string) =>
    href.startsWith("#") ? pathname === "/" && active === href : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300",
        solid
          ? "border-b border-border bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container width="wide">
        <div
          className={cn(
            "flex items-center justify-between gap-4 transition-[height] duration-300 motion-reduce:transition-none",
            solid ? "h-14" : "h-16",
          )}
        >
          <NextLink
            href="/"
            className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <Logo />
          </NextLink>

          <nav aria-label={site.ui.primaryNavLabel} className="hidden items-center gap-7 lg:flex">
            {site.nav.map((item) => {
              const current = isCurrent(item.href);
              return (
                <NextLink
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "true" : undefined}
                  className={cn(
                    "relative py-1 text-sm transition-colors duration-200",
                    "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-fg after:transition-transform after:duration-300 after:ease-out motion-reduce:after:transition-none",
                    "hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                    current ? "text-fg after:scale-x-100" : "text-fg-muted",
                  )}
                >
                  {item.label}
                </NextLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              href={hero.primaryCta.href}
              size="sm"
              className="hidden lg:inline-flex"
            >
              {hero.primaryCta.label}
            </Button>
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}
