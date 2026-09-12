import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Nav, Footer } from "@/components/layout";
import { Container, Heading, Link, Section } from "@/components/ui";
import { formatDate, getAllPosts, getPost } from "@/lib/posts";

/** Static export needs every slug known at build time. */
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.description,
  };
}

/**
 * Post template. Prose styling lives here rather than in globals so the token
 * layer stays about tokens — MDX emits plain tags, and these map them onto the
 * type scale.
 */
const mdxComponents = {
  h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-12 mb-4 font-display text-xl font-semibold text-fg"
      {...props}
    />
  ),
  h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-10 mb-3 font-display text-lg font-semibold text-fg"
      {...props}
    />
  ),
  p: (props: React.ComponentPropsWithoutRef<"p">) => (
    <p className="mb-5 max-w-[68ch] text-base text-fg-muted" {...props} />
  ),
  ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-5 ml-5 flex list-disc flex-col gap-2 text-fg-muted" {...props} />
  ),
  ol: (props: React.ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-5 ml-5 flex list-decimal flex-col gap-2 text-fg-muted" {...props} />
  ),
  a: (props: React.ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-accent underline decoration-accent/40 underline-offset-[3px] hover:decoration-accent"
      {...props}
    />
  ),
  code: (props: React.ComponentPropsWithoutRef<"code">) => (
    <code
      className="rounded bg-bg-subtle px-1.5 py-0.5 font-mono text-sm text-fg"
      {...props}
    />
  ),
};

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <main id="main">
        <Section spacing="lg" className="pt-12 sm:pt-16">
          <Container width="prose">
            <Link href="/blog" className="text-sm">
              Back to writing
            </Link>

            <article className="mt-8">
              <header>
                <time
                  dateTime={post.meta.date}
                  className="text-sm text-fg-muted tabular-nums"
                >
                  {formatDate(post.meta.date)}
                </time>
                <Heading level={1} size="2xl" className="mt-3">
                  {post.meta.title}
                </Heading>
              </header>
              <div className="mt-10">
                <MDXRemote source={post.content} components={mdxComponents} />
              </div>
            </article>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
