"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { howItWorks } from "@/content/sections";
import { afterFirstFrame } from "@/components/motion/refresh";

/**
 * The scene beside "How it works": one board, three stages, drawn from the
 * same parts a component library would give you — small cards as nodes, and
 * beams of light travelling along the connections between them.
 *
 * The nodes are HTML, so they are crisp at every width, follow the theme
 * through the ordinary tokens, and are read by a screen reader as the list
 * they are. The connections are an SVG overlay whose paths are measured from
 * the nodes' positions (and re-measured on resize), so the drawing is never
 * out of register with the layout.
 *
 * What moves is CSS. The board carries `data-stage` (0 to 3); globals.css
 * turns that into transitions on the nodes and a travelling dash on the
 * beams. ProcessSequence only flips the attribute as each step reaches the
 * reading line. The markup's default is stage 3 — the finished picture — so
 * a reader with JavaScript off or reduced motion sees everything at once.
 *
 * Labels come from the content file. Every identifier is generic (§2).
 */
const S = howItWorks.scene;

type Beam = { from: string; to: string; at: 1 | 2 | 3; axis: "y" | "x" };
const BEAMS: Beam[] = [
  { from: "src-0", to: "agent", at: 1, axis: "y" },
  { from: "src-1", to: "agent", at: 1, axis: "y" },
  { from: "src-2", to: "agent", at: 1, axis: "y" },
  { from: "agent", to: "prep-0", at: 2, axis: "y" },
  { from: "agent", to: "prep-1", at: 2, axis: "y" },
  { from: "agent", to: "prep-2", at: 2, axis: "y" },
  { from: "prep-1", to: "approver", at: 3, axis: "y" },
  { from: "approver", to: "record", at: 3, axis: "x" },
];

const PREP_TONE = [
  "border-[color:var(--flow-3)]",
  "border-[color:var(--flow-warn)]",
  "border-[color:var(--flow-1)]",
] as const;

const node =
  "rounded-xl border border-border bg-surface px-2 py-2.5 text-center text-xs font-medium text-fg shadow-raised sm:px-3 sm:text-sm";

export function ProcessBoard() {
  const board = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<{ d: string; at: 1 | 2 | 3 }[]>([]);

  // Measure the nodes and draw the beams between them. Re-run on resize.
  useEffect(() => {
    const root = board.current;
    if (!root) return;

    const measure = () => {
      const origin = root.getBoundingClientRect();
      const rect = (id: string) => {
        const el = root.querySelector<HTMLElement>(`[data-node='${id}']`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          left: r.left - origin.left,
          right: r.right - origin.left,
          top: r.top - origin.top,
          bottom: r.bottom - origin.top,
          cx: r.left - origin.left + r.width / 2,
          cy: r.top - origin.top + r.height / 2,
        };
      };
      const next = BEAMS.flatMap((b) => {
        const a = rect(b.from);
        const z = rect(b.to);
        if (!a || !z) return [];
        if (b.axis === "y") {
          const y1 = a.bottom;
          const y2 = z.top;
          const mid = (y1 + y2) / 2;
          return [{ at: b.at, d: `M${a.cx} ${y1} C ${a.cx} ${mid}, ${z.cx} ${mid}, ${z.cx} ${y2}` }];
        }
        const x1 = a.right;
        const x2 = z.left;
        const mid = (x1 + x2) / 2;
        return [{ at: b.at, d: `M${x1} ${a.cy} C ${mid} ${a.cy}, ${mid} ${z.cy}, ${x2} ${z.cy}` }];
      });
      setPaths(next);
    };

    // Nothing here is needed for the first paint, so it waits for the hero's
    // first frame like every other setup below the fold. The observer's own
    // first callback covers the initial measurement; fonts landing late
    // change the node widths and are covered by the same observer.
    let ro: ResizeObserver | undefined;
    const cancel = afterFirstFrame(() => {
      ro = new ResizeObserver(measure);
      ro.observe(root);
    });
    return () => {
      cancel();
      ro?.disconnect();
    };
  }, []);

  return (
    <div
      ref={board}
      data-scene-root
      data-stage="3"
      className="process-board relative overflow-hidden rounded-2xl border border-border bg-bg p-5 shadow-overlay sm:p-7 [--beam-radius:16px]"
      role="img"
      aria-label={S.alt}
    >
      <span aria-hidden="true" className="border-beam" />

      {/* Beams, under the nodes. */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="algo-beam" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="var(--flow-1)" />
            <stop offset="55%" stopColor="var(--flow-2)" />
            <stop offset="100%" stopColor="var(--flow-3)" />
          </linearGradient>
        </defs>
        {paths.map((p, i) => (
          <g key={i} fill="none" strokeLinecap="round">
            <path d={p.d} stroke="var(--border-strong)" strokeWidth="1" opacity="0.55" />
            <path d={p.d} className="beam" data-at={p.at} stroke="url(#algo-beam)" strokeWidth="2" />
          </g>
        ))}
      </svg>

      <div className="relative flex flex-col gap-9 sm:gap-11">
        {/* Sources */}
        <ul className="grid grid-cols-3 gap-3" data-at="1">
          {S.sources.map((label, i) => (
            <li key={label} data-node={`src-${i}`} className={node}>
              {label}
            </li>
          ))}
        </ul>

        {/* The agent, with the read-only tag beside it */}
        <div className="flex items-center justify-center gap-3" data-at="1">
          <div
            data-node="agent"
            className="relative flex size-14 items-center justify-center rounded-2xl border border-[color:var(--flow-2)] bg-accent-soft text-fg"
          >
            <span
              aria-hidden="true"
              className="ring absolute inset-0 rounded-2xl border border-[color:var(--flow-2)] opacity-0"
            />
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="var(--flow-3)" strokeWidth="2" strokeLinecap="round">
              <path d="M5 8h10M5 12h14M5 16h7" />
            </svg>
            <span className="sr-only">{S.agent}</span>
          </div>
          <span className="rounded-full border border-[color:var(--flow-1)] bg-bg px-2.5 py-0.5 text-xs font-medium text-accent">
            {S.access.read}
          </span>
        </div>

        {/* Prepared */}
        <ul className="grid grid-cols-3 gap-3" data-at="2">
          {S.prepared.map((label, i) => (
            <li key={label} data-node={`prep-${i}`} className={cn(node, PREP_TONE[i])}>
              {label}
            </li>
          ))}
        </ul>

        {/* Approval, then the write. The write tag sits on the beam between the
            two nodes and is dropped below `sm`, where there is no room for it. */}
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]" data-at="3">
          <div
            data-node="approver"
            className={cn(node, "flex items-center justify-center gap-2 border-[color:var(--flow-1)]")}
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 shrink-0" fill="none" stroke="var(--flow-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="8.5" stroke="var(--flow-1)" strokeWidth="1.5" />
              <path className="tick" d="M6 10.5l2.5 2.5L14 7.5" />
            </svg>
            {S.approver}
          </div>
          <span className="rounded-full border border-border-strong bg-bg px-2.5 py-0.5 text-xs font-medium text-fg-muted max-sm:hidden">
            {S.access.write}
          </span>
          <div data-node="record" className={cn(node, "border-[color:var(--flow-3)]")}>
            <span className="block">{S.record}</span>
            <span className="mt-0.5 block text-xs font-normal text-accent">{S.approved}</span>
          </div>
        </div>

        <p data-at="3" className="text-center font-mono text-xs text-fg-muted">
          {S.audit}
        </p>
      </div>
    </div>
  );
}
