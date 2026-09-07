# Algomotive — website

Static marketing site. Next.js App Router, TypeScript, Tailwind v4, exported to
plain HTML and served from GitHub Pages.

`CLAUDE.md` is the brief: brand rules, palette, tone, and the hard constraints.
Read it before changing anything visual.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # contrast gate, then a static export into out/
npm run lint
```

`npm run build` runs `check:contrast` first and stops on failure, so an
inaccessible colour pairing can never reach a deploy.

## How the design system is put together

Four tiers, defined in `src/app/globals.css`, and a component may only ever
touch the last two:

| Tier | What | Rule |
|---|---|---|
| Raw palette | `--algo-*` | The exact brand hexes. Never edited, never referenced by a component. |
| Semantic aliases | `--bg`, `--fg-muted`, `--accent`… | What components consume. Dark mode remaps only these. |
| Gradients | `--grad-*` | Buttons, panels and hairlines. Never a full-section wash, never body copy. |
| Tailwind | `@theme inline` | Turns the aliases into `bg-surface`, `text-fg-muted`, `border-border-strong`. |

**No component ever writes a hex.** If you find yourself reaching for one, the
alias you need is missing — add it to the token layer instead.

### Contrast

The raw palette cannot hit WCAG AA by itself: brand blue is 4.00 on paper,
white-on-blue is 4.18, and navy against ink is 1.05 (invisible). So every
AA-critical alias is derived with `color-mix(in oklab, …)` from two approved
palette tokens — no new hex enters the codebase, and a brand-book swap
propagates automatically.

`src/lib/tokens.ts` mirrors those mixes as data. It is the single source for
both the build gate and the /styleguide page, so the numbers on screen cannot
drift from the numbers CI enforces. **Change a mix percentage in `globals.css`
and you must change it in `tokens.ts` too** — the gate is what catches you.

Text is checked at 4.5:1 against every ground it can land on. UI boundaries are
checked at 3:1. Gradients that carry text are sampled along their whole length
and judged at their worst stop.

### Theming

`src/lib/theme.ts` holds an inline script that runs in `<head>` before first
paint, so there is no flash of the wrong theme. It reads `localStorage`, falls
back to `prefers-color-scheme`, and falls back again to light if storage throws.

The dark selector is a bare `[data-theme="dark"]` rather than `html[...]`, so
any subtree can be themed independently — which is how /styleguide shows both
themes at once.

## Layout

```
src/app/          routes, root layout, globals.css (the token layer)
src/components/ui primitives — Container, Section, Button, Link, Heading, Text
src/content/      all user-facing copy, as typed objects
src/lib/          fonts, theme, cn(), tokens
scripts/          check-contrast.mts — the build gate
```

Copy lives in `src/content/*` and nowhere else. Components contain zero
hardcoded strings, because the owner edits copy without touching JSX.

## Deploying

`.github/workflows/deploy.yml` builds on push to `main` and publishes `out/` to
GitHub Pages.

`NEXT_PUBLIC_BASE_PATH` is the single switch between a project page and a custom
domain. It is set to `/algo-demo` in the workflow and empty everywhere else.
Moving to an apex domain means blanking it and adding a `CNAME` — one line.

`.nojekyll` is committed at `public/.nojekyll` and re-touched in the workflow.
Without it Pages runs the output through Jekyll, which silently drops every
`_next/` directory.

## Phase status

Phase 0 (foundation) is complete: tokens, fonts, theme, primitives, empty
content layer, deploy pipeline, styleguide.

`/styleguide` is an instrument, not a page — it and
`src/app/styleguide/SystemPreview.tsx` are deleted in Phase 3. Both are marked
`PHASE-3-DELETE`.
