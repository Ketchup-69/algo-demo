import { Container, Heading, Section, Status, Text } from "@/components/ui";
import { Counter, Reveal } from "@/components/motion";
import { proof } from "@/content/sections";

/**
 * ============================================================================
 * PLACEHOLDER SECTION — every value below is filler.
 *
 * TO POPULATE, edit `src/content/sections.ts` → the `proof` object:
 *   proof.outcomes[n].metric    the figure itself (the Counter animates it
 *                               once it contains a number)
 *   proof.outcomes[n].label     what it measures
 *   proof.outcomes[n].context   the qualifying detail
 *   proof.quote.text            the quotation
 *   proof.quote.attribution     role and sector ONLY — CLAUDE.md §2 forbids
 *                               naming a customer, so never a company here
 *   proof.placeholder = false   removes the "example content" badge
 *
 * TO SHIP WITHOUT THIS SECTION, set `proof.enabled = false` in that same file.
 * The component then renders nothing and the section disappears from the page.
 * ============================================================================
 */
export function Proof() {
  if (!proof.enabled) return null;

  return (
    <Section id={proof.id} spacing="lg" tone="subtle">
      <Container width="wide">
        <Reveal>
          <div className="flex flex-wrap items-center gap-4">
            <Heading level={2} size="2xl" data-reveal="lines">
              {proof.h2}
            </Heading>
            {proof.placeholder ? (
              <Status tone="warning" data-reveal="fade">
                {proof.placeholderNotice}
              </Status>
            ) : null}
          </div>

          {proof.placeholder ? (
            <Text tone="muted" className="mt-5 max-w-[62ch]" data-reveal="fade">
              {proof.intro}
            </Text>
          ) : null}

          <dl className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8" data-reveal="group">
            {proof.outcomes.map((outcome) => (
              <div key={outcome.label} className="border-t border-border-strong pt-6">
                <dd>
                  <Counter
                    value={outcome.metric}
                    className="font-display text-5xl font-semibold text-fg tabular-nums"
                  />
                </dd>
                <dt className="mt-3 text-sm font-medium text-fg">{outcome.label}</dt>
                <dd className="mt-2 max-w-[28ch] text-sm text-fg-muted">{outcome.context}</dd>
              </div>
            ))}
          </dl>

          <figure className="mt-16 border-t border-border-strong pt-10" data-reveal="rise">
            <blockquote>
              <Text size="lg" measure={false} className="max-w-[52ch] font-display text-xl">
                {proof.quote.text}
              </Text>
            </blockquote>
            <figcaption className="mt-5 text-sm text-fg-muted">
              {proof.quote.attribution}
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </Section>
  );
}
