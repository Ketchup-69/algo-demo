import { howItWorks } from "@/content/sections";

/**
 * The scene beside "How it works": one drawing, three states. Sources feed an
 * agent (read-only); the agent prepares matched items, exceptions and drafts;
 * a controller approves; only then does anything reach the system of record,
 * and every step of that is logged.
 *
 * Every connector is a STRAIGHT line so it can be drawn with a scale
 * transform — the hero already spends the one stroke-dashoffset exception §5
 * allows, and this scene needs none. Each line's `data-scene-line` value is
 * the transform origin it grows from: its own start point, as a percentage of
 * its own bounding box.
 *
 * Nothing here moves. ProcessSequence drives it through the hooks:
 *   data-scene = sources | read | agent | read-tag | prep-lines | prepared |
 *                approve-line | approver | write-line | record | audit
 * The markup is the FINAL state (everything present), so a reader with
 * JavaScript off or reduced motion gets the whole picture at once.
 */
const S = howItWorks.scene;
const SOURCE_X = [40, 210, 380] as const;
const PREP_X = [40, 210, 380] as const;
const PREP_STROKE = ["var(--algo-aqua)", "var(--algo-warning)", "var(--algo-sky)"] as const;

const label = {
  fill: "var(--fg)",
  fontSize: 14,
  fontFamily: "var(--font-body)",
  fontWeight: 500,
} as const;

export function ProcessScene() {
  return (
    <div
      data-theme="dark"
      className="overflow-hidden rounded-2xl border border-border bg-bg text-fg shadow-overlay"
    >
      <div className="bg-dot-grid">
        <svg
          viewBox="0 0 560 420"
          role="img"
          aria-label={S.alt}
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* ---- sources ---- */}
          <g data-scene="sources">
            {SOURCE_X.map((x, i) => (
              <g key={x}>
                <rect
                  x={x}
                  y="32"
                  width="140"
                  height="52"
                  rx="8"
                  fill="var(--surface)"
                  stroke="var(--border-strong)"
                />
                <text x={x + 70} y="63" textAnchor="middle" {...label}>
                  {S.sources[i]}
                </text>
              </g>
            ))}
          </g>

          {/* ---- read: three straight lines converging on the agent ---- */}
          <g data-scene="read" stroke="var(--algo-sky)" strokeWidth="1.5" strokeLinecap="round">
            <line data-scene-line="0% 0%" x1="110" y1="84" x2="262" y2="150" />
            <line data-scene-line="50% 0%" x1="280" y1="84" x2="280" y2="150" />
            <line data-scene-line="100% 0%" x1="450" y1="84" x2="298" y2="150" />
          </g>

          {/* ---- the agent ---- */}
          <g data-scene="agent">
            <rect
              x="240"
              y="150"
              width="80"
              height="56"
              rx="10"
              fill="var(--surface-raised)"
              stroke="var(--algo-cyan)"
              strokeWidth="1.5"
            />
            {/* An agent glyph: three bars, the middle one the longest — a
                process with a head, a body and a tail. */}
            <g stroke="var(--algo-aqua)" strokeWidth="2" strokeLinecap="round">
              <line x1="262" y1="170" x2="284" y2="170" />
              <line x1="262" y1="178" x2="298" y2="178" />
              <line x1="262" y1="186" x2="276" y2="186" />
            </g>
            <text x="336" y="183" className="max-sm:hidden" {...label} fill="var(--fg-muted)">
              {S.agent}
            </text>
          </g>

          {/* ---- the access tag on the read lines ---- */}
          {/* The two access tags and the small captions are hidden below `sm`,
              where the drawing is 320px wide and 12px type would be under
              7px. The aria-label carries the full description regardless. */}
          <g data-scene="read-tag" className="max-sm:hidden">
            <rect x="330" y="104" width="94" height="24" rx="12" fill="var(--bg)" stroke="var(--algo-sky)" />
            <text x="377" y="120" textAnchor="middle" {...label} fontSize="12" fill="var(--algo-sky)">
              {S.access.read}
            </text>
          </g>

          {/* ---- prepared: matched, exception, draft ---- */}
          <g data-scene="prep-lines" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round">
            <line data-scene-line="100% 0%" x1="262" y1="206" x2="110" y2="250" />
            <line data-scene-line="50% 0%" x1="280" y1="206" x2="280" y2="250" />
            <line data-scene-line="0% 0%" x1="298" y1="206" x2="450" y2="250" />
          </g>
          <g data-scene="prepared">
            {PREP_X.map((x, i) => (
              <g key={x} data-scene-item>
                <rect
                  x={x}
                  y="250"
                  width="140"
                  height="40"
                  rx="8"
                  fill="var(--surface)"
                  stroke={PREP_STROKE[i]}
                  strokeWidth="1.5"
                />
                <text x={x + 70} y="275" textAnchor="middle" {...label}>
                  {S.prepared[i]}
                </text>
              </g>
            ))}
          </g>

          {/* ---- approval ---- */}
          <g data-scene="approve-line" stroke="var(--algo-sky)" strokeWidth="1.5" strokeLinecap="round">
            <line data-scene-line="50% 0%" x1="110" y1="290" x2="110" y2="334" />
          </g>
          <g data-scene="approver">
            <rect x="40" y="334" width="140" height="52" rx="8" fill="var(--surface-raised)" stroke="var(--algo-sky)" strokeWidth="1.5" />
            <circle cx="66" cy="360" r="11" fill="var(--bg)" stroke="var(--algo-sky)" strokeWidth="1.5" />
            <path
              data-scene="tick"
              d="M61 360 l4 4 l7 -8"
              fill="none"
              stroke="var(--algo-aqua)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x="88" y="365" {...label}>
              {S.approver}
            </text>
          </g>

          {/* ---- write, only after approval ---- */}
          <g data-scene="write-line" stroke="url(#algo-write)" strokeWidth="1.5" strokeLinecap="round">
            <defs>
              <linearGradient id="algo-write" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--algo-sky)" />
                <stop offset="100%" stopColor="var(--algo-aqua)" />
              </linearGradient>
            </defs>
            <line data-scene-line="0% 50%" x1="180" y1="360" x2="380" y2="360" />
            <rect className="max-sm:hidden" x="214" y="348" width="132" height="24" rx="12" fill="var(--bg)" stroke="var(--border-strong)" />
            {/* stroke="none": the group's gradient stroke is for the line, and
                on text it renders as a smeared outline. */}
            <text className="max-sm:hidden" x="280" y="364" textAnchor="middle" {...label} fontSize="12" fill="var(--fg-muted)" stroke="none">
              {S.access.write}
            </text>
          </g>
          <g data-scene="record">
            <rect x="380" y="334" width="140" height="52" rx="8" fill="var(--surface)" stroke="var(--algo-aqua)" strokeWidth="1.5" />
            <text x="450" y="356" textAnchor="middle" {...label} fontSize="13">
              {S.record}
            </text>
            <text className="max-sm:hidden" x="450" y="374" textAnchor="middle" {...label} fontSize="12" fill="var(--algo-aqua)">
              {S.approved}
            </text>
          </g>

          {/* ---- the audit line ---- */}
          <text data-scene="audit" x="280" y="408" className="max-sm:hidden" textAnchor="middle" {...label} fontSize="12" fill="var(--fg-muted)">
            {S.audit}
          </text>
        </svg>
      </div>
    </div>
  );
}
