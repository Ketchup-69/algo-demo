import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Posts are MDX files on disk, read at build time. The site is a static export
 * (§3), so there is no runtime filesystem access — everything here runs during
 * `next build` and is baked into HTML.
 */
export type PostMeta = {
  title: string;
  description: string;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  slug: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function readPostFile(filename: string) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const slug = String(data.slug ?? filename.replace(/\.mdx?$/, ""));
  return {
    meta: {
      title: String(data.title ?? "Untitled"),
      description: String(data.description ?? ""),
      date: String(data.date ?? ""),
      slug,
    } satisfies PostMeta,
    content,
  };
}

/** Every post, newest first. */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => readPostFile(f).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string) {
  if (!fs.existsSync(POSTS_DIR)) return null;
  const filename = fs
    .readdirSync(POSTS_DIR)
    .find((f) => readPostFile(f).meta.slug === slug);
  return filename ? readPostFile(filename) : null;
}

/** Formats a post date for display, stable across locales. */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}
