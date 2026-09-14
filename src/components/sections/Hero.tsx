import { Button, Container, Heading, Section, Text } from "@/components/ui";
import { HeroSequence } from "@/components/motion/HeroSequence";
import { hero } from "@/content/sections";
import { HeroVisual } from "./HeroVisual";

/**
 * Statement first, then the product drawn underneath it at full width — the
 * diagram needs the room, and the headline needs to be read before the eye is
 * given something to watch.
 *
 * The ground: a dot pattern that fades out under a radial mask, and the glow
 * token drifting slowly behind it. Both are tokens, so they follow the theme;
 * both are CSS, so they cost nothing on the main thread; the drift is
 * `motion-safe`, so it is still under reduced motion.
 *
 * `data-hero-seq` marks the parts the load sequence drives. The attribute is
 * also what the CSS guard in globals.css targets, so the two stay in step:
 * add a hook here and it is hidden pre-paint and animated, or neither.
 */
export function Hero() {
  return (
    <Section
      id={hero.id}
      spacing="none"
      className="relative overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-dot-pattern absolute inset-x-0 top-0 h-[70vh]" />
        <div className="bg-grad-glow motion-safe:animate-spotlight absolute inset-x-0 top-0 h-[70vh] will-change-transform" />
      </div>

      <Container width="wide" className="relative">
        <HeroSequence>
          <Heading level={1} size="display" className="max-w-[17ch]" data-hero-seq="headline">
            {hero.h1}
          </Heading>

          <div className="mt-8 flex flex-col gap-8 sm:mt-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <Text tone="muted" size="lg" className="max-w-[52ch]" data-hero-seq="sub">
              {hero.sub}
            </Text>

            <div className="flex shrink-0 flex-col gap-4 lg:items-end">
              <div className="flex flex-wrap items-center gap-3">
                <Button href={hero.primaryCta.href} size="lg" data-hero-seq="cta">
                  {hero.primaryCta.label}
                </Button>
                <Button
                  href={hero.secondaryCta.href}
                  variant="secondary"
                  size="lg"
                  data-hero-seq="cta"
                >
                  {hero.secondaryCta.label}
                </Button>
              </div>
              <Text tone="muted" size="sm" measure={false} data-hero-seq="supporting">
                {hero.supporting}
              </Text>
            </div>
          </div>

          <div className="mt-14 sm:mt-16 lg:mt-20">
            <HeroVisual />
          </div>
        </HeroSequence>
      </Container>
    </Section>
  );
}
