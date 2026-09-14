import type { Metadata } from "next";
import { Button, Container, Heading, Section, Text } from "@/components/ui";
import { notFound } from "@/content/sections";

export const metadata: Metadata = {
  title: notFound.title,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="flex-1">
      <Section spacing="lg" className="pt-16 sm:pt-24">
        <Container width="wide">
          <Heading level={1} size="3xl" className="max-w-[16ch]">
            {notFound.title}
          </Heading>
          <Text tone="muted" size="lg" className="mt-6 max-w-[48ch]">
            {notFound.body}
          </Text>
          <Button href={notFound.cta.href} size="lg" className="mt-10">
            {notFound.cta.label}
          </Button>
        </Container>
      </Section>
    </main>
  );
}
