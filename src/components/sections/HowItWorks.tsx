import { Container, Heading, Section, Text } from "@/components/ui";
import { StepSequence } from "@/components/motion/StepSequence";
import { howItWorks } from "@/content/sections";

/**
 * The only numbered section on the page. CLAUDE.md §4 bans `01 / 02 / 03`
 * markers on content that is not an actual sequence — this one is, so the
 * numbering is doing real work here and must not be copied elsewhere.
 *
 * It also carries the page's one signature scroll moment. The rail draws down
 * and each marker resolves as its step reaches the reading line; the copy never
 * moves and is never hidden. See StepSequence for why it is not pinned.
 */
export function HowItWorks() {
  return (
    <Section id={howItWorks.id} spacing="lg" tone="subtle">
      <Container width="wide">
        <Heading level={2} size="2xl" className="max-w-[24ch]">
          {howItWorks.h2}
        </Heading>

        <StepSequence>
          <div className="relative mt-14" data-step-list>
            {/* The rail the steps hang off. Decorative, so it is hidden from
                assistive tech — the <ol> already conveys the sequence. */}
            <span
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-[7px] w-px bg-border-strong sm:left-[11px]"
            />
            <span
              aria-hidden="true"
              data-step-rail
              className="absolute top-0 bottom-0 left-[7px] w-px bg-accent sm:left-[11px]"
            />

            <ol className="flex flex-col">
              {howItWorks.steps.map((step, i) => (
                <li
                  key={step.title}
                  data-step
                  className="relative grid gap-3 py-8 pl-10 sm:grid-cols-[minmax(0,22ch)_minmax(0,1fr)] sm:gap-10 sm:pl-16"
                >
                  <span
                    aria-hidden="true"
                    data-step-marker
                    className="absolute top-[2.4rem] left-0 size-[15px] rounded-full border-2 border-accent bg-bg-subtle sm:size-[23px]"
                  />
                  <div>
                    <span
                      aria-hidden="true"
                      data-step-index
                      className="mb-2 block font-display text-sm font-semibold text-accent tabular-nums"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-fg">
                      {step.title}
                    </h3>
                  </div>
                  <Text tone="muted" measure={false} className="max-w-[62ch] sm:pt-7">
                    {step.description}
                  </Text>
                </li>
              ))}
            </ol>
          </div>
        </StepSequence>
      </Container>
    </Section>
  );
}
