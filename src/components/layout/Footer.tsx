import NextLink from "next/link";
import { Button, Container, Link, Text } from "@/components/ui";
import { site } from "@/content/site";
import { Logo } from "./Logo";

/**
 * The footer opens with the invitation, at the size of a section heading,
 * and then gets quiet: three columns of small type on a hairline, and the
 * legal line at the bottom. It is the last thing a reader sees, so it carries
 * the one call to action once more and nothing else that competes with it.
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-subtle">
      <Container width="wide" className="py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-[16ch] font-display text-4xl font-semibold tracking-[-0.025em] text-fg text-balance sm:text-5xl">
            {site.tagline}
          </p>
          <Button href={site.footerCta.href} size="lg">
            {site.footerCta.label}
          </Button>
        </div>

        <div className="mt-16 grid gap-12 border-t border-border pt-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(0,1fr))] lg:gap-16 lg:pt-14">
          <div className="max-w-xs">
            <Logo />
            <Text tone="muted" size="sm" className="mt-3">
              {site.description}
            </Text>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-fg">{site.ui.footerSections}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {site.footerNav.map((item) => (
                <li key={item.href}>
                  <NextLink
                    href={item.href}
                    className="text-sm text-fg-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {item.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-fg">{site.ui.footerContact}</h2>
            {/* PLACEHOLDER: address, phone and email are realistic filler.
                Edit src/content/site.ts → site.contact */}
            <address className="mt-4 flex flex-col gap-2.5 text-sm text-fg-muted not-italic">
              {site.contact.addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
              <Link href={`tel:${site.contact.phone.replace(/\s/g, "")}`} external>
                {site.contact.phone}
              </Link>
              <Link href={`mailto:${site.contact.email}`} external>
                {site.contact.email}
              </Link>
            </address>

            <h2 className="mt-8 text-sm font-semibold text-fg">{site.ui.footerElsewhere}</h2>
            {/* PLACEHOLDER: hrefs are not real. Edit src/content/site.ts → site.social */}
            <ul className="mt-4 flex gap-5">
              {site.social.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} external className="text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Text tone="muted" size="sm" measure={false}>
            {site.legalLine}
          </Text>
          <ul className="flex gap-6">
            {site.legalNav.map((item) => (
              <li key={item.href}>
                <NextLink
                  href={item.href}
                  className="text-sm text-fg-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {item.label}
                </NextLink>
              </li>
            ))}
            <li>
              <a
                href="#top"
                className="text-sm text-fg-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {site.ui.backToTop}
              </a>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
