import { Nav, Footer } from "@/components/layout";
import {
  Hero,
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
 * Nothing here animates. Phase 2 adds the hero sequence and the one signature
 * scroll moment; all copy already exists in the static HTML, which is the
 * constraint that keeps it crawlable (§5).
 */
export default function Home() {
  const posts = getAllPosts();

  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
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
      <Footer />
    </>
  );
}
