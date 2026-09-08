// PHASE-3-DELETE: this route is a build-time instrument, not part of the site.
// It is deleted in Phase 3 along with src/app/styleguide/SystemPreview.tsx.
import type { Metadata } from "next";
import {
  Container,
  Heading,
  Lede,
  Section,
  Status,
  Text,
} from "@/components/ui";
import { runChecks } from "@/lib/tokens";
import { SystemPreview } from "./SystemPreview";

export const metadata: Metadata = {
  title: "Styleguide",
  // Never index a scaffold page, even briefly.
  robots: { index: false, follow: false },
};

export default function StyleguidePage() {
  const checks = runChecks();
  const failures = checks.filter((c) => !c.pass);

  return (
    <main id="main">
      <Section spacing="md">
        <Container width="wide">
          <Heading level={1} size="2xl">
            Styleguide
          </Heading>
          <Lede className="mt-4">
            Every token, type step and primitive, rendered in both themes at
            once. Deleted in Phase 3.
          </Lede>

          {/* The same function that gates the build renders this table, so the
              numbers on screen cannot drift from the numbers CI enforces. */}
          <div className="mt-10 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
              <caption className="border-b border-border bg-surface px-4 py-3 text-left">
                <span className="font-display font-semibold text-fg">
                  Contrast gate
                </span>{" "}
                <span className="text-fg-muted">
                  — {checks.length - failures.length}/{checks.length} pass ·
                  text 4.5:1 · non-text 3:1 · gradients sampled at their worst
                  stop
                </span>
              </caption>
              <thead>
                <tr className="border-b border-border text-xs text-fg-muted uppercase">
                  <th className="px-4 py-2 font-medium">Theme</th>
                  <th className="px-4 py-2 font-medium">Pairing</th>
                  <th className="px-4 py-2 font-medium">Value</th>
                  <th className="px-4 py-2 font-medium">Measured</th>
                  <th className="px-4 py-2 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {checks.map((c, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 text-fg-muted">{c.theme}</td>
                    <td className="px-4 py-2 text-fg">{c.label}</td>
                    <td className="px-4 py-2 font-mono text-xs text-fg-muted">
                      {c.value}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-fg-muted">
                      {c.detail}
                    </td>
                    <td className="px-4 py-2">
                      {/* Uses Status rather than coloured text on purpose:
                          `text-success` here would be #48ba86 on white, 2.43:1.
                          The page that reports the contrast rules should not be
                          the page breaking them. */}
                      <Status
                        tone={c.pass ? "success" : "danger"}
                        className="text-xs"
                      >
                        {c.pass ? "PASS" : "FAIL"}
                      </Status>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Text tone="muted" size="sm" className="mt-4">
            The raw palette cannot reach AA on its own — brand blue is 4.00 on
            paper and navy against ink is 1.05. Aliases are derived with
            color-mix from approved tokens rather than by inventing shades.
          </Text>

          <div className="mt-12 flex flex-col gap-6 lg:flex-row">
            <SystemPreview theme="light" />
            <SystemPreview theme="dark" />
          </div>
        </Container>
      </Section>
    </main>
  );
}
