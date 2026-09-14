import { Container, Section, Text } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { logos } from "@/content/sections";

/**
 * PLACEHOLDER: replace when client logos are approved.
 *
 * A quiet strip under the hero. While `logos.placeholder` is true every tile
 * is an empty dashed frame with a neutral label and the strip says so — no
 * name, no mark, no invented client (§2). Once the owner fills `name` and
 * `src` on each slot and flips the flag, the same tiles render the logos as
 * plain images at reduced opacity, which is how the reference sites treat a
 * logo row: present, not shouting.
 *
 * `logos.enabled = false` removes the strip entirely.
 */
export function Logos() {
  if (!logos.enabled) return null;

  return (
    <Section id={logos.id} spacing="sm" className="border-t border-border">
      <Container width="wide">
        <Reveal>
          {logos.placeholder ? (
            <Text tone="muted" size="sm" measure={false} data-reveal="fade">
              {logos.placeholderNote}
            </Text>
          ) : null}
          <ul
            className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4"
            data-reveal="group"
          >
            {logos.slots.map((slot, i) => (
              <li
                key={i}
                className={
                  slot.src
                    ? "flex h-14 items-center justify-center"
                    : "border-dashed-placeholder flex h-14 items-center justify-center rounded-lg"
                }
              >
                {slot.src ? (
                  // eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized by design (§3)
                  <img
                    src={slot.src}
                    alt={slot.name}
                    className="max-h-8 w-auto opacity-70 transition-opacity hover:opacity-100"
                  />
                ) : (
                  <span aria-hidden="true" className="text-xs text-fg-muted">
                    {logos.slotLabel}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
