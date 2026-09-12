import { Container, Heading, Section, Text } from "@/components/ui";
import { agents } from "@/content/sections";

/**
 * Deliberately not four identical rounded cards with identical shadows — that
 * is an anti-pattern in CLAUDE.md §4, and it would also misrepresent the
 * content. These four agents are not a menu of parallel options; they are four
 * consecutive stages of one money cycle: commit, pay, collect, measure.
 *
 * So they are drawn as a spine. A single rule runs through all four, each stage
 * is a node on it, and the last one closes back to the first — the cycle
 * repeats. On small screens the rule becomes vertical and the structure holds.
 */
export function Agents() {
  return (
    <Section id={agents.id} spacing="lg">
      <Container width="wide">
        <Heading level={2} size="2xl" className="max-w-[20ch]">
          {agents.h2}
        </Heading>
        <Text tone="muted" size="lg" className="mt-6 max-w-[62ch]">
          {agents.intro}
        </Text>

        {/* One rule across all four, not one per column — the point is that this
            is a single cycle, and four separate gradients would say the opposite. */}
        <hr aria-hidden="true" className="rule-accent mt-14" />

        <ol className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {agents.items.map((agent) => (
            <li key={agent.name} className="flex flex-col bg-bg p-6 pt-8 lg:p-7 lg:pt-9">
              <span className="font-mono text-xs tracking-wider text-accent uppercase">
                {agent.stage}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-fg">
                {agent.name}
              </h3>
              <Text tone="muted" size="sm" measure={false} className="mt-3">
                {agent.description}
              </Text>
            </li>
          ))}
        </ol>

        <Text tone="muted" className="mt-10 max-w-[62ch]">
          {agents.closing}
        </Text>
      </Container>
    </Section>
  );
}
