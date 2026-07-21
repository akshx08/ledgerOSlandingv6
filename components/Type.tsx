"use client";

/**
 * WeightType — a headline whose letters morph their variable-font `wght` and
 * `wdth` with proximity to the cursor.
 *
 * Adapted from Originkit's "Dynamic Weight" (originkit.dev). Changes: the
 * bundled Inter webfont is dropped in favour of the project's own Archivo
 * variable, BOTH axes are driven rather than weight alone, per-frame writes
 * go straight to the DOM nodes, and the whole loop is skipped for coarse
 * pointers and reduced motion — where it renders as ordinary static type.
 *
 * The semantic string is carried once in a visually-hidden span; the per
 * letter spans are aria-hidden, so screen readers get the sentence, not the
 * alphabet.
 */

import { useEffect, useRef } from "react";

type Props = {
  text: string;
  className?: string;
  /** resting → cursor-centre weight */
  from?: number;
  to?: number;
  /** resting → cursor-centre width */
  fromW?: number;
  toW?: number;
  /** proximity reach in px */
  reach?: number;
};

export default function WeightType({
  text,
  className = "",
  from = 300,
  to = 800,
  fromW = 118,
  toW = 122,
  reach = 320,
}: Props) {
  const hostRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const letters = Array.from(
      host.querySelectorAll<HTMLElement>("[data-l]")
    );
    const factors = new Float32Array(letters.length);
    const mouse = { x: -99999, y: -99999 };
    let raf = 0;
    let lastT = 0;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, Math.max(0, (t - (lastT || t)) / 1000));
      lastT = t;
      const a = 1 - Math.exp(-dt / 0.18);

      for (let i = 0; i < letters.length; i++) {
        const el = letters[i];
        const r = el.getBoundingClientRect();
        // offscreen letters cost nothing
        if (r.bottom < -200 || r.top > window.innerHeight + 200) continue;
        const dx = mouse.x - (r.left + r.width / 2);
        const dy = mouse.y - (r.top + r.height / 2);
        const d = Math.sqrt(dx * dx + dy * dy);
        const target = Math.min(Math.max(1 - d / reach, 0), 1);
        const f = factors[i] + (target - factors[i]) * a;
        factors[i] = f;
        const w = Math.round(from + (to - from) * f);
        const wd = (fromW + (toW - fromW) * f).toFixed(1);
        el.style.fontVariationSettings = `"wdth" ${wd}, "wght" ${w}`;
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [from, to, fromW, toW, reach, text]);

  const words = text.split(" ");
  return (
    <span ref={hostRef} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {word.split("").map((ch, ci) => (
            <span
              key={ci}
              data-l
              className="inline-block"
              style={{ fontVariationSettings: `"wdth" ${fromW}, "wght" ${from}` }}
            >
              {ch}
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
