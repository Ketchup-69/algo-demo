import { Container, Heading, Section, Text } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { problem } from "@/content/sections";

export function Problem() {
  return (
    <Section id={problem.id} spacing="lg" tone="subtle">
      <Container width="wide">
        <Reveal>
        <Heading level={2} size="2xl" className="max-w-[22ch]">
          {problem.h2}
        </Heading>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-12">
          <Text size="lg" measure={false} className="max-w-[62ch]">
            {problem.body}
          </Text>
          <Text tone="muted" measure={false} className="max-w-[62ch]">
            {problem.followOn}
          </Text>
        </div>

        {/*
          PLACEHOLDER: three filler stat slots. Values are em dashes on purpose
          so nothing here can be read as a measured result.
          Edit: src/content/sections.ts → problem.stats.items[n]
          Then set problem.stats.placeholder = false to drop the notice.
        */}
        <div className="mt-14 border-t border-border pt-8">
          {problem.stats.placeholder ? (
            <Text
              tone="muted"
              size="sm"
              measure={false}
              className="mb-6 font-mono text-xs tracking-wide uppercase"
            >
              {problem.stats.note}
            </Text>
          ) : null}
          <dl className="grid gap-8 sm:grid-cols-3">
            {problem.stats.items.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-4xl font-semibold text-fg">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-sm text-fg-muted">
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
