import type { Metadata } from "next";
import { Container, Heading, Lede, Section } from "@/components/ui";
import { legalPages } from "@/content/sections";

const page = legalPages.terms;

export const metadata: Metadata = {
  title: page.title,
  // Placeholder pages should not be indexed while they say nothing.
  robots: { index: false, follow: true },
};

/** PLACEHOLDER: edit src/content/sections.ts → legalPages.terms */
export default function TermsPage() {
  return (
    <main id="main" className="flex-1">
      <Section spacing="lg" className="pt-14 sm:pt-20 lg:pt-24">
        <Container width="prose">
          <Heading level={1} size="3xl">
            {page.title}
          </Heading>
          <Lede className="mt-6">{page.note}</Lede>
        </Container>
      </Section>
    </main>
  );
}
