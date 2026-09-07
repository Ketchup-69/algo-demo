import type { ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Vertical rhythm lives here and only here.
 *
 * Padding is chosen by a named step rather than passed as raw utilities. That
 * matters for two reasons:
 *
 *  1. Tailwind utilities share a specificity, so a caller's `py-12` and this
 *     component's `py-24` are resolved by stylesheet order, not class-string
 *     order — the override silently loses. Everything routes through `cn()`
 *     (tailwind-merge), which deletes the losing class instead of leaving both
 *     in play.
 *  2. Adjacent sections each contributing their own full padding is how pages
 *     end up with 200px of accidental dead space. Naming the steps keeps the
 *     scale small enough to reason about, and `spacing="none"` exists so two
 *     sections can deliberately butt together.
 */
const spacings = {
  none: "",
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-20 lg:py-24",
  lg: "py-24 sm:py-32 lg:py-40",
} as const;

const tones = {
  /** Inherits whatever ground it sits on. */
  none: "",
  bg: "bg-bg text-fg",
  subtle: "bg-bg-subtle text-fg",
  surface: "bg-surface text-fg",
  /** The tinted panel from the gradient tier. */
  accent: "bg-grad-accent-soft text-fg",
} as const;

export type SectionSpacing = keyof typeof spacings;
export type SectionTone = keyof typeof tones;

type SectionProps<T extends ElementType> = {
  as?: T;
  spacing?: SectionSpacing;
  tone?: SectionTone;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export function Section<T extends ElementType = "section">({
  as,
  spacing = "md",
  tone = "none",
  className,
  ...props
}: SectionProps<T>) {
  const Component = (as ?? "section") as ElementType;
  return (
    <Component
      className={cn(spacings[spacing], tones[tone], className)}
      {...props}
    />
  );
}
