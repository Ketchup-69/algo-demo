import type { NextConfig } from "next";

/**
 * Deploy target is GitHub Pages, so the whole site is a static export.
 *
 * `NEXT_PUBLIC_BASE_PATH` is the single switch between
 * `user.github.io/algo-demo` (set it to `/algo-demo`) and a custom domain
 * (leave it unset). Empty by default so `next dev` and a future apex domain
 * both work with no edit here.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  // `assetPrefix: ""` is not the same as leaving it undefined, so only set it
  // when there is an actual prefix to apply.
  assetPrefix: basePath || undefined,
};

export default nextConfig;
