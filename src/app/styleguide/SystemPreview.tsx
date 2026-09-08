// PHASE-3-DELETE: this whole route goes away once the real pages exist.
import {
  Button,
  Heading,
  Lede,
  Link,
  Status,
  Text,
  ThemeToggle,
} from "@/components/ui";
import {
  aliasNames,
  aliasNotes,
  contrast,
  gradients,
  palette,
  round2,
  themes,
  typeScale,
  type ThemeName,
} from "@/lib/tokens";

/**
 * Swatches paint themselves from the CSS variable, not from the hex string —
 * so if `globals.css` and `tokens.ts` ever drift, the colour and the printed
 * value disagree on screen and the bug is visible rather than theoretical.
 */
function Swatch({
  name,
  cssVar,
  hex,
  note,
  ratio,
}: {
  name: string;
  cssVar?: string;
  hex: string;
  note?: string;
  ratio?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="size-11 shrink-0 rounded-md border border-border-strong"
        style={{ background: cssVar ? `var(${cssVar})` : hex }}
      />
      <div className="min-w-0">
        <div className="truncate font-mono text-xs text-fg">{name}</div>
        <div className="truncate font-mono text-xs text-fg-muted">
          {hex}
          {ratio ? ` · ${ratio}` : ""}
        </div>
        {note ? (
          <div className="truncate text-xs text-fg-muted">{note}</div>
        ) : null}
      </div>
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-6">
      <h3 className="mb-4 font-mono text-xs tracking-wide text-fg-muted uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

const typeClasses: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
};

/**
 * The whole system rendered inside one theme. The wrapper carries
 * `data-theme`, which is why the alias selector in globals.css is a bare
 * attribute rather than scoped to <html> — it lets both themes sit on one
 * page at once.
 */
export function SystemPreview({ theme }: { theme: ThemeName }) {
  const t = themes[theme];

  return (
    <div
      data-theme={theme}
      className="flex-1 rounded-xl border border-border bg-bg p-6 text-fg sm:p-8"
    >
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="font-display text-lg font-semibold text-fg capitalize">
          {theme}
        </h2>
        <ThemeToggle />
      </div>

      <div className="flex flex-col gap-8">
        <Block title="Raw palette · never referenced by a component">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Object.entries(palette).map(([name, hex]) => (
              <Swatch key={name} name={`--algo-${name}`} hex={hex} />
            ))}
          </div>
        </Block>

        <Block title="Semantic aliases · what components actually use">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {aliasNames.map((name) => {
              // Status tokens are intentionally absent: they are fills, so a
              // "ratio on bg" reading would describe a usage that is banned.
              const isText = ["fg", "fg-muted", "accent"].includes(name);
              return (
                <Swatch
                  key={name}
                  name={`--${name}`}
                  cssVar={`--${name}`}
                  hex={t[name]}
                  note={aliasNotes[name]}
                  ratio={
                    isText
                      ? `${round2(contrast(t[name], t.bg))}:1 on bg`
                      : undefined
                  }
                />
              );
            })}
          </div>
        </Block>

        <Block title="Gradients · sampled at the worst stop, not the average">
          <div className="flex flex-col gap-3">
            {gradients.map((g) => (
              <div key={g.name}>
                <div
                  className="flex h-16 items-end rounded-lg border border-border p-3"
                  style={{
                    backgroundImage:
                      g.name === "grad-hairline"
                        ? "var(--grad-hairline)"
                        : `var(--${g.name})`,
                  }}
                >
                  {g.textAlias ? (
                    <span
                      className="text-sm font-medium"
                      style={{ color: `var(--${g.textAlias})` }}
                    >
                      Text on {g.name}
                    </span>
                  ) : null}
                </div>
                <div className="mt-1 font-mono text-xs text-fg-muted">
                  --{g.name} · {g.note}
                </div>
              </div>
            ))}
            <div>
              <hr className="rule-accent" />
              <div className="mt-1 font-mono text-xs text-fg-muted">
                rule-accent utility
              </div>
            </div>
          </div>
        </Block>

        <Block title="Type scale · ~1.25 ratio, tracking tightens as size grows">
          <div className="flex flex-col gap-4">
            {typeScale.map((step) => (
              <div key={step.name}>
                <div className="font-mono text-xs text-fg-muted">
                  text-{step.name} · {step.px} · lh {step.lh} · ls {step.ls}
                </div>
                <div
                  className={`${typeClasses[step.name]} font-display font-semibold text-fg`}
                >
                  Approve, then record
                </div>
              </div>
            ))}
            <div>
              <div className="font-mono text-xs text-fg-muted">
                body · Inter · 1.6 · capped at 68ch
              </div>
              <Text tone="muted">
                The agents sit on top of the systems a company already runs,
                read from them, prepare the work, and wait for a human to
                approve before anything is recorded. This paragraph exists to
                show the measure holding at a readable line length.
              </Text>
            </div>
          </div>
        </Block>

        <Block title="Headings · level and size are separate props">
          <div className="flex flex-col gap-3">
            <Heading level={2} size="3xl">
              Display heading
            </Heading>
            <Heading level={3} size="xl">
              Section heading
            </Heading>
            <Heading level={4} size="md">
              Subsection heading
            </Heading>
            <Lede>
              A lede sits under a heading — larger, quieter, on a shorter
              measure than body copy.
            </Lede>
          </div>
        </Block>

        <Block title="Buttons · focus rings are solid, never gradient">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <Button variant="secondary" href="/styleguide">
                As a link
              </Button>
            </div>
          </div>
        </Block>

        <Block title="Links and status">
          <div className="flex flex-col gap-2">
            <Text>
              An <Link href="/styleguide">internal link</Link> and a{" "}
              <Link href="https://example.com">link that leaves the site</Link>,
              plus a <Link href="/styleguide" subtle>subtle link</Link> inside a
              paragraph run.
            </Text>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Status tone="success">Approved</Status>
              <Status tone="warning">Needs review</Status>
              <Status tone="danger">Rejected</Status>
              <Status tone="neutral">Pending</Status>
            </div>
            <Text tone="muted" size="sm" className="pt-1">
              Status colours are fills carrying an ink label, never coloured
              text. As text on paper they measure 1.86–3.02; as fills they are
              4.90–7.96.
            </Text>
          </div>
        </Block>

        <Block title="Surfaces and elevation">
          <div className="flex flex-col gap-3">
            <div className="rounded-lg bg-surface p-4 shadow-raised">
              <Text size="sm" measure={false}>
                surface + shadow-raised
              </Text>
            </div>
            <div className="rounded-lg bg-surface-raised p-4 shadow-raised">
              <Text size="sm" measure={false}>
                surface-raised
              </Text>
            </div>
            <div className="rounded-lg bg-bg-subtle p-4">
              <Text size="sm" measure={false}>
                bg-subtle
              </Text>
            </div>
            <div className="rounded-lg bg-grad-surface p-4 border border-border">
              <Text size="sm" measure={false}>
                bg-grad-surface
              </Text>
            </div>
            <div className="rounded-lg bg-grad-accent-soft p-4 border border-border">
              <Text size="sm" measure={false}>
                bg-grad-accent-soft
              </Text>
            </div>
            <div className="rounded-lg border border-border-strong bg-surface p-4">
              <Text size="sm" measure={false}>
                border-strong · the only border allowed on a real UI boundary
              </Text>
            </div>
          </div>
        </Block>
      </div>
    </div>
  );
}
