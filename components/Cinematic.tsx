"use client";

/**
 * Cinematic — the statement, laid back in space.
 *
 * The reference tilts its paragraph away from the reader on a 400px
 * perspective and drifts it upward as the page moves, fading it in and back
 * out across four scroll keyframes (08-synapsex.html:838-851). The effect is
 * that the sentence passes THROUGH the frame rather than sitting in it, which
 * is what hands the eye from the hero to the page proper.
 *
 * The reference keys those fades to whole-document progress. That is only
 * safe on a page whose length never changes — here the hero alone is a 280vh
 * track, so document progress means something different every time a section
 * is added below. This measures its OWN rect against the viewport instead, so
 * the beat lands in the same place regardless of what the page grows into.
 *
 * The tilt is dropped under reduced motion and below 768px: a 24-degree
 * rotation of body copy on a phone is unreadable, and the reference's own
 * mobile rules already strip the surrounding chrome.
 */

import { useEffect, useRef } from "react";
import { GLASS } from "@/components/Glass";
import { onFrame } from "@/lib/stage";
import { STATEMENT } from "@/lib/content";

export default function Cinematic() {
  const secRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    const inner = innerRef.current;
    if (!sec || !inner) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const flat = reduced || window.innerWidth < 768;

    // Driven by the stage's scroll handler, not by its own rAF. rAF is paused
    // outright in a backgrounded tab, and this element starts at opacity 0 —
    // so on a frame loop it can be trapped invisible with nothing to explain
    // why. onFrame also fires once on subscribe, so it is correct from mount.
    const apply = () => {
      const vh = window.innerHeight || 1;
      const r = sec.getBoundingClientRect();

      // 0 as the section's top reaches the bottom of the viewport,
      // 1 as its bottom leaves the top
      const t = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));

      // the reference's shape: in, hold, out
      let op: number;
      if (t <= 0.12) op = 0;
      else if (t <= 0.32) op = (t - 0.12) / 0.2;
      else if (t <= 0.62) op = 1;
      else if (t <= 0.86) op = 1 - (t - 0.62) / 0.24;
      else op = 0;

      inner.style.opacity = String(Math.max(0, Math.min(1, op)));

      if (!flat) {
        const y = -120 * t;
        inner.style.transform = `rotateX(24deg) translateY(${y.toFixed(
          1
        )}px) translateZ(15px)`;
      }
    };
    return onFrame(apply);
  }, []);

  return (
    <section
      ref={secRef}
      className="pointer-events-none relative mx-auto w-full max-w-5xl px-6 pb-32 pt-24"
      style={{ perspective: "400px" }}
    >
      <div
        ref={innerRef}
        className="text-center"
        style={{ transformStyle: "preserve-3d", opacity: 0 }}
      >
        <div className={`${GLASS} px-6 py-10 md:px-12 md:py-14`}>
          <h2 className="wide-thin mx-auto max-w-[22ch] text-d2">
            {STATEMENT.big}
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-graphite">
            {STATEMENT.body}
          </p>
        </div>
      </div>
    </section>
  );
}
