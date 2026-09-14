"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import NextLink from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { hero } from "@/content/sections";
import { Button } from "@/components/ui";
import { Logo } from "./Logo";

/**
 * Full-screen navigation sheet for small viewports.
 *
 * The sheet is a real modal, so it carries the obligations of one: Escape
 * closes it, the page behind it cannot scroll, focus moves into it on open and
 * returns to the trigger on close, and Tab is contained inside it while open.
 *
 * It answers a tap, so it moves — but only just. The sheet comes up from 8px,
 * and the links arrive one after another beneath it. Enter-only, in CSS: an
 * exit animation needs the node kept mounted past its own removal, which is
 * the one thing a library buys and not worth its weight for this.
 *
 * The sheet is portalled to <body>. It is `position: fixed`, and the header
 * it would otherwise live in has a backdrop-filter once the page scrolls —
 * which makes the header the containing block for fixed descendants and
 * clipped the whole menu to the header's 65px.
 *
 * Two ways out, two focus destinations. Escape and the close button return
 * focus to the button that opened the sheet. Choosing a link does not: the
 * reader has just navigated, so focus goes to the section they chose, and
 * their next Tab continues from there instead of jumping back to the top.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const follow = useCallback((href: string) => {
    setOpen(false);
    if (!href.startsWith("/#")) return;
    const target = document.getElementById(href.slice(2));
    if (!target) return;
    // The section is not focusable by default; make it so without adding it
    // to the Tab sequence, then let the browser's own anchor scroll happen.
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
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

  const iconButton = cn(
    "inline-flex size-9 items-center justify-center rounded-md",
    "border border-border-strong bg-surface text-fg-muted",
    "transition-colors hover:bg-bg-subtle hover:text-fg",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label={site.ui.openMenu}
        className={cn(iconButton, "lg:hidden")}
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

      {open ? createPortal(
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label={site.ui.menuLabel}
          className="motion-safe:animate-sheet-in fixed inset-0 z-50 flex flex-col bg-bg lg:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-5 sm:px-6">
            <Logo />
            <button
              type="button"
              onClick={close}
              aria-label={site.ui.closeMenu}
              className={iconButton}
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
            aria-label={site.ui.primaryNavLabel}
            className="flex flex-1 flex-col overflow-y-auto px-5 pt-6 sm:px-6"
          >
            {site.nav.map((item, i) => (
              <NextLink
                key={item.href}
                href={item.href}
                onClick={() => follow(item.href)}
                style={{ animationDelay: `${80 + i * 50}ms` }}
                className="motion-safe:animate-sheet-item-in border-b border-border py-5 font-display text-3xl font-semibold text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {item.label}
              </NextLink>
            ))}
            <div
              style={{ animationDelay: `${80 + site.nav.length * 50}ms` }}
              className="motion-safe:animate-sheet-item-in mt-8"
            >
              <Button
                href={hero.primaryCta.href}
                size="lg"
                className="w-full"
                onClick={() => follow(hero.primaryCta.href)}
              >
                {hero.primaryCta.label}
              </Button>
            </div>
          </nav>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
