import { Container, Heading, Section, Text } from "@/components/ui";
import { beyondFinance } from "@/content/sections";

/** A quiet definition list, explicitly not cards — the brief asked for restraint. */
export function BeyondFinance() {
  return (
    <Section id={beyondFinance.id} spacing="lg">
      <Container width="wide">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,26ch)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Heading level={2} size="xl">
              {beyondFinance.h2}
            </Heading>
            <Text tone="muted" className="mt-5">
              {beyondFinance.intro}
            </Text>
          </div>

          <dl className="flex flex-col">
            {beyondFinance.categories.map((category) => (
              <div
                key={category.label}
                className="grid gap-1 border-t border-border py-5 sm:grid-cols-[minmax(0,24ch)_minmax(0,1fr)] sm:gap-8 last:border-b"
              >
                <dt className="font-medium text-fg">{category.label}</dt>
                <dd>
                  <Text tone="muted" size="sm" measure={false} className="max-w-[58ch]">
                    {category.description}
                  </Text>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Text tone="muted" className="mt-10 max-w-[62ch]">
          {beyondFinance.closing}
        </Text>
      </Container>
    </Section>
  );
}
