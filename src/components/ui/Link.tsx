import type { ComponentPropsWithoutRef } from "react";
import NextLink from "next/link";
import { cn } from "@/lib/cn";

type LinkProps = {
  href: string;
  /** Force external treatment — needed for `mailto:` and anchors off-site. */
  external?: boolean;
  /** Drop the accent colour and inherit, for links inside a paragraph run. */
  subtle?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "href">;

/**
 * Internal navigation goes through next/link so the static export still
 * prefetches; everything else falls through to a plain anchor with the safe
 * rel. `mailto:` counts as external.
 */
export function Link({
  href,
  external,
  subtle = false,
  className,
  ...props
}: LinkProps) {
  const classes = cn(
    "underline decoration-1 underline-offset-[3px]",
    "transition-colors duration-150",
    subtle
      ? "text-inherit decoration-border-strong hover:decoration-current"
      : "text-accent decoration-accent/40 hover:decoration-accent",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    className,
  );

  const leavesSite = external ?? !href.startsWith("/");

  if (leavesSite) {
    return (
      <a
        href={href}
        rel="noopener noreferrer"
        {...(href.startsWith("http") ? { target: "_blank" } : {})}
        className={classes}
        {...props}
      />
    );
  }

  return <NextLink href={href} className={classes} {...props} />;
}
