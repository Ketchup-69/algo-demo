"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { applyTheme, getAppliedTheme, themeStore, type Theme } from "@/lib/theme";
import { prefersReducedMotion } from "@/lib/motion";

type ThemeToggleProps = {
  className?: string;
};

/**
 * The theme is already on <html> before React boots (see ThemeScript), so this
 * subscribes to that external state rather than keeping its own copy. Reading
 * it during render instead would make the client's first render disagree with
 * the server HTML and trip a hydration warning.
 *
 * Switching runs through the View Transitions API where it exists: the new
 * theme opens as a circle from the button over the old one (the CSS is in
 * globals.css). Without the API, or under reduced motion, it is an instant
 * swap — which is also what the transition resolves to.
 *
 * Which icon shows is decided in CSS off the ancestor `data-theme` attribute,
 * so the button looks right immediately — before hydration, and with JS
 * disabled entirely.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const theme = useSyncExternalStore<Theme | null>(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot,
  );

  const toggle = useCallback(() => {
    const next: Theme = getAppliedTheme() === "dark" ? "light" : "dark";
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => unknown;
    };
    if (!doc.startViewTransition || prefersReducedMotion()) {
      applyTheme(next);
      return;
    }
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const root = document.documentElement;
      root.style.setProperty("--vt-x", `${rect.left + rect.width / 2}px`);
      root.style.setProperty("--vt-y", `${rect.top + rect.height / 2}px`);
    }
    doc.startViewTransition(() => applyTheme(next));
  }, []);

  // Neutral but still accurate until React can read the DOM, so the control is
  // never mislabelled to a screen reader.
  const label =
    theme === null
      ? site.ui.themeToggle.neutral
      : theme === "dark"
        ? site.ui.themeToggle.toLight
        : site.ui.themeToggle.toDark;

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      {...(theme !== null ? { "aria-pressed": theme === "dark" } : {})}
      className={cn(
        "relative inline-flex size-9 items-center justify-center overflow-hidden rounded-md",
        "border border-border-strong bg-surface text-fg-muted",
        "transition-colors duration-150",
        // The icon swap is the state change; the button itself only needs colour.
        "hover:bg-bg-subtle hover:text-fg",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      {/* Moon — shown in light mode, i.e. "go dark". */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-[18px] transition-[opacity,transform] duration-300 [[data-theme='dark']_&]:scale-50 [[data-theme='dark']_&]:-rotate-90 [[data-theme='dark']_&]:opacity-0 motion-reduce:transition-none [[data-theme='dark']_&]:absolute"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
      </svg>
      {/* Sun — shown in dark mode, i.e. "go light". */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="absolute size-[18px] scale-50 rotate-90 opacity-0 transition-[opacity,transform] duration-300 motion-reduce:transition-none [[data-theme='dark']_&]:relative [[data-theme='dark']_&]:scale-100 [[data-theme='dark']_&]:rotate-0 [[data-theme='dark']_&]:opacity-100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
