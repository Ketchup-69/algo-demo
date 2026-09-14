import { Container, Heading, Section, Text } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { governance } from "@/content/sections";
import { ApprovalConsole } from "./ApprovalConsole";

/**
 * The load-bearing argument, on the page's one dark panel.
 *
 * The section carries `data-theme="dark"` so it holds an ink ground in both
 * themes — in light mode it is the one full-bleed change of ground on the
 * page, and in dark mode it recedes a step further than the page around it.
 * Every colour inside still comes through the semantic aliases.
 *
 * Four points, separated by hairlines rather than boxed into four matching
 * cards (§4 anti-pattern), beside the approval queue that shows the first
 * point happening.
 */
export function Governance() {
  return (
    <Section
      id={governance.id}
      spacing="lg"
      data-theme="dark"
      className="bg-bg-subtle text-fg"
    >
      <Container width="wide">
        <Reveal>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24">
            <div>
              <Heading level={2} size="3xl" className="max-w-[16ch]" data-reveal="lines">
                {governance.h2}
              </Heading>
              <Text size="lg" tone="muted" className="mt-6 max-w-[48ch]" data-reveal="fade">
                {governance.intro}
              </Text>

              <dl className="mt-14 flex flex-col" data-reveal="group">
                {governance.points.map((point) => (
                  <div
                    key={point.label}
                    className="grid gap-2 border-t border-border-strong py-6 sm:grid-cols-[minmax(0,22ch)_minmax(0,1fr)] sm:gap-8"
                  >
                    <dt className="font-display text-base font-semibold text-fg">
                      {point.label}
                    </dt>
                    <dd>
                      <Text tone="muted" size="sm" measure={false} className="max-w-[44ch]">
                        {point.description}
                      </Text>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="lg:pt-4" data-reveal="rise">
              <ApprovalConsole />
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
