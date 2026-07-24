/**
 * Foot — an ink slab with the wordmark as the dominant object.
 *
 * In dark mode the slab does NOT invert with the tokens. `bg-ink` means "the
 * contrast surface", and honouring that literally here would drop a
 * near-white 0.945 plate across the bottom of a dark page. The footer wants
 * to read as the quiet end of the document, so it takes the RAISED surface
 * instead — a step up from the ground, not a reversal of it.
 *
 * The wordmark is the composition: set to the full measure, cropped by the
 * viewport, with the meta reduced to a single readout line beneath it. No
 * link columns, no hairline-and-two-columns arrangement.
 */

import Link from "next/link";
import { BRAND, FOOT, ROUTES } from "@/lib/content";

export default function Foot() {
  return (
    <footer className="relative z-content bg-ink pb-20 pt-16 text-porcelain dark:bg-paper dark:text-ink md:pb-24 md:pt-20">
      <div className="mx-auto max-w-[110rem] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <p className="max-w-xs text-sm leading-relaxed text-porcelain/55 dark:text-ink/55">{FOOT.line}</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-2">
            {ROUTES.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="narrow text-[12px] uppercase tracking-[0.12em] text-porcelain/60 transition-colors dark:text-ink/60 duration-300 hover:text-vermilion"
              >
                {r.label}
              </Link>
            ))}
            <a
              href={`mailto:${BRAND.contact}`}
              className="narrow text-[12px] uppercase tracking-[0.12em] text-porcelain/60 transition-colors dark:text-ink/60 duration-300 hover:text-vermilion"
            >
              Contact
            </a>
          </nav>
        </div>

        {/* the wordmark IS the footer. Sized to the measure and clipped by
            its own box — an oversized word must never push the document
            wider, because `overflow-x: clip` on <html> does not contain a
            child that simply overflows its inline box. */}
        <div className="mt-10 overflow-hidden">
          <p
            aria-hidden
            className="wide select-none whitespace-nowrap text-[15.5vw] leading-[0.78] text-porcelain/90 dark:text-ink/90"
          >
            {BRAND.name}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-porcelain/12 dark:border-ink/12 pt-5">
          <span className="readout text-porcelain/40 dark:text-ink/40">
            {BRAND.maker} · {BRAND.status}
          </span>
          <span className="readout text-porcelain/40 dark:text-ink/40">{FOOT.meta}</span>
        </div>
      </div>
    </footer>
  );
}
