import { Button, Container, Heading, Section, Text } from "@/components/ui";
import { HeroSequence } from "@/components/motion/HeroSequence";
import { hero } from "@/content/sections";
import { HeroVisual } from "./HeroVisual";

/**
 * `data-hero-seq` marks the parts the load sequence drives. The attribute is
 * also what the CSS guard in globals.css targets, so the two stay in step —
 * add a hook here and it is hidden pre-paint and animated, or neither.
 */
export function Hero() {
  return (
    <Section id={hero.id} spacing="lg" className="pt-12 sm:pt-16 lg:pt-20">
      <Container width="wide">
        <HeroSequence>
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
            <div>
              <Heading level={1} size="3xl" className="max-w-[18ch]" data-hero-seq="headline">
                {hero.h1}
              </Heading>
              <Text tone="muted" size="lg" className="mt-6 max-w-[52ch]" data-hero-seq="sub">
                {hero.sub}
              </Text>

              <div className="mt-9 flex flex-wrap items-center gap-3">
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

              <Text tone="muted" size="sm" className="mt-5" data-hero-seq="supporting">
                {hero.supporting}
              </Text>
            </div>

            <HeroVisual />
          </div>
        </HeroSequence>
      </Container>
    </Section>
  );
}
