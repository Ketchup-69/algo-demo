import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Container, Heading, Link, ReadingProgress, Section } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { site } from "@/content/site";
import { formatDate, getAllPosts, getPost, readingTime } from "@/lib/posts";

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
    // A placeholder post renders but is not offered to search (see posts.ts).
    ...(post.meta.placeholder ? { robots: { index: false, follow: true } } : {}),
    // A nested `openGraph` replaces the layout's wholesale rather than
    // merging, so the shared fields are repeated here and the social card is
    // named explicitly (the file convention only applies to the layout).
    openGraph: {
      type: "article",
      siteName: site.name,
      locale: "en_GB",
      title: post.meta.title,
      description: post.meta.description,
      publishedTime: post.meta.date,
      images: ["/opengraph-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.description,
    },
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
      className="mt-14 mb-5 font-display text-2xl font-semibold text-fg"
      {...props}
    />
  ),
  h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-10 mb-3 font-display text-xl font-semibold text-fg"
      {...props}
    />
  ),
  p: (props: React.ComponentPropsWithoutRef<"p">) => (
    <p className="mb-6 max-w-[68ch] text-lg text-fg-muted" {...props} />
  ),
  ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-6 ml-5 flex list-disc flex-col gap-2 text-lg text-fg-muted" {...props} />
  ),
  ol: (props: React.ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-6 ml-5 flex list-decimal flex-col gap-2 text-lg text-fg-muted" {...props} />
  ),
  a: (props: React.ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-accent underline decoration-accent/40 underline-offset-[3px] hover:decoration-accent"
      {...props}
    />
  ),
  blockquote: (props: React.ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="my-8 border-l-2 border-accent pl-6 font-display text-xl text-fg" {...props} />
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
    <main id="main" className="flex-1">
      <ReadingProgress target="[data-article]" />
      <Section spacing="lg" className="pt-14 sm:pt-20 lg:pt-24">
        <Container width="prose">
          <Link href="/blog" className="text-sm">
            {site.ui.backToWriting}
          </Link>

          <article className="mt-10" data-article>
            <Reveal start="top 100%">
              <header>
                <p className="flex flex-wrap gap-x-4 text-sm text-fg-muted tabular-nums" data-reveal="fade">
                  <time dateTime={post.meta.date}>{formatDate(post.meta.date)}</time>
                  <span>{site.ui.readingTime(readingTime(post.content))}</span>
                </p>
                <Heading level={1} size="3xl" className="mt-4" data-reveal="lines">
                  {post.meta.title}
                </Heading>
              </header>
              <div className="mt-12" data-reveal="fade">
                <MDXRemote source={post.content} components={mdxComponents} />
              </div>
            </Reveal>
          </article>
        </Container>
      </Section>
    </main>
  );
}
