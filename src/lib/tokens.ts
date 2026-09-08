/**
 * The token system as data.
 *
 * `globals.css` is the runtime source of truth — this file mirrors it so two
 * things that cannot read CSS can still reason about the palette: the build-time
 * contrast gate (`scripts/check-contrast.ts`) and the /styleguide page, which
 * prints live measured ratios rather than numbers someone typed in by hand.
 *
 * If you change a mix percentage in globals.css, change it here too. The gate
 * is what catches you if you forget — it fails the build, not the deploy.
 */

/* ------------------------------------------------------------------ maths -- */

const srgbToLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

const linearToSrgb = (c: number) => {
  const v = Math.min(1, Math.max(0, c));
  return v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
};

const hexToLinear = (hex: string): number[] => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) =>
    srgbToLinear(parseInt(h.slice(i, i + 2), 16) / 255),
  );
};

const linearToHex = (rgb: number[]) =>
  "#" +
  rgb
    .map((c) =>
      Math.round(linearToSrgb(c) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");

const linearToOklab = ([r, g, b]: number[]) => {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const oklabToLinear = ([L, A, B]: number[]) => {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
};

/** Node-side equivalent of CSS `color-mix(in oklab, a p%, b)`. */
export const mix = (a: string, b: string, p: number) => {
  const la = linearToOklab(hexToLinear(a));
  const lb = linearToOklab(hexToLinear(b));
  const t = p / 100;
  return linearToHex(oklabToLinear(la.map((v, i) => v * t + lb[i] * (1 - t))));
};

export const luminance = (hex: string) => {
  const [r, g, b] = hexToLinear(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

export const round2 = (n: number) => Math.round(n * 100) / 100;

/** Worst ratio anywhere along a two-stop gradient, sampled at 5% steps. */
export const gradientWorst = (text: string, from: string, to: string) => {
  let worst = Infinity;
  for (let i = 0; i <= 20; i++) {
    worst = Math.min(worst, contrast(text, mix(to, from, i * 5)));
  }
  return worst;
};

/* ------------------------------------------------------- tier 1: palette -- */

/** CLAUDE.md §4, exact. Never edited, never referenced by a component. */
export const palette = {
  ink: "#17243f",
  navy: "#10203b",
  blue: "#3978e8",
  sky: "#72c9f4",
  cyan: "#2fc5e8",
  aqua: "#57e0dc",
  paper: "#fbfaf7",
  surface: "#ffffff",
  "soft-blue": "#eef5ff",
  line: "#dfe7f3",
  muted: "#6d7d95",
  success: "#48ba86",
  warning: "#f0ae3c",
  danger: "#e76c54",
  purple: "#7065d8",
} as const;

export type PaletteName = keyof typeof palette;

/* ------------------------------------------------- tier 2: alias mapping -- */

const p = palette;

export const lightAliases = {
  bg: p.paper,
  "bg-subtle": p["soft-blue"],
  surface: p.surface,
  "surface-raised": p.surface,
  fg: p.ink,
  "fg-muted": mix(p.muted, p.ink, 80),
  border: p.line,
  "border-strong": p.muted,
  accent: mix(p.blue, p.ink, 80),
  "accent-soft": mix(p.blue, p["soft-blue"], 8),
  "accent-contrast": p.paper,
  success: p.success,
  warning: p.warning,
  danger: p.danger,
  "status-contrast": p.ink,
} as const;

export const darkAliases = {
  bg: p.navy,
  "bg-subtle": mix(p.navy, "#000000", 88),
  surface: mix(p.navy, p.muted, 88),
  "surface-raised": mix(p.navy, p.muted, 78),
  fg: p.paper,
  "fg-muted": mix(p.muted, p.paper, 74),
  border: mix(p.muted, p.navy, 26),
  "border-strong": mix(p.paper, p.muted, 10),
  accent: p.sky,
  "accent-soft": mix(p.blue, p.navy, 14),
  "accent-contrast": p.navy,
  success: p.success,
  warning: p.warning,
  danger: p.danger,
  "status-contrast": p.ink,
} as const;

export type AliasName = keyof typeof lightAliases;

export const themes = { light: lightAliases, dark: darkAliases } as const;
export type ThemeName = keyof typeof themes;

export const aliasNames = Object.keys(lightAliases) as AliasName[];

/** Short note on what each alias is for, shown on the styleguide. */
export const aliasNotes: Record<AliasName, string> = {
  bg: "Page ground",
  "bg-subtle": "Recessed band — light tints, dark recedes",
  surface: "Cards, panels, sheets",
  "surface-raised": "Light lifts with shadow; dark lifts with tint",
  fg: "Primary text",
  "fg-muted": "Secondary text",
  border: "Decorative rule only — never a UI boundary",
  "border-strong": "Real boundaries: inputs, outlined buttons",
  accent: "Links, focus rings, emphasis",
  "accent-soft": "Tinted panel ground",
  "accent-contrast": "Label sitting on the primary fill",
  success: "Status fill — carries an ink label, never coloured text",
  warning: "Status fill — carries an ink label, never coloured text",
  danger: "Status fill — carries an ink label, never coloured text",
  "status-contrast": "Label colour for any status fill",
};

/* ------------------------------------------------------ tier 3: gradients -- */

export type GradientSpec = {
  name: string;
  /** The two stops used for contrast sampling. */
  stops: Record<ThemeName, [string, string]>;
  /** Which alias sits on top, if any text does. */
  textAlias: AliasName | null;
  note: string;
};

export const gradients: GradientSpec[] = [
  {
    name: "grad-primary",
    stops: {
      light: [p.ink, mix(p.blue, p.navy, 18)],
      dark: [p.sky, p.aqua],
    },
    textAlias: "accent-contrast",
    note: "Primary CTA fill",
  },
  {
    name: "grad-surface",
    stops: {
      light: [p.surface, p["soft-blue"]],
      dark: [darkAliases.surface, darkAliases["surface-raised"]],
    },
    textAlias: "fg-muted",
    note: "Subtle card lift",
  },
  {
    name: "grad-accent-soft",
    stops: {
      light: [lightAliases["accent-soft"], p.paper],
      dark: [darkAliases["accent-soft"], p.navy],
    },
    textAlias: "fg-muted",
    note: "Tinted panel",
  },
  {
    name: "grad-hairline",
    stops: {
      light: [p.blue, p.aqua],
      dark: [p.blue, p.aqua],
    },
    textAlias: null,
    note: "Decorative 1px rule — never a focus ring or input border",
  },
];

/* ------------------------------------------------------------ type scale -- */

export const typeScale = [
  { name: "xs", size: "0.75rem", px: "12px", lh: "1.6", ls: "0em" },
  { name: "sm", size: "0.875rem", px: "14px", lh: "1.6", ls: "0em" },
  { name: "base", size: "1rem", px: "16px", lh: "1.6", ls: "0em" },
  { name: "lg", size: "1.25rem", px: "20px", lh: "1.5", ls: "-0.005em" },
  { name: "xl", size: "1.5625rem", px: "25px", lh: "1.35", ls: "-0.01em" },
  { name: "2xl", size: "1.9531rem", px: "31px", lh: "1.2", ls: "-0.015em" },
  { name: "3xl", size: "clamp(2rem … 2.4414rem)", px: "32→39px", lh: "1.15", ls: "-0.02em" },
  { name: "4xl", size: "clamp(2.25rem … 3.0518rem)", px: "36→49px", lh: "1.08", ls: "-0.025em" },
  { name: "5xl", size: "clamp(2.5rem … 3.8147rem)", px: "40→61px", lh: "1.05", ls: "-0.03em" },
  { name: "6xl", size: "clamp(2.75rem … 4.7684rem)", px: "44→76px", lh: "1.05", ls: "-0.035em" },
] as const;

/* --------------------------------------------------------- contrast gate -- */

export const FLOOR_TEXT = 4.5; // WCAG 1.4.3, normal-size text
export const FLOOR_NON_TEXT = 3.0; // WCAG 1.4.11, UI component boundaries

export type Check = {
  theme: ThemeName;
  label: string;
  value: string;
  floor: number;
  actual: number;
  pass: boolean;
  detail: string;
};

/** Every ground a foreground token can legitimately land on. */
const groundsFor = (t: (typeof themes)[ThemeName]) =>
  [
    ["bg", t.bg],
    ["surface", t.surface],
    ["surface-raised", t["surface-raised"]],
    ["bg-subtle", t["bg-subtle"]],
    ["accent-soft", t["accent-soft"]],
  ] as const;

export function runChecks(): Check[] {
  const checks: Check[] = [];

  for (const themeName of ["light", "dark"] as ThemeName[]) {
    const t = themes[themeName];
    const grounds = groundsFor(t);

    // Status colours are deliberately absent here. They are fills, and are
    // checked below as "label on fill" instead — asserting them as text would
    // assert the exact property this system gives up on purpose.
    for (const token of ["fg", "fg-muted", "accent"] as AliasName[]) {
      let worst = Infinity;
      let worstGround = "";
      for (const [groundName, ground] of grounds) {
        const r = contrast(t[token], ground);
        if (r < worst) {
          worst = r;
          worstGround = groundName;
        }
      }
      checks.push({
        theme: themeName,
        label: `text: ${token}`,
        value: t[token],
        floor: FLOOR_TEXT,
        actual: worst,
        pass: worst >= FLOOR_TEXT,
        detail: `${round2(worst)} on ${worstGround}`,
      });
    }

    // Status colours are fills. What has to be readable is the label sitting
    // on them, not the colour against the page — as text on paper the raw
    // brand values are 1.86-3.02 and there is no intention of using them
    // that way.
    for (const token of ["success", "warning", "danger"] as AliasName[]) {
      const r = contrast(t["status-contrast"], t[token]);
      checks.push({
        theme: themeName,
        label: `fill: ${token} + label`,
        value: t[token],
        floor: FLOOR_TEXT,
        actual: r,
        pass: r >= FLOOR_TEXT,
        detail: `${round2(r)} label on fill`,
      });
    }

    // UI boundaries need 3:1, not 4.5. `--border` is exempt by design: it is
    // decorative, and anything load-bearing is required to use border-strong.
    for (const [label, token] of [
      ["boundary: border-strong", "border-strong"],
      ["boundary: focus ring", "accent"],
    ] as const) {
      let worst = Infinity;
      for (const [, ground] of grounds) {
        worst = Math.min(worst, contrast(t[token as AliasName], ground));
      }
      checks.push({
        theme: themeName,
        label,
        value: t[token as AliasName],
        floor: FLOOR_NON_TEXT,
        actual: worst,
        pass: worst >= FLOOR_NON_TEXT,
        detail: `${round2(worst)}`,
      });
    }

    // Elevation has to be visible or dark mode is one flat plane. Light is
    // exempt: it lifts with shadow, because paper→white is the only tint the
    // palette allows and a fourth near-white would be an invented shade.
    const liftFromBg = contrast(t.bg, t.surface);
    const lift = contrast(t.surface, t["surface-raised"]);
    checks.push({
      theme: themeName,
      label: "elevation: bg → surface → raised",
      value: `${t.surface} / ${t["surface-raised"]}`,
      floor: 1.1,
      actual: themeName === "light" ? 1.1 : Math.min(liftFromBg, lift),
      pass: themeName === "light" ? true : liftFromBg >= 1.1 && lift >= 1.1,
      detail:
        themeName === "light"
          ? "n/a — lifts with shadow"
          : `${round2(liftFromBg)} then ${round2(lift)}`,
    });

    // Gradients carry text, so they are sampled along their whole length. An
    // average would quietly hide a failing end.
    for (const g of gradients) {
      if (!g.textAlias) continue;
      const [from, to] = g.stops[themeName];
      const text = t[g.textAlias];
      const worst = gradientWorst(text, from, to);
      checks.push({
        theme: themeName,
        label: `gradient: ${g.name} → ${g.textAlias}`,
        value: text,
        floor: FLOOR_TEXT,
        actual: worst,
        pass: worst >= FLOOR_TEXT,
        detail: `${round2(worst)} at worst stop`,
      });
    }
  }

  return checks;
}
