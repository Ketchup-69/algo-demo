import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * A status badge: a raw brand colour as the fill, an ink label on top.
 *
 * Two rules are baked in rather than documented and hoped for.
 *
 * First, the label always sits ON the fill, never beside it as coloured text.
 * The brand green, amber and coral measure 2.33, 1.86 and 3.02 as text on
 * paper — far under AA. As fills carrying an ink label they are 6.35, 7.96 and
 * 4.90. Keeping the colour in the background is what lets it stay the actual
 * brand colour instead of a darkened approximation.
 *
 * Second, there is no dot-only variant. Against a light ground these fills are
 * 1.86-3.02 as shapes, so a bare dot would be hard to see; worse, a dot alone
 * conveys its meaning purely by colour, which fails WCAG 1.4.1 no matter how
 * the contrast works out. Every status carries a word.
 *
 * The border exists for the same reason — it gives the badge an edge on a
 * light ground where the fill itself is nearly the same value as the paper.
 */
const tones = {
  success: "bg-success text-status-contrast border-success",
  warning: "bg-warning text-status-contrast border-warning",
  danger: "bg-danger text-status-contrast border-danger",
  /** For a state that is not success/warning/danger — pending, unknown, idle. */
  neutral: "bg-surface text-fg border-border-strong",
} as const;

export type StatusTone = keyof typeof tones;

type StatusProps = {
  tone?: StatusTone;
} & Omit<ComponentPropsWithoutRef<"span">, "color">;

export function Status({
  tone = "neutral",
  className,
  children,
  ...props
}: StatusProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border",
        "px-2.5 py-0.5 text-sm font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
