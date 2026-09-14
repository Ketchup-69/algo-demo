import type { Metadata } from "next";
import NextLink from "next/link";
import { Container, Heading, Section, Text } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { blogTeaser } from "@/content/sections";
import { formatDate, getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: blogTeaser.h2,
  description: blogTeaser.intro,
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main id="main" className="flex-1">
      <Section spacing="lg" className="pt-14 sm:pt-20 lg:pt-24">
        <Container width="wide">
          <Reveal start="top 100%">
            <Heading level={1} size="3xl" data-reveal="lines">
              {blogTeaser.h2}
            </Heading>
            <Text tone="muted" size="lg" className="mt-6 max-w-[52ch]" data-reveal="fade">
              {blogTeaser.intro}
            </Text>

            <ul className="mt-16 flex flex-col" data-reveal="group">
              {posts.map((post) => (
                <li key={post.slug} className="border-t border-border last:border-b">
                  <NextLink
                    href={`/blog/${post.slug}`}
                    className="group grid gap-2 py-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:grid-cols-[minmax(0,16ch)_minmax(0,1fr)] sm:gap-8"
                  >
                    <time
                      dateTime={post.date}
                      className="text-sm text-fg-muted tabular-nums"
                    >
                      {formatDate(post.date)}
                    </time>
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-fg underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-200 group-hover:decoration-accent">
                        {post.title}
                      </h2>
                      <Text tone="muted" measure={false} className="mt-3 max-w-[62ch]">
                        {post.description}
                      </Text>
                    </div>
                  </NextLink>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
