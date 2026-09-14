import { Container, Heading, Section, Text } from "@/components/ui";
import { ProcessSequence, Reveal } from "@/components/motion";
import { howItWorks } from "@/content/sections";
import { ProcessScene } from "./ProcessScene";

/**
 * The only numbered section on the page. CLAUDE.md §4 bans `01 / 02 / 03`
 * markers on content that is not an actual sequence — this one is, so the
 * numbering is doing real work here and must not be copied elsewhere.
 *
 * It also carries the page's one signature scroll moment: the scene holds
 * still (CSS sticky, native scroll) while the steps pass, and changes state as
 * each step reaches the reading line. See ProcessSequence for why it is not
 * pinned. On small screens the scene sticks to the top of the viewport and the
 * steps scroll beneath it, so the DOM order is scene first, steps second, and
 * the grid reorders them on large screens.
 */
export function HowItWorks() {
  return (
    <Section id={howItWorks.id} spacing="lg" tone="subtle">
      <Container width="wide">
        <Reveal>
          <Heading level={2} size="3xl" className="max-w-[22ch]" data-reveal="lines">
            {howItWorks.h2}
          </Heading>
        </Reveal>

        <ProcessSequence>
          <div className="mt-12 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
            {/* The scene. Sticky in both axes: top on small screens, in its
                column on large ones. The wrapper carries the section's ground
                so the steps disappear cleanly beneath it on mobile. */}
            {/* `lg:self-start` is load-bearing: a grid item stretches to the
                row by default, and a sticky element as tall as its container
                has nowhere to travel. `top-[65px]` is the header (h-16 plus
                its hairline), so no strip of copy shows between the two. */}
            <div
              data-scene-root
              className="sticky top-[65px] z-10 -mx-5 bg-bg-subtle px-5 pt-3 pb-4 sm:-mx-6 sm:px-6 lg:order-2 lg:top-28 lg:mx-0 lg:self-start lg:bg-transparent lg:p-0"
            >
              {/* On tablets the panel is capped so the steps keep room to be
                  read beneath it. */}
              <div className="sm:max-lg:mx-auto sm:max-lg:max-w-lg">
                <ProcessScene />
              </div>
            </div>

            <div className="relative lg:order-1" data-step-list>
              {/* The rail the steps hang off. Decorative, so hidden from
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
                    className="relative py-10 pl-10 sm:pl-16 lg:py-14"
                  >
                    <span
                      aria-hidden="true"
                      data-step-marker
                      className="absolute top-[2.9rem] left-0 size-[15px] rounded-full border-2 border-accent bg-bg-subtle sm:size-[23px] lg:top-[3.9rem]"
                    />
                    <span
                      aria-hidden="true"
                      className="mb-3 block font-display text-sm font-semibold text-accent tabular-nums"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-fg">
                      {step.title}
                    </h3>
                    <Text tone="muted" size="lg" measure={false} className="mt-4 max-w-[52ch]">
                      {step.description}
                    </Text>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </ProcessSequence>
      </Container>
    </Section>
  );
}
