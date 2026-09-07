CLAUDE.md — Algomotive Website
Drop this at the repo root. Claude Code reads it automatically on every session. Do not delete it between phases.
---
1. What this is
A marketing site for Algomotive, a UAE company that builds and deploys AI agents for enterprise finance and operations teams. The agents sit on top of the systems a company already runs (ERP, PMS), read from them, prepare the work, and wait for a human to approve before anything is recorded.
The site has two jobs, in this order:
Credibility. A CFO or finance director looks Algomotive up after a call or an email. In 30 seconds they need to conclude: this is a real, serious, technically competent company.
Inbound. The site should be findable in search and in AI-assistant answers, and interesting enough that a cold visitor scrolls the whole thing.
Audience: finance leaders (CFO, Financial Controller, Finance Manager) and IT directors at multi-entity operations — hotel groups, restaurant chains, food distribution, serviced apartments, and any company running several entities on one finance team.
Tone: precise, calm, technically literate, zero hype. Nobody in this audience is impressed by "revolutionary." They are impressed by "read-only, human sign-off, full audit trail."
---
2. Hard rules — never break these
Algomotive is the only brand name that appears anywhere. No other vendor, platform, partner, or parent company is named, referenced, hinted at, or left in a comment. Not in code, not in metadata, not in commit messages.
No customer names, client names, or client logos. None. Not in placeholders, not in alt text, not in sample data.
No pricing. No numbers, no tiers, no "starting from." The next step is always a conversation.
No testimonials, case studies, or performance metrics presented as real. Those sections get built as empty, clearly-marked placeholders for the owner to fill later.
No stock photography. No AI-generated imagery. No people photos.
Google Sans / Product Sans must not be used. They are proprietary and not licensable.
No `localStorage` reliance for anything load-bearing (theme toggle may use it with a safe fallback).
Anything you are unsure is publishable → make it a placeholder and flag it in your summary. Never invent a fact about the company.
---
3. Stack and constraints
Next.js (App Router) + TypeScript, `output: 'export'` — fully static.
Tailwind CSS v4 with CSS variables as the token layer.
GSAP + ScrollTrigger for scroll-driven motion. Framer Motion for component-level and interaction motion. Don't use both on the same element.
Deploy target: GitHub Pages. Therefore: no API routes, no server actions, no ISR, no image optimization loader (`images: { unoptimized: true }`).
`basePath` and `assetPrefix` must be driven by a single env var so switching from `user.github.io/repo` to a custom domain is a one-line change. Include `.nojekyll` in the output.
Forms are `mailto:` only. No third-party form backend. See §7.
No analytics in v1. Leave a single commented-out slot in the root layout for a script tag.
Package manager: npm unless the repo already says otherwise.
---
4. Design direction
Reference points the owner chose: openai.com, vercel.com, anthropic.com. Read: type-first, generous whitespace, restrained colour, one memorable moment per page rather than effects everywhere.
Light is the default theme. A dark toggle exists and must be genuinely designed, not an inverted afterthought — check contrast on every surface in both.
Colour tokens (exact, do not invent shades)
```css
--algo-ink: #17243f;
--algo-navy: #10203b;
--algo-blue: #3978e8;
--algo-sky: #72c9f4;
--algo-cyan: #2fc5e8;
--algo-aqua: #57e0dc;
--algo-paper: #fbfaf7;
--algo-surface: #ffffff;
--algo-soft-blue: #eef5ff;
--algo-line: #dfe7f3;
--algo-muted: #6d7d95;
--algo-success: #48ba86;
--algo-warning: #f0ae3c;
--algo-danger: #e76c54;
--algo-purple: #7065d8;
```
Semantic aliases (`--bg`, `--fg`, `--fg-muted`, `--border`, `--accent`, `--surface-raised`) map onto these and are what components actually reference. Dark mode remaps the aliases only. Never hardcode a hex in a component.
Cyan/sky/aqua are accent and motion colours — used in the signature moment, state changes, and the agent visual. They are not background washes. Resist gradient mesh.
Typography
Interim pairing, to be swapped when the brand book arrives:
Display / headings: Geist (via `next/font`)
Body / UI: Inter
Both are loaded through a single `fonts.ts` so replacing them later touches one file. Set a real type scale (roughly 1.25 ratio), tight tracking on large display sizes, body line length under 75 characters.
Anti-patterns — these read as AI-generated, avoid them
Tracked-out ALL-CAPS eyebrow labels above every heading.
Colouring or bolding one word in a headline for emphasis.
`01 / 02 / 03` numbered markers on content that isn't an actual sequence. (The "How it works" section is a sequence — numbering is correct there and nowhere else.)
Every section as an identical rounded card with the same shadow and the same border-radius.
A `→` glued onto every link and button label.
Meta strings joined with middle dots.
Fade-and-slide-up on every single section.
Spend the boldness in one place. Everything around it stays quiet.
---
5. Motion rules
All copy must exist in the static HTML at load. Motion animates elements that are already in the DOM. Never gate text behind a scroll trigger — it breaks search and AI crawlers, which is half the point of the site.
One orchestrated hero sequence. One signature scroll moment. Restraint everywhere else.
No scroll-jacking, no hijacked scroll speed, no horizontal-scroll sections.
`prefers-reduced-motion: reduce` must disable all non-essential motion and render the final state immediately. Test it.
Kill every ScrollTrigger on unmount. No memory leaks.
Target: no layout shift, 60fps, transform/opacity only.
---
6. Content architecture
All user-facing copy lives in `/content/*.ts` as typed objects. Components import from there and contain zero hardcoded strings. The owner will be editing copy weekly without touching JSX — this is non-negotiable.
Placeholder convention, used consistently so they're greppable:
```ts
// PLACEHOLDER: replace when client logos are approved
```
and in content files, a `placeholder: true` flag on any block that is filler.
---
7. Forms
Static site, so every form is a `mailto:` composer:
Render a real, properly validated form (name, work email, company, role, message).
On submit, build a `mailto:` URL with a structured subject and a body containing the field values, URL-encoded, then open it.
Show a fallback line with the email address as a copy-to-clipboard button, because `mailto:` fails silently for people on webmail without a handler.
Every "Contact", "Talk to us", "Book a demo" click resolves to the same composer.
Email address lives in `/content/site.ts` as one constant.
---
8. Quality floor
Responsive from 360px up. Test 360 / 768 / 1280 / 1920.
Visible keyboard focus rings. Full keyboard navigation. Skip link.
Semantic landmarks, one `h1` per page, real heading order.
Contrast AA minimum in both themes.
Lighthouse: 95+ performance, 100 accessibility, 100 SEO on the static export.
No console errors or hydration warnings.
---
9. Working style
Work in the phases defined in `BUILD-PROMPTS.md`. Don't jump ahead.
Before writing code in a new phase, state your plan in a few lines and wait if anything is ambiguous.
Commit at the end of each phase with a clear message.
After each phase, output: what you built, what you assumed, what you left as a placeholder, and anything you think is a bad idea.
If a request in a prompt conflicts with a hard rule in §2, stop and say so instead of complying.
