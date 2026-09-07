#!/usr/bin/env node
/**
 * Build-time WCAG gate.
 *
 * The token layer reaches AA with `color-mix(in oklab, ...)` rather than by
 * inventing brand shades, so the real colours only exist once a browser
 * resolves them. This re-derives the same maths in Node and fails the build on
 * any regression — cheaper than finding it in a Lighthouse run after deploy.
 *
 * Run directly: `node scripts/check-contrast.mts` (Node 22 strips the types).
 */
import { runChecks, round2, FLOOR_TEXT, FLOOR_NON_TEXT } from "../src/lib/tokens.ts";

const checks = runChecks();
const failures = checks.filter((c) => !c.pass);
const pad = (s: string | number, n: number) => String(s).padEnd(n);

for (const theme of ["light", "dark"] as const) {
  console.log(`\n  ${theme.toUpperCase()}`);
  for (const c of checks.filter((x) => x.theme === theme)) {
    console.log(
      `    ${c.pass ? "PASS" : "FAIL"}  ${pad(c.label, 40)} ${pad(c.value, 20)} ${c.detail}`,
    );
  }
}

console.log(
  `\n  ${checks.length - failures.length}/${checks.length} pass · text ${FLOOR_TEXT}:1 · non-text ${FLOOR_NON_TEXT}:1\n`,
);

if (failures.length) {
  console.error(
    `Contrast gate failed — ${failures.length} pairing(s) below AA:\n` +
      failures.map((f) => `  · [${f.theme}] ${f.label} = ${round2(f.actual)}`).join("\n"),
  );
  process.exit(1);
}
