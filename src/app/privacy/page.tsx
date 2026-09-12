import type { Metadata } from "next";
import { Nav, Footer } from "@/components/layout";
import { Container, Heading, Lede, Section } from "@/components/ui";
import { legalPages } from "@/content/sections";

const page = legalPages.privacy;

export const metadata: Metadata = {
  title: page.title,
  // Placeholder pages should not be indexed while they say nothing.
  robots: { index: false, follow: true },
};

/** PLACEHOLDER: edit src/content/sections.ts → legalPages.privacy */
export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Section spacing="lg" className="pt-12 sm:pt-16">
          <Container width="prose">
            <Heading level={1} size="2xl">
              {page.title}
            </Heading>
            <Lede className="mt-5">{page.note}</Lede>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
