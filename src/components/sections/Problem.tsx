import { Container, Heading, Section, Text } from "@/components/ui";
import { Counter, Reveal } from "@/components/motion";
import { problem } from "@/content/sections";

/**
 * The statement. Type does the work here: the heading is the largest thing
 * between the hero and the footer, and everything under it is quiet.
 */
export function Problem() {
  return (
    <Section id={problem.id} spacing="lg" tone="subtle">
      <Container width="wide">
        <Reveal>
          <Heading level={2} size="3xl" className="max-w-[22ch]" data-reveal="lines">
            {problem.h2}
          </Heading>

          <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-16">
            <Text size="lg" measure={false} className="max-w-[58ch]" data-reveal="fade">
              {problem.body}
            </Text>
            <Text tone="muted" size="lg" measure={false} className="max-w-[52ch]" data-reveal="fade">
              {problem.followOn}
            </Text>
          </div>

          {/*
            PLACEHOLDER: three filler stat slots. Values are em dashes on purpose
            so nothing here can be read as a measured result. The Counter is
            inert until a value contains a number.
            Edit: src/content/sections.ts → problem.stats.items[n]
            Then set problem.stats.placeholder = false to drop the notice.
          */}
          <div className="mt-16 border-t border-border pt-8 lg:mt-24 lg:pt-10">
            {problem.stats.placeholder ? (
              <Text tone="muted" size="sm" measure={false} className="mb-8" data-reveal="fade">
                {problem.stats.note}
              </Text>
            ) : null}
            <dl className="grid gap-10 sm:grid-cols-3 sm:gap-8" data-reveal="group">
              {problem.stats.items.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <Counter
                      value={stat.value}
                      className="block font-display text-5xl font-semibold text-fg tabular-nums"
                    />
                    <span className="mt-3 block max-w-[24ch] text-sm text-fg-muted">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
