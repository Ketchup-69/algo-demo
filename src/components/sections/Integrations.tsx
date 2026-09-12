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
    <Section id={integrations.id} spacing="lg">
      <Container width="wide">
        <Reveal>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,26ch)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Heading level={2} size="xl">
              {integrations.h2}
            </Heading>
            <Text tone="muted" className="mt-5">
              {integrations.body}
            </Text>
          </div>

          {integrations.showSystems ? (
            <ul className="grid grid-cols-2 gap-x-8 gap-y-4 self-start sm:grid-cols-3">
              {integrations.systems.map((system) => (
                <li
                  key={system}
                  className="border-b border-border pb-3 font-display text-base text-fg"
                >
                  {system}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <Text tone="muted" className="mt-10 max-w-[62ch]">
          {integrations.closing}
        </Text>
        </Reveal>
      </Container>
    </Section>
  );
}
