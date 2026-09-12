import NextLink from "next/link";
import { Container, Link, Text } from "@/components/ui";
import { site } from "@/content/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-subtle">
      <Container width="wide" className="py-14 sm:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-xs">
            <Logo />
            <Text tone="muted" size="sm" className="mt-3">
              {site.tagline}
            </Text>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-sm font-semibold text-fg">Sections</h2>
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
              <h2 className="text-sm font-semibold text-fg">Contact</h2>
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

              <h2 className="mt-8 text-sm font-semibold text-fg">Elsewhere</h2>
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
          </ul>
        </div>
      </Container>
    </footer>
  );
}
