import { Container, Heading, Section, Text } from "@/components/ui";
import { governance } from "@/content/sections";

/**
 * Four points, separated by hairlines rather than boxed into four matching
 * cards with matching shadows (§4 anti-pattern). The section carries the page's
 * only tinted panel so it reads as the load-bearing argument it is.
 */
export function Governance() {
  return (
    <Section id={governance.id} spacing="lg" tone="accent">
      <Container width="wide">
        <Heading level={2} size="2xl" className="max-w-[20ch]">
          {governance.h2}
        </Heading>
        <Text size="lg" className="mt-6 max-w-[62ch]">
          {governance.intro}
        </Text>

        <dl className="mt-14 grid gap-x-16 gap-y-10 sm:grid-cols-2">
          {governance.points.map((point) => (
            <div key={point.label} className="border-t border-border-strong pt-5">
              <dt className="font-display text-base font-semibold text-fg">
                {point.label}
              </dt>
              <dd className="mt-3">
                <Text tone="muted" size="sm" measure={false} className="max-w-[52ch]">
                  {point.description}
                </Text>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
