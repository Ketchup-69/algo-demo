import { Button, Container, Heading, Section, Text } from "@/components/ui";
import { hero } from "@/content/sections";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <Section id={hero.id} spacing="lg" className="pt-12 sm:pt-16 lg:pt-20">
      <Container width="wide">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div>
            <Heading level={1} size="3xl" className="max-w-[18ch]">
              {hero.h1}
            </Heading>
            <Text tone="muted" size="lg" className="mt-6 max-w-[52ch]">
              {hero.sub}
            </Text>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="secondary" size="lg">
                {hero.secondaryCta.label}
              </Button>
            </div>

            <Text tone="muted" size="sm" className="mt-5">
              {hero.supporting}
            </Text>
          </div>

          <HeroVisual />
        </div>
      </Container>
    </Section>
  );
}
