import NextLink from "next/link";
import { Container, Heading, Link, Section, Text } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { blogTeaser } from "@/content/sections";
import { formatDate, type PostMeta } from "@/lib/posts";

export function BlogTeaser({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <Section id={blogTeaser.id} spacing="lg">
      <Container width="wide">
        <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Heading level={2} size="xl">
              {blogTeaser.h2}
            </Heading>
            <Text tone="muted" className="mt-4">
              {blogTeaser.intro}
            </Text>
          </div>
          <Link href={blogTeaser.allHref}>{blogTeaser.allLabel}</Link>
        </div>

        <ul className="mt-12 flex flex-col">
          {posts.slice(0, 3).map((post) => (
            <li key={post.slug} className="border-t border-border last:border-b">
              <NextLink
                href={`/blog/${post.slug}`}
                className="group grid gap-2 py-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:grid-cols-[minmax(0,14ch)_minmax(0,1fr)] sm:gap-8"
              >
                <time
                  dateTime={post.date}
                  className="text-sm text-fg-muted tabular-nums"
                >
                  {formatDate(post.date)}
                </time>
                <div>
                  <h3 className="font-display text-lg font-semibold text-fg underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-accent">
                    {post.title}
                  </h3>
                  <Text tone="muted" size="sm" measure={false} className="mt-2 max-w-[62ch]">
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
  );
}
