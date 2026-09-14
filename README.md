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
src/app/               routes, root layout, template (page transition), globals.css
src/components/ui      primitives — Container, Section, Button, Link, Heading, Text,
                       Status, ThemeToggle, PageEnter, ReadingProgress
src/components/layout  Nav, MobileNav, Footer, Logo
src/components/motion  Reveal, HeroSequence, ProcessSequence, Counter, lines (SplitText)
src/components/sections one file per section of the home page, plus the two diagrams
src/content/           all user-facing copy, as typed objects
src/lib/               fonts, theme, motion vocabulary, cn(), tokens, posts
scripts/               check-contrast.mts — the build gate
```

Copy lives in `src/content/*` and nowhere else. Components contain zero
hardcoded strings, because the owner edits copy without touching JSX. That
includes chrome — menu labels, the theme toggle, footer headings — which sit in
`site.ui`.

`grep -rn "PLACEHOLDER" src content` lists everything still to be replaced
before launch: the contact address, the logo strip, the proof section, the
legal pages, the social links, the brand mark and the social card.

## Motion

Three treatments, defined once in `src/lib/motion.ts` and applied by
`Reveal` off `data-reveal` attributes in the markup:

| `data-reveal` | What | Where |
|---|---|---|
| `lines` | Each line rises out of a clipping mask (GSAP SplitText) | Headings |
| `fade` / `group` | Opacity only, staggered inside a group | Body copy, lists, rows |
| `rise` | Opacity plus 14px of travel | The approval console and the contact form, only |
| `draw` | Scales in from the left | The one rule in the agents section |

Sections stay server components; `Reveal` is the client wrapper that reads the
hooks. Nothing below the fold is built until the hero has had its first frame
(`afterFirstFrame` in `src/components/motion/refresh.ts`) and the section is
within a viewport of the fold; anything already on screen when its section is
built is left exactly as the static HTML has it. Nothing plays twice.

Two places spend the boldness: the hero sequence (`HeroSequence`, ~1.8s, once,
then three ambient pulses on the pipeline that pause while the hero is off
screen) and the "How it works" scene (`ProcessSequence`), which holds still
with CSS `position: sticky` and changes state as each step reaches the reading
line. Neither pins or hijacks the scroll.

The contract every piece of motion keeps:

- Copy is in the static HTML at load. The hero's starting state is a CSS rule
  scoped to `html.js` and `prefers-reduced-motion: no-preference`; JavaScript
  off, or reduced motion, gets the finished page with nothing hidden.
- `prefers-reduced-motion: reduce` builds nothing. Every component checks it
  through `gsap.matchMedia()`, and the CSS side through `motion-safe:`.
- Every GSAP setup runs inside `gsap.context()` and is reverted on unmount,
  which kills its tweens and ScrollTriggers together.
- Transform and opacity only, with one documented exception: the hero's flow
  lines draw with `stroke-dashoffset`, because no transform traces a curve.
- Nothing animates a layout property. The header keeps one height; the
  count-up figures reserve their final width before the first digit changes.
- Anything hidden from the eye is hidden from assistive tech too: the status
  chips crossfade with `autoAlpha` and toggle `aria-hidden` at the same moment.

Smooth scrolling for anchor links is switched on by `refresh.ts` after the
page has settled, never from the first paint: with it on from the start the
browser's own jump to a deep link was cancelled by ScrollTrigger's load-time
measurements and landed short. The theme toggle runs through the View
Transitions API where it exists (a circle opening from the button) and is an
instant swap everywhere else.

## Deploying

**One-time setup, required before the first deploy can succeed:**
in the repo, go to **Settings → Pages → Build and deployment** and set
**Source: GitHub Actions**.

Until that switch is flipped, the deploy job fails at `actions/configure-pages`
with `Get Pages site failed ... Not Found`. The workflow cannot do this for
itself: creating a Pages site requires repo admin, while the workflow's
`GITHUB_TOKEN` caps at `pages: write` — enough to deploy into an existing site,
not to create one. A human admin has to do it once.

`.github/workflows/deploy.yml` builds on push to `main` and publishes `out/` to
GitHub Pages.

`NEXT_PUBLIC_BASE_PATH` is the single switch between a project page and a custom
domain. It is set to `/algo-demo` in the workflow and empty everywhere else.
Moving to an apex domain means blanking it and adding a `CNAME` — one line.

`.nojekyll` is committed at `public/.nojekyll` and re-touched in the workflow.
Without it Pages runs the output through Jekyll, which silently drops every
`_next/` directory.

## Phase status

`CLAUDE.md` refers to `BUILD-PROMPTS.md` for the phase definitions; that file
is not in the repository, so the phases below are reconstructed from the
commit history.

| Phase | What | State |
|---|---|---|
| 0 | Tokens, fonts, theme, primitives, contrast gate, deploy pipeline | Done |
| 1 | The full page, static, real copy, no motion; blog, legal pages | Done |
| 2 | The motion layer: hero sequence, signature scroll moment, one entrance | Done |
| 3 | `mailto:` composer, styleguide removed, sitemap, robots, social card, 404 | Done |
| 4 | Motion and UI revamp: display type, masked line reveals, live pipeline, sticky process scene, approval console, logo strip, nav, footer, page transitions | Done |

Still placeholders, by design: contact details, logo strip, proof section,
legal pages, social links, brand mark, blog post.
