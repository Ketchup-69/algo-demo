import { hero } from "@/content/sections";

/**
 * The one place the page spends boldness (CLAUDE.md §4).
 *
 * An engineering diagram of the pipeline, not decoration: three source records
 * converge on a matching step, what does not reconcile branches off as an
 * exception, and what does passes a human approval gate before it is recorded.
 * That is literally the product, drawn.
 *
 * Two deliberate choices:
 *
 * 1. The figure keeps a dark ground in BOTH themes, via `data-theme="dark"` on
 *    the wrapper. Sky, cyan and aqua are the designated accent family for this
 *    visual, and on paper they measure 1.54-1.96 — unusable. On ink they are
 *    8.36-10.14. Because the token layer scopes its dark aliases to a bare
 *    attribute selector rather than to <html>, the figure can hold that ground
 *    while still referencing only semantic aliases. No component hardcodes a hex.
 *
 * 2. Nothing moves. Phase 2 animates it, so every animatable part carries a
 *    stable `data-anim` hook: `record`, `flow`, `match`, `exception`, `gate`
 *    and `ledger`. Add motion by selecting those — do not restructure the SVG.
 */
export function HeroVisual() {
  return (
    <div
      data-theme="dark"
      className="overflow-hidden rounded-xl border border-border bg-bg"
    >
      <svg
        viewBox="0 0 720 420"
        role="img"
        aria-label={hero.visualAlt}
        className="h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* The accent family, used only here and in state changes (§4). */}
          <linearGradient id="algo-flow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--algo-blue)" />
            <stop offset="50%" stopColor="var(--algo-cyan)" />
            <stop offset="100%" stopColor="var(--algo-aqua)" />
          </linearGradient>
        </defs>

        {/* ---- source records: PO, GRN, invoice ---- */}
        <g data-anim="record" stroke="var(--border-strong)" fill="var(--surface)">
          {[64, 172, 280].map((y, i) => (
            <g key={y} data-anim="record" data-index={i}>
              <rect x="32" y={y} width="132" height="76" rx="6" strokeWidth="1" />
              <line
                x1="48"
                y1={y + 22}
                x2="112"
                y2={y + 22}
                stroke="var(--algo-sky)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line x1="48" y1={y + 40} x2="148" y2={y + 40} strokeWidth="1" opacity="0.55" />
              <line x1="48" y1={y + 54} x2="130" y2={y + 54} strokeWidth="1" opacity="0.55" />
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
          <path d="M164 102 C 230 102, 236 196, 300 200" />
          <path d="M164 210 C 230 210, 244 200, 300 200" />
          <path d="M164 318 C 230 318, 236 204, 300 200" />
        </g>

        {/* ---- matching step ---- */}
        <g data-anim="match">
          <rect
            x="300"
            y="164"
            width="72"
            height="72"
            rx="6"
            fill="var(--surface-raised)"
            stroke="var(--algo-cyan)"
            strokeWidth="1.5"
          />
          <path
            d="M320 200 l10 10 l22 -24"
            fill="none"
            stroke="var(--algo-aqua)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* ---- exception branch: what did not reconcile ---- */}
        <g data-anim="exception">
          <path
            d="M336 236 C 336 300, 360 330, 412 330"
            fill="none"
            stroke="var(--algo-warning)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
            strokeLinecap="round"
          />
          <rect
            x="412"
            y="306"
            width="108"
            height="48"
            rx="6"
            fill="var(--surface)"
            stroke="var(--algo-warning)"
            strokeWidth="1.5"
          />
          <line
            x1="430"
            y1="324"
            x2="486"
            y2="324"
            stroke="var(--algo-warning)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="430"
            y1="338"
            x2="470"
            y2="338"
            stroke="var(--border-strong)"
            strokeWidth="1"
          />
        </g>

        {/* ---- approval gate: nothing passes without a person ---- */}
        <g data-anim="gate">
          <path
            d="M372 200 L468 200"
            fill="none"
            stroke="url(#algo-flow)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="480"
            y1="140"
            x2="480"
            y2="260"
            stroke="var(--algo-sky)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx="480"
            cy="200"
            r="13"
            fill="var(--bg)"
            stroke="var(--algo-sky)"
            strokeWidth="2"
          />
          <path
            d="M474 200 l4 4 l9 -10"
            fill="none"
            stroke="var(--algo-aqua)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M493 200 L556 200"
            fill="none"
            stroke="url(#algo-flow)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* ---- recorded in the system of record ---- */}
        <g data-anim="ledger">
          <rect
            x="556"
            y="150"
            width="132"
            height="100"
            rx="6"
            fill="var(--surface)"
            stroke="var(--border-strong)"
            strokeWidth="1"
          />
          <line
            x1="572"
            y1="176"
            x2="636"
            y2="176"
            stroke="var(--algo-aqua)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {[196, 212, 228].map((y) => (
            <line
              key={y}
              x1="572"
              y1={y}
              x2="672"
              y2={y}
              stroke="var(--border-strong)"
              strokeWidth="1"
              opacity="0.55"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
