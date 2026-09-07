import { Container, Heading, Lede, Link, Section, ThemeToggle } from "@/components/ui";
import { site } from "@/content/site";

/**
 * Holding page. Phase 0 builds the system, not the site — every real section
 * arrives in a later phase, and this file gets replaced wholesale when it does.
 */
export default function Home() {
  return (
    <main id="main" className="flex flex-1 flex-col justify-center">
      <Section spacing="lg">
        <Container width="prose">
          <div className="mb-10 flex justify-end">
            <ThemeToggle />
          </div>
          <Heading level={1} size="2xl">
            {site.name}
          </Heading>
          <Lede className="mt-5">
            Foundation only. The design system, tokens and primitives are in
            place; page content is built in a later phase.
          </Lede>
          <p className="mt-8 text-base text-fg-muted">
            <Link href="/styleguide">View the styleguide</Link>
          </p>
        </Container>
      </Section>
    </main>
  );
}
