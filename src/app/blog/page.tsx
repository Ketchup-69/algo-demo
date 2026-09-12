import type { Metadata } from "next";
import NextLink from "next/link";
import { Nav, Footer } from "@/components/layout";
import { Container, Heading, Lede, Section, Text } from "@/components/ui";
import { blogTeaser } from "@/content/sections";
import { formatDate, getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: blogTeaser.h2,
  description: blogTeaser.intro,
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <Nav />
      <main id="main">
        <Section spacing="lg" className="pt-12 sm:pt-16">
          <Container width="wide">
            <Heading level={1} size="2xl">
              {blogTeaser.h2}
            </Heading>
            <Lede className="mt-5">{blogTeaser.intro}</Lede>

            <ul className="mt-14 flex flex-col">
              {posts.map((post) => (
                <li key={post.slug} className="border-t border-border last:border-b">
                  <NextLink
                    href={`/blog/${post.slug}`}
                    className="group grid gap-2 py-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:grid-cols-[minmax(0,14ch)_minmax(0,1fr)] sm:gap-8"
                  >
                    <time
                      dateTime={post.date}
                      className="text-sm text-fg-muted tabular-nums"
                    >
                      {formatDate(post.date)}
                    </time>
                    <div>
                      <h2 className="font-display text-xl font-semibold text-fg underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-accent">
                        {post.title}
                      </h2>
                      <Text tone="muted" size="sm" measure={false} className="mt-2 max-w-[62ch]">
                        {post.description}
                      </Text>
                    </div>
                  </NextLink>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
