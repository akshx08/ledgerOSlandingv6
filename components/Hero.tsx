"use client";

/**
 * Hero — the cold open, composed around the wordmark rather than over it.
 *
 * The section is a TRACK: tall enough to spend the scroll the resolve needs,
 * with the copy held sticky inside it so the visitor can read while they
 * drive the fragments together. The centre of the frame is left empty on
 * purpose — that is where the word lands.
 *
 * The copy sits on glass. Over a field of several thousand tumbling sheets
 * there is no flat tint that stays legible at every frame of the resolve, and
 * setting the type straight onto the field was the single hardest thing to
 * read in the first build. A blurred panel puts a floor under the contrast
 * without hiding what is behind it.
 *
 * Timing is keyed to the RESOLVE, not to raw scroll. Keying the exit to
 * scroll would have thrown the copy away on the first wheel click — which is
 * now the moment the animation starts, not the moment it ends.
 */

import Link from "next/link";
import { useEffect, useRef } from "react";
import Scramble from "@/components/Scramble";
import { GLASS } from "@/components/Glass";
import { onFrame, scrollState } from "@/lib/stage";
import { OPEN } from "@/lib/content";

/** The copy begins leaving well before the word is finished.
 *
 *  It used to hold to 0.72, which put a half-faded glass panel underneath a
 *  wordmark that was already dark — two dark things crossing, and it read as
 *  a collision rather than a hand-off. The copy is clear of the frame by the
 *  time the letterforms have any weight. */
const EXIT_FROM = 0.55;


export default function Hero() {
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Driven by the stage's scroll handler rather than by its own rAF: the
    // copy's exit is a pure function of the resolve, and it must be correct on
    // a restored scroll position even in a tab where frames never run.
    const apply = () => {
      const a = scrollState.assemble;
      const t = Math.min(1, Math.max(0, (a - EXIT_FROM) / (1 - EXIT_FROM)));
      const op = 1 - t;

      if (topRef.current) {
        topRef.current.style.opacity = String(op);
        topRef.current.style.transform = `translateY(${-26 * t}px)`;
        topRef.current.style.pointerEvents = op < 0.06 ? "none" : "auto";
      }
      if (botRef.current) {
        botRef.current.style.opacity = String(op);
        botRef.current.style.transform = `translateY(${18 * t}px)`;
        botRef.current.style.pointerEvents = op < 0.06 ? "none" : "auto";
      }
    };
    return onFrame(apply);
  }, []);

  return (
    // The track. Its height IS the resolve's scroll budget — see Stage's
    // ASSEMBLE / HOLD_END / FADE_END, which are measured in the same unit.
    // The track carries all three acts: resolve, hold, detonation, and the
    // drive through the debris. Its height is tuned so the next section is
    // rising into frame — scaling up through Entry — while the debris is
    // still in the air: the statement must be readable on the shatter's
    // heels, not after a stretch of empty porcelain.
    <section className="relative h-[132vh]">
      {/* On a phone the two plates used to stack to roughly the full 812px of
          screen, so the field they are supposed to be floating over was never
          visible and the cue collided with the dock. Mobile gets tighter
          padding, a smaller lede, and no cue — the dock is already there. */}
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between px-4 pb-24 pt-20 md:px-8 md:pb-14 md:pt-28">
        {/* ── top-left: the line ── */}
        <div ref={topRef} className="max-w-[22rem] sm:max-w-[32rem] lg:max-w-[40rem]">
          <div className={`${GLASS} px-5 py-5 md:px-8 md:py-7`}>
            <p className="readout mb-4 text-vermilion md:mb-6">
              <Scramble text={OPEN.kicker} delay={80} />
            </p>
            <h1 className="wide text-d1">
              {OPEN.line.map((l, i) => (
                <Scramble
                  key={l}
                  text={l}
                  delay={220 + i * 190}
                  className="block"
                  as="span"
                />
              ))}
            </h1>
          </div>
        </div>

        {/* ── bottom row: the middle stays empty for the word ── */}
        <div
          ref={botRef}
          className="mt-auto grid gap-4 md:grid-cols-12 md:items-end md:gap-6"
        >
          <div className={`${GLASS} px-5 py-5 md:col-span-6 md:px-7 md:py-7`}>
            <p className="human-body text-[13.5px] leading-[1.45] text-graphite md:text-[16.5px] md:leading-[1.52]">
              {OPEN.under}
            </p>
            <div className="mt-5 flex items-center gap-6 md:mt-6">
              <Link
                href="/access"
                className="group relative overflow-hidden bg-ink px-6 py-3.5 text-porcelain md:px-8 md:py-4"
              >
                <span className="narrow relative z-10 text-[13px] uppercase tracking-[0.12em]">
                  Request access
                </span>
                {/* a plate slides up, it does not glow or gradient */}
                <span className="absolute inset-0 translate-y-full bg-vermilion transition-transform duration-500 ease-expo group-hover:translate-y-0" />
              </Link>
            </div>
          </div>

          {/* hidden on phones: it sat directly under the dock and read as a
              second, broken nav bar */}
          <div className="hidden md:col-span-4 md:col-start-9 md:block md:justify-self-end">
            <p className={`${GLASS} readout px-4 py-3 text-graphite`}>
              {OPEN.cue} ↓
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
