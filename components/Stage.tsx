"use client";

/**
 * Stage — the fixed field under the whole document, and the clock that drives it.
 *
 * THE SCROLLBAR IS THE ONLY CLOCK. The resolve is scrubbed, never played: the
 * visitor drives the fragments into the word, can stop halfway, and can run it
 * backwards. An earlier build ran this on a timer and it was wrong — a hero
 * that performs itself while the visitor sits still is a video, and the whole
 * argument of the scene is that the sorting happens because you asked for it.
 *
 * The scroll budget, in screens:
 *
 *   0        → ASSEMBLE   the fragments resolve into the wordmark
 *   ASSEMBLE → HOLD_END   the word is held, the brutalist plate has landed
 *   HOLD_END → FADE_END   the word eases out and hands the page over
 *
 * Everything is measured in viewport heights rather than in document
 * percentages, so adding a section further down cannot silently re-time the
 * opening — which is the failure mode v2's original document-normalised
 * aperture shipped with.
 *
 * `?assemble=0.42` pins the resolve and skips the scroll listener — the
 * tuning surface, and the way to hold a beat still in a pane where scrolled
 * screenshots come back blank.
 */

import { useEffect, useRef } from "react";
import Assembly from "@/components/Assembly";
import { emit, scrollState, setReady } from "@/lib/stage";

/** screens of scroll spent resolving chaos → word */
const ASSEMBLE = 1.35;
/** the word is held from ASSEMBLE until here */
const HOLD_END = 1.7;
/** and has flown away by here, handing the frame to the page behind it.
 *  Kept tight on purpose — once the word is made, every further screen of
 *  nothing but the word is a screen the visitor spends learning nothing. */
const FADE_END = 2.3;

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function Stage({
  /** ceiling opacity — the home page gives it the full stage, the interior
   *  pages keep it as a quiet presence behind their own display type */
  presence = 1,
}: {
  presence?: number;
}) {
  const assembleRef = useRef(0);
  const scrollRef = useRef(0);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const pinned = new URLSearchParams(window.location.search).get("assemble");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;

    /* ---------- scroll ----------
     * This does the whole job. Everything the hero's state depends on is a
     * pure function of scroll position, so it is computed HERE rather than in
     * the frame loop — the page is then correct on a restored scroll position,
     * on a deep link, and in a tab where rAF is paused. The frame loop is left
     * with only the things that genuinely need a clock. */
    const apply = () => {
      const s = scrollState.screens;

      const assemble = reduced ? 1 : Math.min(1, Math.max(0, s / ASSEMBLE));
      assembleRef.current = assemble;
      scrollState.assemble = assemble;
      document.documentElement.dataset.assemble = assemble.toFixed(3);

      // THE HAND-OFF. Once the word has been held, it eases out — a cubic
      // in-out on opacity rather than a linear ramp, so it leaves the way it
      // arrived and does not simply get switched off.
      const fadeT = Math.min(
        1,
        Math.max(0, (s - HOLD_END) / (FADE_END - HOLD_END))
      );
      const fade = easeInOut(fadeT);
      scrollState.wordFade = fade;

      if (host) {
        // THE WORD LEAVES. It does not dissolve on the spot — it lifts out of
        // frame and past the viewer, and the page comes up behind it. Scale
        // and rise together read as "flying away"; either alone reads as a
        // zoom or as a slide.
        //
        // Blur stays modest. The reference goes to 55px, but on a near-white
        // ground that is an even grey wash costing a full-screen filter pass
        // for no image.
        const blur = fade * 12;
        host.style.opacity = String((1 - fade) * presence);
        host.style.transform =
          `translate3d(0, ${(-fade * 46).toFixed(2)}vh, 0) ` +
          `scale(${(1 + fade * 0.22).toFixed(4)})`;
        host.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
      }

      emit();
    };

    const readScroll = () => {
      const vh = window.innerHeight || 1;
      const max =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const y = window.scrollY;
      scrollState.px = y;
      scrollState.p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      scrollState.screens = y / vh;
      apply();
    };
    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);

    /* ---------- the pinned case ---------- */
    if (pinned !== null) {
      const v = Math.max(0, Math.min(1, parseFloat(pinned) || 0));
      assembleRef.current = v;
      scrollState.assemble = v;
      document.documentElement.dataset.assemble = v.toFixed(3);
      setReady();
      if (host) {
        host.style.opacity = String(presence);
        host.style.transform = "scale(1)";
        host.style.filter = "none";
      }
      return () => {
        window.removeEventListener("scroll", readScroll);
        window.removeEventListener("resize", readScroll);
      };
    }

    // The copy may arrive at once — it is not gated on the resolve any more,
    // because the resolve now waits for the visitor.
    setReady();

    /* ---------- the frame ----------
     * Only what needs a clock: the trailing scroll value the scene drifts on.
     * If this loop never runs, the hero is still in the right state. */
    const frame = () => {
      raf = requestAnimationFrame(frame);
      scrollState.smooth += (scrollState.p - scrollState.smooth) * 0.12;
      if (Math.abs(scrollState.p - scrollState.smooth) < 0.0001) {
        scrollState.smooth = scrollState.p;
      }
      scrollRef.current = scrollState.smooth;
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
    };
  }, [presence]);

  return (
    <div
      ref={hostRef}
      className="pointer-events-none fixed inset-0 z-stage"
      // Visible by DEFAULT, exactly as v2's Rise treats its content. An
      // earlier version faded this in from 0 inside the rAF loop, which meant
      // a paused rAF — a background tab, a stalled main thread — left the
      // entire hero invisible with nothing in the console to say why.
      style={{ opacity: presence, willChange: "filter, transform, opacity" }}
    >
      <Assembly assembleRef={assembleRef} scrollRef={scrollRef} />
    </div>
  );
}
