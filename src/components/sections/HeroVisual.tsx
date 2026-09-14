import { hero } from "@/content/sections";

/**
 * The one place the page spends boldness (CLAUDE.md §4).
 *
 * An engineering diagram of the pipeline, not decoration: three source records
 * converge on a matching step, what does not reconcile branches off as an
 * exception, and what does passes a human approval gate before it is recorded.
 * That is literally the product, drawn — and it is labelled, because the
 * labels are the product's vocabulary.
 *
 * It follows the theme. The card is a surface in both; strokes and beams come
 * through the `--flow-*` tokens, which mix the accent family toward blue and
 * ink on paper and use it raw on navy — so the drawing is the same drawing in
 * both, at the contrast each ground needs. No hex anywhere here.
 *
 * Nothing in this file moves. HeroSequence drives it through stable hooks:
 *   data-anim = records | flow | match | exception | gate | ledger | pulse
 *   data-status = pending | approved   (the two states of the header pill;
 *                 the markup's default is approved, the final state)
 * The border light is CSS (`.border-beam`) and needs nothing from JS.
 *
 * The header row is HTML so the title and status stay crisp at every width.
 * Inside the SVG, labels scale with the drawing and are hidden below `sm`,
 * where they would be under 6px.
 */
const V = hero.visual;
const RECORD_Y = [48, 166, 284] as const;

export function HeroVisual() {
  return (
    <div
      data-hero-seq="visual"
      className="relative overflow-hidden rounded-2xl border border-border bg-surface text-fg shadow-overlay [--beam-radius:16px]"
    >
      <span aria-hidden="true" className="border-beam" />

      {/* Panel header: what this is, and where it stands. */}
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
        <span className="font-display text-sm font-medium text-fg-muted">
          {V.title}
        </span>
        {/* Two states, stacked. The markup shows the end of the story
            (approved); the sequence rewinds to pending before it plays. The
            hidden one is `invisible` and aria-hidden, not merely transparent,
            so a screen reader hears one status. */}
        <span className="relative grid text-xs font-medium">
          <span
            data-status="pending"
            aria-hidden="true"
            className="invisible col-start-1 row-start-1 inline-flex items-center gap-2 rounded-full border border-warning bg-warning px-2.5 py-0.5 text-status-contrast opacity-0"
          >
            <span aria-hidden="true" className="size-1.5 rounded-full bg-status-contrast/70" />
            {V.status.pending}
          </span>
          <span
            data-status="approved"
            className="col-start-1 row-start-1 inline-flex items-center gap-2 rounded-full border border-success bg-success px-2.5 py-0.5 text-status-contrast"
          >
            <span aria-hidden="true" className="size-1.5 rounded-full bg-status-contrast/70" />
            {V.status.approved}
          </span>
        </span>
      </div>

      <div className="bg-dot-grid relative">
        {/* The ambient pulses: HTML dots over the drawing, moved with a
            composited transform. An SVG circle would relayout the drawing on
            every frame; these cost nothing on the main thread. Positions are
            computed by HeroSequence from the paths below. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {RECORD_Y.map((y) => (
            <span
              key={y}
              data-anim="pulse"
              className="absolute top-0 left-0 size-2 rounded-full bg-[color:var(--pulse)] opacity-0 will-change-transform"
              style={{ marginTop: "-4px", marginLeft: "-4px" }}
            />
          ))}
        </div>
        <svg
          viewBox="0 0 960 420"
          role="img"
          aria-label={hero.visualAlt}
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="algo-flow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--flow-1)" />
              <stop offset="50%" stopColor="var(--flow-2)" />
              <stop offset="100%" stopColor="var(--flow-3)" />
            </linearGradient>
          </defs>

          {/* ---- source records: purchase order, goods received, invoice ---- */}
          <g data-anim="records" stroke="var(--border-strong)" fill="var(--bg)">
            {RECORD_Y.map((y, i) => (
              <g key={y} data-anim="record" data-index={i}>
                <rect x="48" y={y} width="168" height="88" rx="8" strokeWidth="1" />
                <text
                  x="64"
                  y={y + 30}
                  className="max-sm:hidden"
                  fill="var(--fg)"
                  stroke="none"
                  fontSize="14"
                  fontFamily="var(--font-body)"
                  fontWeight="500"
                >
                  {V.records[i]}
                </text>
                <line
                  x1="64"
                  y1={y + 50}
                  x2="128"
                  y2={y + 50}
                  stroke="var(--flow-1)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line x1="64" y1={y + 66} x2="176" y2={y + 66} strokeWidth="1" opacity="0.55" />
              </g>
            ))}
          </g>

          {/* ---- convergence into the matching step ---- */}
          <g
            data-anim="flow"
            fill="none"
            stroke="url(#algo-flow)"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M216 92 C 300 92, 320 210, 400 210" />
            <path d="M216 210 C 300 210, 320 210, 400 210" />
            <path d="M216 328 C 300 328, 320 210, 400 210" />
          </g>

          {/* ---- after the match: through the gate, to the ledger ---- */}
          <path
            data-anim="gate-line"
            d="M488 210 L 780 210"
            fill="none"
            stroke="url(#algo-flow)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* ---- matching step ---- */}
          <g data-anim="match">
            <rect
              x="400"
              y="166"
              width="88"
              height="88"
              rx="8"
              fill="var(--accent-soft)"
              stroke="var(--flow-2)"
              strokeWidth="1.5"
            />
            <path
              d="M428 210 l11 11 l24 -26"
              fill="none"
              stroke="var(--flow-3)"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="444"
              y="282"
              className="max-sm:hidden"
              textAnchor="middle"
              fill="var(--fg-muted)"
              fontSize="14"
              fontFamily="var(--font-body)"
              fontWeight="500"
            >
              {V.match}
            </text>
          </g>

          {/* ---- exception branch: what did not reconcile ---- */}
          <g data-anim="exception">
            <path
              d="M444 254 C 444 320, 470 360, 540 360"
              fill="none"
              stroke="var(--flow-warn)"
              strokeWidth="1.5"
              strokeDasharray="4 5"
              strokeLinecap="round"
            />
            <rect
              x="540"
              y="336"
              width="140"
              height="48"
              rx="8"
              fill="var(--bg)"
              stroke="var(--flow-warn)"
              strokeWidth="1.5"
            />
            <text
              x="558"
              y="365"
              className="max-sm:hidden"
              fill="var(--fg)"
              fontSize="14"
              fontFamily="var(--font-body)"
              fontWeight="500"
            >
              {V.exception}
            </text>
            <line
              className="sm:hidden"
              x1="558"
              y1="360"
              x2="620"
              y2="360"
              stroke="var(--flow-warn)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* ---- approval gate: nothing passes without a person ---- */}
          <g data-anim="gate">
            <line
              x1="660"
              y1="150"
              x2="660"
              y2="270"
              stroke="var(--flow-1)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="660"
              cy="210"
              r="15"
              fill="var(--surface)"
              stroke="var(--flow-1)"
              strokeWidth="2"
            />
            <path
              d="M653 210 l5 5 l10 -11"
              fill="none"
              stroke="var(--flow-3)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="660"
              y="130"
              className="max-sm:hidden"
              textAnchor="middle"
              fill="var(--fg-muted)"
              fontSize="14"
              fontFamily="var(--font-body)"
              fontWeight="500"
            >
              {V.gate}
            </text>
          </g>

          {/* ---- recorded in the system of record ---- */}
          <g data-anim="ledger">
            <rect
              x="780"
              y="150"
              width="132"
              height="120"
              rx="8"
              fill="var(--bg)"
              stroke="var(--border-strong)"
              strokeWidth="1"
            />
            <text
              x="796"
              y="180"
              className="max-sm:hidden"
              fill="var(--fg)"
              fontSize="14"
              fontFamily="var(--font-body)"
              fontWeight="500"
            >
              {V.ledger}
            </text>
            <line
              x1="796"
              y1="204"
              x2="868"
              y2="204"
              stroke="var(--flow-3)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {[224, 240].map((y) => (
              <line
                key={y}
                x1="796"
                y1={y}
                x2="896"
                y2={y}
                stroke="var(--border-strong)"
                strokeWidth="1"
                opacity="0.55"
              />
            ))}
          </g>

        </svg>
      </div>
    </div>
  );
}
