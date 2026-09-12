"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { hero } from "@/content/sections";
import { Button, Container, ThemeToggle } from "@/components/ui";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

/**
 * Sticky header. Transparent over the hero, solid once the page scrolls.
 *
 * The scroll listener only toggles a boolean that swaps a background and a
 * border — there is no animation here beyond the CSS colour transition. Motion
 * proper is Phase 2.
 */
export function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-200",
        solid
          ? "border-b border-border bg-bg/90 backdrop-blur-sm"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container width="wide">
        <div className="flex h-16 items-center justify-between gap-4">
          <NextLink
            href="/"
            className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <Logo />
          </NextLink>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {site.nav.map((item) => (
              <NextLink
                key={item.href}
                href={item.href}
                className="text-sm text-fg-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {item.label}
              </NextLink>
            ))}
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
