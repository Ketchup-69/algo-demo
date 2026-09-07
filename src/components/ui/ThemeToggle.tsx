"use client";

import { useCallback, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { applyTheme, getAppliedTheme, themeStore, type Theme } from "@/lib/theme";

type ThemeToggleProps = {
  className?: string;
};

/**
 * The theme is already on <html> before React boots (see ThemeScript), so this
 * subscribes to that external state rather than keeping its own copy. Reading
 * it during render instead would make the client's first render disagree with
 * the server HTML and trip a hydration warning.
 *
 * Which icon shows is decided in CSS off the ancestor `data-theme` attribute,
 * so the button looks right immediately — before hydration, and with JS
 * disabled entirely.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useSyncExternalStore<Theme | null>(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot,
  );

  const toggle = useCallback(() => {
    applyTheme(getAppliedTheme() === "dark" ? "light" : "dark");
  }, []);

  // Neutral but still accurate until React can read the DOM, so the control is
  // never mislabelled to a screen reader.
  const label =
    theme === null
      ? "Switch colour theme"
      : theme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      {...(theme !== null ? { "aria-pressed": theme === "dark" } : {})}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md",
        "border border-border-strong bg-surface text-fg-muted",
        "transition-colors duration-150",
        "hover:bg-bg-subtle hover:text-fg",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      {/* Moon — shown in light mode, i.e. "go dark". */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-[18px] [[data-theme='dark']_&]:hidden"
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
        className="hidden size-[18px] [[data-theme='dark']_&]:block"
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
