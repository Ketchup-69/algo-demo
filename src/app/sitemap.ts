import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getAllPosts } from "@/lib/posts";

/** Static export: emitted once at build time as /sitemap.xml. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  // Placeholder posts are noindex, like the legal placeholders, so they
  // stay out of the sitemap and do not seed anyone's lastmod.
  const posts = getAllPosts().filter((post) => !post.placeholder);
  const newest = posts[0]?.date ? new Date(posts[0].date) : new Date();

  return [
    { url: `${base}/`, lastModified: newest, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/blog/`, lastModified: newest, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}/`,
      lastModified: post.date ? new Date(post.date) : newest,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
