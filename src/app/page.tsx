import {
  Hero,
  Logos,
  Problem,
  Agents,
  HowItWorks,
  BeyondFinance,
  Governance,
  Integrations,
  Proof,
  BlogTeaser,
  Contact,
} from "@/components/sections";
import { getAllPosts } from "@/lib/posts";

/**
 * One continuous page. Every section is anchored so the nav can target it, and
 * every string comes from `src/content/*` — this file holds no copy at all.
 *
 * All copy is in the static HTML. Motion is layered on by the client
 * components inside each section and never gates text (§5).
 */
export default function Home() {
  const posts = getAllPosts();

  return (
    <main id="main" className="flex-1">
      <Hero />
      <Logos />
      <Problem />
      <Agents />
      <HowItWorks />
      <BeyondFinance />
      <Governance />
      <Integrations />
      <Proof />
      <BlogTeaser posts={posts} />
      <Contact />
    </main>
  );
}
