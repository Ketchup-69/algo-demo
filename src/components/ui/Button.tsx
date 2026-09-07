import type { ComponentPropsWithoutRef, ReactNode } from "react";
import NextLink from "next/link";
import { cn } from "@/lib/cn";

/**
 * Three variants, deliberately. A fourth is nearly always a sign the page is
 * asking for too many things at once.
 *
 * `primary` is an ink fill, not a blue one. Solid brand blue cannot carry an
 * accessible label in either direction — white on #3978e8 is 4.18 and ink on
 * it is 3.69, both under the 4.5 floor. Ink fill with a paper label is 14.79,
 * and it frees blue up to mean "link", which is the more restrained read.
 *
 * Note there is no arrow in any label style here. CLAUDE.md §4 calls a `→`
 * glued onto every button an AI-generated tell; if a specific button earns a
 * directional glyph, it passes one in as a child.
 */
const variants = {
  primary: cn(
    "bg-grad-primary text-accent-contrast",
    "shadow-raised",
    "hover:opacity-90",
  ),
  secondary: cn(
    "bg-surface text-fg",
    "border border-border-strong",
    "hover:bg-bg-subtle",
  ),
  ghost: cn("text-accent", "hover:bg-accent-soft"),
} as const;

const sizes = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-12 px-6 text-base",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

const base = cn(
  "inline-flex items-center justify-center gap-2",
  "rounded-lg font-medium whitespace-nowrap",
  "transition-[opacity,background-color,color] duration-150",
  // The ring is a solid accent, never a gradient — an indicator has to read
  // the same at every point along its path.
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  "disabled:pointer-events-none disabled:opacity-50",
);

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
};

type ButtonAsButton = SharedProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof SharedProps> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof SharedProps> & {
    href: string;
    /** Set for anything leaving the site, including `mailto:`. */
    external?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (typeof props.href === "string") {
    const { href, external, ...rest } = props as ButtonAsLink;
    // `mailto:` is how every form and CTA on this site resolves (§7), so it
    // counts as leaving.
    const leavesSite = external ?? !href.startsWith("/");

    if (leavesSite) {
      return (
        <a
          href={href}
          rel="noopener noreferrer"
          {...(href.startsWith("http") ? { target: "_blank" } : {})}
          className={classes}
          {...rest}
        />
      );
    }
    return <NextLink href={href} className={classes} {...rest} />;
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return <button type={type} className={classes} {...rest} />;
}
