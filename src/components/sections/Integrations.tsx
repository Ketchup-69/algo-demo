import { Container, Heading, Section, Text } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { integrations } from "@/content/sections";

/**
 * Plain type, no logos.
 *
 * CLAUDE.md §2 forbids naming any other vendor or platform; the Phase 1 brief
 * overrides that for this list on the grounds that these are systems the buyer
 * already runs, not partner or customer references. Setting
 * `integrations.showSystems = false` in the content file removes the list
 * entirely in one edit — the heading, body and closing line still stand.
 */
export function Integrations() {
  return (
    <Section id={integrations.id} spacing="lg" className="border-t border-border">
      <Container width="wide">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-24">
            <div>
              <Heading level={2} size="2xl" data-reveal="lines">
                {integrations.h2}
              </Heading>
              <Text tone="muted" size="lg" className="mt-6" data-reveal="fade">
                {integrations.body}
              </Text>
            </div>

            {integrations.showSystems ? (
              <ul className="flex flex-wrap gap-2.5 self-start lg:pt-2" data-reveal="group">
                {integrations.systems.map((system) => (
                  <li
                    key={system}
                    className="rounded-full border border-border-strong bg-surface px-4 py-2 font-display text-base text-fg transition-colors duration-200 hover:border-accent"
                  >
                    {system}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <Text tone="muted" className="mt-12 max-w-[62ch] lg:ml-[calc(26rem+6rem)]" data-reveal="fade">
            {integrations.closing}
          </Text>
        </Reveal>
      </Container>
    </Section>
  );
}
