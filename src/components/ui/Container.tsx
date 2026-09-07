import type { ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

const widths = {
  /** Long-form reading. Stays under 75 characters per CLAUDE.md §4. */
  prose: "max-w-[68ch]",
  /** The default page column. */
  default: "max-w-[75rem]",
  /** Full-bleed-ish content: wide tables, the agent visual. */
  wide: "max-w-[90rem]",
} as const;

export type ContainerWidth = keyof typeof widths;

type ContainerProps<T extends ElementType> = {
  as?: T;
  width?: ContainerWidth;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * Horizontal column and gutters. Gutters start at 20px so the site holds at
 * 360px, and open up from `sm` onward.
 */
export function Container<T extends ElementType = "div">({
  as,
  width = "default",
  className,
  ...props
}: ContainerProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        widths[width],
        className,
      )}
      {...props}
    />
  );
}
