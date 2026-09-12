import { cn } from "@/lib/cn";
import { site } from "@/content/site";

/**
 * The single swap point for the brand mark.
 *
 * PLACEHOLDER: renders the wordmark as type. When the SVG logo is approved,
 * replace the contents of the `<span>` below with the inline SVG and nothing
 * else in the codebase changes — Nav and Footer both come through here.
 *
 * Keep the `aria-label` on whatever replaces it, and keep the SVG inline
 * rather than an <img> so it inherits `currentColor` and works in both themes.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      aria-label={site.name}
      className={cn(
        "font-display text-lg font-semibold tracking-[-0.02em] text-fg",
        className,
      )}
    >
      {site.name}
    </span>
  );
}
