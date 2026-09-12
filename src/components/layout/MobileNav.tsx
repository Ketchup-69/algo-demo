"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { hero } from "@/content/sections";
import { Button } from "@/components/ui";
import { Logo } from "./Logo";

/**
 * Full-screen navigation sheet for small viewports.
 *
 * No animation — it is present or it is not. The sheet is a real modal, so it
 * carries the obligations of one: Escape closes it, the page behind it cannot
 * scroll, focus moves into it on open and returns to the trigger on close, and
 * Tab is contained inside it while open.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Lock the page behind the sheet.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape to close, and keep Tab inside the sheet.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !sheetRef.current) return;
      const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Move focus into the sheet once it exists.
  useEffect(() => {
    if (!open) return;
    sheetRef.current
      ?.querySelector<HTMLElement>('a[href], button:not([disabled])')
      ?.focus();
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Open menu"
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-md lg:hidden",
          "border border-border-strong bg-surface text-fg-muted",
          "transition-colors hover:bg-bg-subtle hover:text-fg",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        )}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {/*
        The sheet answers a tap, so it moves — but only just. It comes up from
        8px rather than sliding the full height: a full-screen slide is a
        transition, and this is a disclosure. AnimatePresence keeps the element
        mounted long enough to leave; focus has already returned to the trigger
        by then, so the exit is purely visual.
      */}
      {open ? (
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="motion-safe:animate-sheet-in fixed inset-0 z-50 flex flex-col bg-bg lg:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-5 sm:px-6">
            <Logo />
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-md",
                "border border-border-strong bg-surface text-fg-muted",
                "transition-colors hover:bg-bg-subtle hover:text-fg",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav
            aria-label="Primary"
            className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 pt-4 sm:px-6"
          >
            {site.nav.map((item) => (
              <NextLink
                key={item.href}
                href={item.href}
                onClick={close}
                className="border-b border-border py-4 font-display text-2xl font-semibold text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {item.label}
              </NextLink>
            ))}
            <Button
              href={hero.primaryCta.href}
              size="lg"
              className="mt-6 w-full"
              onClick={close}
            >
              {hero.primaryCta.label}
            </Button>
          </nav>
        </div>
      ) : null}
    </>
  );
}
