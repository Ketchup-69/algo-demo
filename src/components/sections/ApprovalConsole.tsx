"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Status } from "@/components/ui";
import { useGsapContext } from "@/components/motion";
import { governance, type ConsoleRow } from "@/content/sections";
import { ease, revealStart, travel } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const C = governance.console;

/**
 * An approval queue, built in code. Not a screenshot, and it says so.
 *
 * The one state change it makes is the whole argument of the section: the
 * first row is awaiting approval, then it is approved, and an audit entry
 * appears. That happens once, as the console scrolls into view. The markup's
 * default is the FINAL state (approved, audit shown, the pending chip hidden
 * and out of the accessibility tree) so a visitor with JavaScript off or
 * reduced motion reads the finished picture, and a screen reader hears one
 * status, not two.
 *
 * The chips crossfade with `autoAlpha`, which sets visibility as well as
 * opacity, and the sequence toggles `aria-hidden` at the same moments — an
 * element at opacity 0 is invisible to the eye but still announced.
 *
 * Every identifier is a generic document number (§2). The status chips are
 * fills carrying an ink label, per the token system — never coloured text.
 */
function chipTone(status: ConsoleRow["status"]) {
  return status === "approved" ? "success" : status === "exception" ? "warning" : "neutral";
}

const expose = (el: Element | null, shown: boolean) => {
  if (!el) return;
  if (shown) el.removeAttribute("aria-hidden");
  else el.setAttribute("aria-hidden", "true");
};

export function ApprovalConsole() {
  const scope = useGsapContext<HTMLDivElement>(
    (_self, element) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Already in view (a reload mid-page, a deep link): leave the finished
        // picture alone rather than hide it in front of the reader.
        if (element.getBoundingClientRect().top < window.innerHeight * 0.85) return;

        const rows = gsap.utils.toArray<HTMLElement>("[data-console-row]", element);
        const pending = element.querySelector("[data-console-flip='pending']");
        const approved = element.querySelector("[data-console-flip='approved']");
        const auditLines = gsap.utils.toArray<HTMLElement>("[data-console-audit] li", element);

        // Starting picture: rows not yet in, first row still pending, no audit.
        gsap.set(rows, { opacity: 0, y: travel.sm });
        if (pending && approved) {
          gsap.set(pending, { autoAlpha: 1 });
          gsap.set(approved, { autoAlpha: 0 });
          expose(pending, true);
          expose(approved, false);
        }
        gsap.set(auditLines, { opacity: 0, y: 6 });

        const tl = gsap.timeline({
          defaults: { ease: ease.out },
          scrollTrigger: { trigger: element, start: revealStart, once: true },
        });
        tl.to(rows, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0);
        if (pending && approved) {
          tl.to(pending, { autoAlpha: 0, duration: 0.2, onComplete: () => expose(pending, false) }, 1.1)
            .to(approved, { autoAlpha: 1, duration: 0.3, onStart: () => expose(approved, true) }, 1.2);
        }
        tl.to(auditLines, { opacity: 1, y: 0, duration: 0.45, stagger: 0.12 }, 1.35);
      });
      return () => mm.revert();
    },
    { defer: true },
  );

  return (
    <figure ref={scope} className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-overlay">
        <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
          <span className="font-display text-sm font-medium text-fg">{C.title}</span>
          <span className="text-xs text-fg-muted tabular-nums">{C.rows.length}</span>
        </div>

        <table className="w-full border-collapse text-left text-sm">
          <thead className="sr-only">
            <tr>
              <th>{C.columns.item}</th>
              <th>{C.columns.agent}</th>
              <th>{C.columns.status}</th>
            </tr>
          </thead>
          <tbody>
            {C.rows.map((row, i) => {
              // The first row is the one that flips. It renders both chips,
              // stacked; the markup shows the approved one and the sequence
              // rewinds it to pending before playing forward.
              const flips = i === 0 && row.status === "pending";
              return (
                <tr
                  key={row.item}
                  data-console-row
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium text-fg sm:px-5">
                    <span className="block">{row.item}</span>
                    <span className="mt-0.5 block text-xs text-fg-muted sm:hidden">{row.agent}</span>
                  </td>
                  <td className="hidden px-3 py-3 text-fg-muted sm:table-cell">{row.agent}</td>
                  <td className="px-4 py-3 text-right sm:px-5">
                    {flips ? (
                      <span className="relative inline-grid">
                        <Status
                          tone="neutral"
                          data-console-flip="pending"
                          aria-hidden="true"
                          className="invisible col-start-1 row-start-1 text-xs opacity-0"
                        >
                          {C.statusLabels.pending}
                        </Status>
                        <Status
                          tone="success"
                          data-console-flip="approved"
                          className="col-start-1 row-start-1 justify-self-end text-xs"
                        >
                          {C.statusLabels.approved}
                        </Status>
                      </span>
                    ) : (
                      <Status tone={chipTone(row.status)} className="text-xs">
                        {C.statusLabels[row.status]}
                      </Status>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div data-console-audit className="border-t border-border bg-bg-subtle px-4 py-3 sm:px-5">
          <span className="block text-xs font-medium text-fg">{C.auditTitle}</span>
          <ul className="mt-2 flex flex-col gap-1 font-mono text-xs text-fg-muted">
            {C.auditLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>

      {C.illustrative ? (
        <figcaption className="text-xs text-fg-muted">{C.caption}</figcaption>
      ) : null}
    </figure>
  );
}
