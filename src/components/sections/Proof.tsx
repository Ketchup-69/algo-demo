import { Container, Heading, Section, Text } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { proof } from "@/content/sections";

/**
 * How a deployment is measured. Three measures on hairlines, no figures:
 * CLAUDE.md §2 forbids results presented as real, and a method is the honest
 * thing to show until there are results the owner can stand behind.
 *
 * The quotation renders only once `proof.quote.enabled` is true in the
 * content file (PLACEHOLDER until then). Set `proof.enabled = false` to drop
 * the whole section.
 */
export function Proof() {
  if (!proof.enabled) return null;

  return (
    <Section id={proof.id} spacing="lg" tone="subtle">
      <Container width="wide">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-24">
            <div>
              <Heading level={2} size="2xl" data-reveal="lines">
                {proof.h2}
              </Heading>
              <Text tone="muted" size="lg" className="mt-6" data-reveal="fade">
                {proof.intro}
              </Text>
            </div>

            <dl className="flex flex-col" data-reveal="group">
              {proof.measures.map((measure) => (
                <div
                  key={measure.label}
                  className="grid gap-1.5 border-t border-border-strong py-6 last:border-b sm:grid-cols-[minmax(0,22ch)_minmax(0,1fr)] sm:gap-8"
                >
                  <dt className="font-display text-lg font-semibold text-fg">{measure.label}</dt>
                  <dd>
                    <Text tone="muted" measure={false} className="max-w-[52ch]">
                      {measure.description}
                    </Text>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {proof.quote.enabled && proof.quote.text ? (
            <figure className="mt-16 border-t border-border-strong pt-10 lg:ml-[calc(26rem+6rem)]" data-reveal="rise">
              <blockquote>
                <Text size="lg" measure={false} className="max-w-[52ch] font-display text-xl">
                  {proof.quote.text}
                </Text>
              </blockquote>
              <figcaption className="mt-5 text-sm text-fg-muted">{proof.quote.attribution}</figcaption>
            </figure>
          ) : null}
        </Reveal>
      </Container>
    </Section>
  );
}
