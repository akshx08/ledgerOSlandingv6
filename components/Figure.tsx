"use client";

/**
 * Figure — the product surfaces as specimen plates.
 *
 * Square-cornered paper slabs on a hard offset shadow, tipped a degree or two
 * and drifting on a long transform-only cycle. No rounded panel, no border
 * chrome, no perspective tilt — these read as plates pinned to the page, and
 * the vermilion registration tick in the corner is the only ornament.
 */

import { COPILOT, INBOX_NOTE, INBOX_ROWS } from "@/lib/content";

function Plate({
  children,
  depth,
  label,
}: {
  children: React.ReactNode;
  depth: number;
  label: string;
}) {
  const tilt = [-1.1, 0.9, -0.6][depth % 3];
  return (
    <div className="hover-drift" style={{ animationDelay: `${depth * 1.7}s` }}>
      <div
        className="relative bg-paper"
        style={{
          transform: `rotate(${tilt}deg)`,
          boxShadow: `${depth % 2 ? -14 : 14}px 18px 0 0 oklch(var(--ink) / 0.07)`,
        }}
      >
        {/* registration tick */}
        <span
          aria-hidden
          className="absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-vermilion"
        />
        <div className="flex items-center justify-between border-b rule px-5 py-3">
          <span className="narrow text-[11px] uppercase tracking-[0.14em] text-ink">
            {label}
          </span>
          <span className="readout text-graphite">{INBOX_NOTE}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function Inbox() {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">Sample classified documents</caption>
      <tbody>
        {INBOX_ROWS.map((r) => (
          <tr key={`${r.type}-${r.client}-${r.field}`} className="border-b rule last:border-0">
            <td className="px-5 py-3.5">
              <span className="block text-[14px] font-medium">{r.type}</span>
              <span className="readout text-graphite">{r.form}</span>
            </td>
            <td className="px-2 py-3.5">
              <span
                className={`block text-[13px] ${
                  r.client === "Unassigned" ? "text-vermilion" : "text-graphite"
                }`}
              >
                {r.client}
              </span>
            </td>
            <td className="hidden px-2 py-3.5 sm:table-cell">
              <span className="readout text-graphite">{r.field}</span>
            </td>
            <td className="px-5 py-3.5 text-right">
              <span
                className={`readout inline-block px-2 py-1 ${
                  r.status === "NEW" ? "bg-vermilion text-porcelain" : "bg-ink/8 text-graphite"
                }`}
              >
                {r.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Copilot() {
  return (
    <div className="space-y-4 px-5 py-6">
      <p className="ml-auto max-w-[85%] bg-ink px-4 py-3 text-[13.5px] leading-relaxed text-porcelain">
        {COPILOT.ask}
      </p>
      <div className="max-w-[92%]">
        <p className="border-l-2 border-vermilion bg-ink/[0.04] px-4 py-3 text-[13.5px] leading-relaxed">
          {COPILOT.answer}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {COPILOT.cites.map((c) => (
            <span key={c} className="readout bg-vermilion/12 px-2 py-1 text-ink">
              ⌗ {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Override() {
  return (
    <div className="px-5 py-6">
      <div className="flex items-baseline gap-3">
        <span className="readout text-graphite line-through">Kalpataru Exports</span>
        <span className="readout text-vermilion">→</span>
        <span className="text-[14px] font-medium">Meridian Textiles</span>
      </div>
      <div className="mt-5 space-y-2.5">
        {[
          ["Type", "GST Notice · ASMT-10"],
          ["Amount", "₹4,18,200"],
          ["Reply by", "18 Aug 2026"],
          ["GSTIN", "27AAACK····1Z5"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between border-b rule pb-2">
            <span className="readout text-graphite">{k}</span>
            <span className="readout text-ink">{v}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 flex items-center gap-2">
        <span className="h-1.5 w-1.5 bg-vermilion" />
        <span className="readout text-graphite">CONFIDENCE 0.94 · ACCEPTED</span>
      </p>
    </div>
  );
}

export default function Figure({ kind, depth }: { kind: string; depth: number }) {
  if (kind === "copilot")
    return (
      <Plate depth={depth} label="Copilot">
        <Copilot />
      </Plate>
    );
  if (kind === "override")
    return (
      <Plate depth={depth} label="Correction">
        <Override />
      </Plate>
    );
  return (
    <Plate depth={depth} label="Document inbox">
      <Inbox />
    </Plate>
  );
}
