import type { ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

const sizes = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
} as const;

const tones = {
  default: "text-fg",
  muted: "text-fg-muted",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
} as const;

export type TextSize = keyof typeof sizes;
export type TextTone = keyof typeof tones;

type TextProps<T extends ElementType> = {
  as?: T;
  size?: TextSize;
  tone?: TextTone;
  /** Cap the line length. On by default — §4 wants body under 75 characters. */
  measure?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "color">;

export function Text<T extends ElementType = "p">({
  as,
  size = "base",
  tone = "default",
  measure = true,
  className,
  ...props
}: TextProps<T>) {
  const Component = (as ?? "p") as ElementType;
  return (
    <Component
      className={cn(
        "font-body",
        sizes[size],
        tones[tone],
        measure && "measure",
        className,
      )}
      {...props}
    />
  );
}

/**
 * The paragraph directly under a heading. Larger and quieter than body copy,
 * on a shorter measure so it reads as a single held breath rather than a
 * block of text.
 */
export function Lede({
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<"p">, "color">) {
  return (
    <p
      className={cn(
        "font-body text-lg text-fg-muted max-w-[58ch]",
        className,
      )}
      {...props}
    />
  );
}
