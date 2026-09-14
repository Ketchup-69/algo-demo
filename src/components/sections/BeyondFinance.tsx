import { Container, Heading, Section, Text } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { beyondFinance } from "@/content/sections";

/** A quiet definition list, explicitly not cards — the brief asked for restraint. */
export function BeyondFinance() {
  return (
    <Section id={beyondFinance.id} spacing="lg">
      <Container width="wide">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-24">
            <div>
              <Heading level={2} size="2xl" data-reveal="lines">
                {beyondFinance.h2}
              </Heading>
              <Text tone="muted" size="lg" className="mt-6" data-reveal="fade">
                {beyondFinance.intro}
              </Text>
            </div>

            <dl className="flex flex-col" data-reveal="group">
              {beyondFinance.categories.map((category) => (
                <div
                  key={category.label}
                  className="group grid gap-1.5 border-t border-border py-6 last:border-b sm:grid-cols-[minmax(0,26ch)_minmax(0,1fr)] sm:gap-8"
                >
                  <dt className="font-display text-lg font-semibold text-fg">
                    {category.label}
                  </dt>
                  <dd>
                    <Text tone="muted" measure={false} className="max-w-[52ch]">
                      {category.description}
                    </Text>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <Text tone="muted" className="mt-12 max-w-[62ch] lg:ml-[calc(26rem+6rem)]" data-reveal="fade">
            {beyondFinance.closing}
          </Text>
        </Reveal>
      </Container>
    </Section>
  );
}
