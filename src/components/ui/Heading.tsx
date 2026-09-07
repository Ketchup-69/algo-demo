import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Heading level and visual size are separate props on purpose.
 *
 * Document structure has to stay honest — one h1 per page, no skipped levels
 * (§8) — but the biggest type on a page is not always its h1, and a section's
 * h2 is not always the same size as the next one's. Coupling the two forces a
 * choice between correct semantics and correct typography. This decouples them:
 * `level` is for the accessibility tree, `size` is for the eye.
 *
 * There is deliberately no eyebrow prop, slot, or variant. A tracked-out
 * ALL-CAPS label above every heading is the first anti-pattern CLAUDE.md §4
 * lists, and the cheapest way not to ship it is to make it un-buildable here.
 */
const sizes = {
  xs: "text-sm font-semibold",
  sm: "text-lg font-semibold",
  md: "text-xl font-semibold",
  lg: "text-2xl font-semibold",
  xl: "text-3xl font-semibold",
  "2xl": "text-4xl font-semibold",
  "3xl": "text-5xl font-semibold",
  display: "text-6xl font-semibold",
} as const;

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = keyof typeof sizes;

/** Sensible default so `size` only has to be passed when overriding. */
const defaultSizeForLevel: Record<HeadingLevel, HeadingSize> = {
  1: "2xl",
  2: "xl",
  3: "lg",
  4: "md",
  5: "sm",
  6: "xs",
};

type HeadingProps = {
  level: HeadingLevel;
  size?: HeadingSize;
  /** Constrain to a readable measure — useful for long section intros. */
  measure?: boolean;
} & Omit<ComponentPropsWithoutRef<"h2">, "color">;

export function Heading({
  level,
  size,
  measure = false,
  className,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={cn(
        "font-display text-fg",
        sizes[size ?? defaultSizeForLevel[level]],
        measure && "measure",
        className,
      )}
      {...props}
    />
  );
}
