import { Container, Heading, Section, Status, Text } from "@/components/ui";
import { proof } from "@/content/sections";

/**
 * ============================================================================
 * PLACEHOLDER SECTION — every value below is filler.
 *
 * TO POPULATE, edit `src/content/sections.ts` → the `proof` object:
 *   proof.outcomes[n].metric    the figure itself
 *   proof.outcomes[n].label     what it measures
 *   proof.outcomes[n].context   the qualifying detail
 *   proof.quote.text            the quotation
 *   proof.quote.attribution     role and sector ONLY — CLAUDE.md §2 forbids
 *                               naming a customer, so never a company here
 *   proof.placeholder = false   removes the "example content" badge
 *
 * TO SHIP WITHOUT THIS SECTION, set `proof.enabled = false` in that same file.
 * The component then renders nothing and the section disappears from the page.
 * That is the single flag the Phase 1 brief asked for — no JSX edit needed.
 * ============================================================================
 */
export function Proof() {
  if (!proof.enabled) return null;

  return (
    <Section id={proof.id} spacing="lg" tone="subtle">
      <Container width="wide">
        <div className="flex flex-wrap items-center gap-4">
          <Heading level={2} size="xl">
            {proof.h2}
          </Heading>
          {proof.placeholder ? (
            <Status tone="warning">{proof.placeholderNotice}</Status>
          ) : null}
        </div>

        {proof.placeholder ? (
          <Text tone="muted" className="mt-5 max-w-[62ch]">
            {proof.intro}
          </Text>
        ) : null}

        <dl className="mt-12 grid gap-10 sm:grid-cols-3">
          {proof.outcomes.map((outcome) => (
            <div key={outcome.label} className="border-t border-border-strong pt-5">
              <dd className="font-display text-4xl font-semibold text-fg tabular-nums">
                {outcome.metric}
              </dd>
              <dt className="mt-2 text-sm font-medium text-fg">{outcome.label}</dt>
              <dd className="mt-2 text-sm text-fg-muted">{outcome.context}</dd>
            </div>
          ))}
        </dl>

        <figure className="mt-14 border-t border-border-strong pt-8">
          <blockquote>
            <Text size="lg" measure={false} className="max-w-[58ch]">
              {proof.quote.text}
            </Text>
          </blockquote>
          <figcaption className="mt-4 text-sm text-fg-muted">
            {proof.quote.attribution}
          </figcaption>
        </figure>
      </Container>
    </Section>
  );
}
