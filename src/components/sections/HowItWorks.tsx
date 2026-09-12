import { Container, Heading, Section, Text } from "@/components/ui";
import { howItWorks } from "@/content/sections";

/**
 * The only numbered section on the page. CLAUDE.md §4 bans `01 / 02 / 03`
 * markers on content that is not an actual sequence — this one is, so the
 * numbering is doing real work here and must not be copied elsewhere.
 */
export function HowItWorks() {
  return (
    <Section id={howItWorks.id} spacing="lg" tone="subtle">
      <Container width="wide">
        <Heading level={2} size="2xl" className="max-w-[24ch]">
          {howItWorks.h2}
        </Heading>

        <ol className="mt-14 flex flex-col gap-px bg-border">
          {howItWorks.steps.map((step, i) => (
            <li
              key={step.title}
              className="grid gap-4 bg-bg-subtle py-8 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[6rem_minmax(0,22ch)_minmax(0,1fr)] lg:gap-12"
            >
              <span
                aria-hidden="true"
                className="font-display text-2xl font-semibold text-accent tabular-nums"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-lg font-semibold text-fg">
                {step.title}
              </h3>
              <Text tone="muted" measure={false} className="max-w-[62ch]">
                {step.description}
              </Text>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
