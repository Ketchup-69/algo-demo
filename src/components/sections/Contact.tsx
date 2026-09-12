"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { Button, Container, Heading, Section, Text } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { contact } from "@/content/sections";

type Errors = Partial<Record<string, string>>;

/**
 * A real, validated form whose submit is deliberately stubbed.
 *
 * CLAUDE.md §7 makes every form a `mailto:` composer, and the Phase 1 brief
 * defers that to Phase 3. So validation is genuine — required fields, a real
 * email check, errors wired to inputs via aria-describedby and aria-invalid —
 * and only the final dispatch is a no-op. Building the validation now means
 * Phase 3 only has to swap what happens after `validate()` returns clean.
 */
export function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

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

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(new FormData(event.currentTarget));
    setErrors(found);
    setSubmitted(Object.keys(found).length === 0);
    if (Object.keys(found).length > 0) {
      const first = contact.fields.find((f) => found[f.name]);
      if (first) document.getElementById(first.name)?.focus();
    }
    // PHASE 3: build the mailto: composer here from site.buildMailto() and
    // open it, then render the copy-to-clipboard fallback line (§7).
  }

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full rounded-md border bg-surface px-3 py-2.5 text-base text-fg",
      "transition-colors placeholder:text-fg-muted",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      hasError ? "border-danger" : "border-border-strong",
    );

  return (
    <Section id={contact.id} spacing="lg">
      <Container width="wide">
        <Reveal>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,30ch)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Heading level={2} size="2xl">
              {contact.h2}
            </Heading>
            <Text tone="muted" size="lg" className="mt-6">
              {contact.body}
            </Text>
          </div>

          <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
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
                        *
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

                  {/*
                    The error message answers an action, so it is worth
                    animating: it appears where the eye already is, and the
                    movement says "this just changed" rather than "this was
                    always here". role="alert" is what actually announces it.
                  */}
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

            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" size="lg">
                {contact.submitLabel}
              </Button>
              <Text tone="muted" size="sm" measure={false}>
                {contact.stubNotice}
              </Text>
            </div>

            {/* Announced to screen readers when validation passes. */}
            <p role="status" aria-live="polite" className="sr-only">
              {submitted ? "Form is valid. Submission is not yet wired up." : ""}
            </p>
          </form>
        </div>
        </Reveal>
      </Container>
    </Section>
  );
}
