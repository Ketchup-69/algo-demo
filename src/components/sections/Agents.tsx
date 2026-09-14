import { Container, Heading, Section, Text } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { agents } from "@/content/sections";

/**
 * Deliberately not four identical rounded cards with identical shadows — that
 * is an anti-pattern in CLAUDE.md §4, and it would also misrepresent the
 * content. These four agents are not a menu of parallel options; they are four
 * consecutive stages of one money cycle: commit, pay, collect, measure.
 *
 * So they are drawn as a spine. A single rule runs through all four and draws
 * itself in as the section arrives; each stage is a node on it, marked by a
 * dot where it meets the rule. On small screens the grid stacks and the rule
 * still runs across the top, so the structure holds.
 */
export function Agents() {
  return (
    <Section id={agents.id} spacing="lg">
      <Container width="wide">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <Heading level={2} size="3xl" className="max-w-[16ch]" data-reveal="lines">
              {agents.h2}
            </Heading>
            <Text tone="muted" size="lg" className="max-w-[52ch] lg:pt-3" data-reveal="fade">
              {agents.intro}
            </Text>
          </div>

          {/* One rule across all four, not one per column — the point is that
              this is a single cycle, and four separate gradients would say the
              opposite. It draws in from the left. */}
          <hr aria-hidden="true" className="rule-accent mt-16 lg:mt-24" data-reveal="draw" />

          <ol className="grid sm:grid-cols-2 lg:grid-cols-4" data-reveal="group">
            {agents.items.map((agent) => (
              <li
                key={agent.name}
                className="group relative flex flex-col border-b border-border py-8 pr-6 last:border-b-0 sm:border-b-0 sm:border-r sm:pl-6 sm:last:border-r-0 sm:first:pl-0 lg:py-10"
              >
                {/* The node: sits on the rule and brightens on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute -top-[5px] left-0 size-[9px] rounded-full border-2 border-accent bg-bg transition-colors duration-200 group-hover:bg-accent sm:left-6 sm:first:left-0"
                />
                <span className="text-sm font-medium text-accent">{agent.stage}</span>
                <h3 className="mt-3 font-display text-xl font-semibold text-fg">
                  {agent.name}
                </h3>
                <Text tone="muted" measure={false} className="mt-4 max-w-[36ch]">
                  {agent.description}
                </Text>
              </li>
            ))}
          </ol>

          <Text tone="muted" className="mt-12 max-w-[62ch]" data-reveal="fade">
            {agents.closing}
          </Text>
        </Reveal>
      </Container>
    </Section>
  );
}
