"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { Button, Container, Heading, Section, Text } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { contact } from "@/content/sections";
import { buildMailto, site } from "@/content/site";

type Errors = Partial<Record<string, string>>;
type Composed = { subject: string; body: string; href: string };
type Copied = "address" | "message" | "failed" | null;

/**
 * The `mailto:` composer (CLAUDE.md §7).
 *
 * A real, validated form. On a clean submit it builds a structured subject
 * and a body listing every field, opens the visitor's email app through a
 * `mailto:` URL, and swaps in a panel that repeats the address and the full
 * message with copy buttons — because `mailto:` fails silently for anyone on
 * webmail without a handler, and they must still be able to send it.
 *
 * Every "Talk to us" on the site lands here, so this is the only place the
 * composer exists. The address itself is one constant in src/content/site.ts.
 */
export function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [composed, setComposed] = useState<Composed | null>(null);
  const [copied, setCopied] = useState<Copied>(null);
  const panelHeading = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const addressRef = useRef<HTMLElement>(null);
  const messageRef = useRef<HTMLPreElement>(null);
  const wasComposed = useRef(false);

  // Focus follows the state change: into the panel when it appears, back to
  // the form's first field when the visitor comes back to edit. The form
  // stays mounted (hidden) while the panel shows, so what they typed is
  // still there when they return.
  useEffect(() => {
    if (composed) {
      panelHeading.current?.focus();
      wasComposed.current = true;
    } else if (wasComposed.current) {
      wasComposed.current = false;
      formRef.current?.querySelector<HTMLElement>("input, textarea")?.focus();
    }
  }, [composed]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(null), copied === "failed" ? 4000 : 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  function validate(data: FormData): Errors {
    const next: Errors = {};
    for (const field of contact.fields) {
      const value = String(data.get(field.name) ?? "").trim();
      if (field.required && !value) {
        next[field.name] = contact.errors.required;
        continue;
      }
      // Deliberately permissive: the point is to catch a typo, not to police
      // which addresses are allowed to exist.
      if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        next[field.name] = contact.errors.email;
      }
    }
    return next;
  }

  function compose(data: FormData): Composed | null {
    const value = (name: string) => String(data.get(name) ?? "").trim();
    // Function replacers: a "$&" typed into a field is text, not a pattern.
    const subject = contact.subjectTemplate
      .replace("{name}", () => value("name"))
      .replace("{company}", () => value("company"));
    const body = contact.fields
      .map((field) =>
        field.type === "textarea"
          ? `${field.label}\n${value(field.name)}`
          : `${field.label}: ${value(field.name)}`,
      )
      .join("\n");
    const href = buildMailto({ subject, body });
    return href ? { subject, body, href } : null;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = contact.fields.find((f) => found[f.name]);
      if (first) document.getElementById(first.name)?.focus();
      return;
    }
    const next = compose(data);
    if (!next) return;
    setComposed(next);
    // Same tab, so a popup blocker never gets a say. The page stays put; the
    // panel is what the visitor sees when they come back from their mail app.
    window.location.href = next.href;
  }

  async function copy(kind: "address" | "message", text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      return;
    } catch {
      // Clipboard unavailable or refused. Select the text on screen instead
      // and say so, so the visitor can copy it themselves.
    }
    const node = kind === "address" ? addressRef.current : messageRef.current;
    if (node) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(node);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    setCopied("failed");
  }

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full rounded-lg border bg-surface px-3.5 py-3 text-base text-fg",
      "transition-[border-color,box-shadow] duration-150 placeholder:text-fg-muted",
      "hover:border-fg-muted",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      hasError ? "border-danger" : "border-border-strong",
    );

  return (
    <Section id={contact.id} spacing="lg" className="border-t border-border">
      <Container width="wide">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-24">
            <div>
              <Heading level={2} size="3xl" className="max-w-[16ch]" data-reveal="lines">
                {contact.h2}
              </Heading>
              <Text tone="muted" size="lg" className="mt-6 max-w-[40ch]" data-reveal="fade">
                {contact.body}
              </Text>
            </div>

            <div data-reveal="rise">
              {composed ? (
                <div
                  className="motion-safe:animate-panel-in rounded-2xl border border-border bg-surface p-6 shadow-raised sm:p-8"
                  aria-live="polite"
                >
                  <h3
                    ref={panelHeading}
                    tabIndex={-1}
                    className="font-display text-xl font-semibold text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {contact.composer.title}
                  </h3>
                  <Text tone="muted" className="mt-3">
                    {contact.composer.body}
                  </Text>

                  <dl className="mt-8 flex flex-col gap-6">
                    <div>
                      <dt className="text-sm font-medium text-fg">{contact.composer.addressLabel}</dt>
                      <dd className="mt-2 flex flex-wrap items-center gap-3">
                        <code ref={addressRef} className="rounded-md bg-bg-subtle px-2.5 py-1.5 font-mono text-sm text-fg">
                          {site.contactEmail}
                        </code>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => copy("address", site.contactEmail)}
                        >
                          {copied === "address" ? contact.composer.copied : contact.composer.copyAddress}
                        </Button>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-fg">{composed.subject}</dt>
                      <dd className="mt-2">
                        <pre ref={messageRef} className="max-h-64 overflow-auto rounded-md bg-bg-subtle px-3.5 py-3 font-body text-sm leading-relaxed whitespace-pre-wrap text-fg-muted">
                          {composed.body}
                        </pre>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => copy("message", `${composed.subject}\n\n${composed.body}`)}
                          >
                            {copied === "message" ? contact.composer.copied : contact.composer.copyMessage}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setComposed(null)}>
                            {contact.composer.edit}
                          </Button>
                        </div>
                        {copied === "failed" ? (
                          <p role="status" className="mt-3 text-sm text-fg-muted">
                            {contact.composer.copyFailed}
                          </p>
                        ) : null}
                      </dd>
                    </div>
                  </dl>
                </div>
              ) : null}
              {/* Mounted throughout so typed values survive a round trip to
                  the panel; `hidden` takes it out of the tab order and the
                  accessibility tree while the panel is shown. */}
              <form
                ref={formRef}
                noValidate
                onSubmit={onSubmit}
                hidden={composed !== null}
                className="flex flex-col gap-5"
              >
                  {contact.fields.map((field) => {
                    const error = errors[field.name];
                    const describedBy = error ? `${field.name}-error` : undefined;
                    return (
                      <div key={field.name}>
                        <label
                          htmlFor={field.name}
                          className="mb-2 block text-sm font-medium text-fg"
                        >
                          {field.label}
                          {field.required ? (
                            <span aria-hidden="true" className="text-fg-muted">
                              {" "}
                              {site.ui.requiredMarker}
                            </span>
                          ) : null}
                        </label>

                        {field.type === "textarea" ? (
                          <textarea
                            id={field.name}
                            name={field.name}
                            rows={5}
                            required={field.required}
                            aria-invalid={error ? true : undefined}
                            aria-describedby={describedBy}
                            className={inputClass(Boolean(error))}
                          />
                        ) : (
                          <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            required={field.required}
                            autoComplete={field.autoComplete}
                            aria-invalid={error ? true : undefined}
                            aria-describedby={describedBy}
                            className={inputClass(Boolean(error))}
                          />
                        )}

                        {/* The error answers an action, so it is worth
                            animating: it appears where the eye already is.
                            role="alert" is what actually announces it. */}
                        {error ? (
                          <p
                            id={describedBy}
                            role="alert"
                            className="motion-safe:animate-field-error mt-2 text-sm text-fg"
                          >
                            {error}
                          </p>
                        ) : null}
                      </div>
                    );
                  })}

                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <Button type="submit" size="lg">
                      {contact.submitLabel}
                    </Button>
                    <Text tone="muted" size="sm" measure={false}>
                      {contact.submitNote}
                    </Text>
                  </div>
                </form>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
