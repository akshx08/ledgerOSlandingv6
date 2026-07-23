"use client";

/**
 * Stage — the fixed field under the whole document, and the clock that drives it.
 *
 * THE SCROLLBAR IS THE ONLY CLOCK. Every act is scrubbed, never played: the
 * visitor drives the fragments into the word, detonates it, and drives the
 * camera through the debris into the page — and can stop or reverse at any
 * beat. An earlier
 * build ran the resolve on a timer and it was wrong; a hero that performs
 * itself while the visitor sits still is a video.
 *
 * The scroll budget, in screens:
 *
 *   0        → ASSEMBLE      the fragments resolve into the wordmark
 *   ASSEMBLE → HOLD_END      the word is held
 *   HOLD_END → SHATTER_END   the word DETONATES — debris flies past the viewer
 *   ENTER_*  (overlapping)   the camera drives forward through the debris and
 *                            the page scales up to meet it (Entry.tsx)
 *   FADE_*                   the host quietly releases the frame — invisible,
 *                            because the camera has arrived in porcelain,
 *                            which IS the page's ground
 *
 * The shatter and the entry overlap on purpose: the drive begins while the
 * debris is still in the air, which is what makes it one continuous event
 * instead of two queued animations.
 *
 * Everything is measured in viewport heights rather than document
 * percentages, so adding a section further down cannot silently re-time the
 * opening — the failure mode v2's document-normalised aperture shipped with.
 *
 * Pins: `?assemble=0.7`, `?shatter=0.5`, `?enter=0.4` each hold their phase
 * still and skip the scroll listener — the tuning surface, and the way to
 * capture a beat in a pane where scrolled screenshots come back blank.
 * Pinning a later phase implies the earlier ones are complete.
 */

import { useEffect, useRef } from "react";
import Assembly from "@/components/Assembly";
import { emit, scrollState, setReady } from "@/lib/stage";

/*
 * The whole choreography was halved (2.45 screens → 1.22). It cost two and a
 * half screens of scrolling to reach the first sentence of the pitch, which
 * is the largest single source of "this page is mostly empty". The beats keep
 * their proportions exactly; only the budget shrank, so the hero still
 * resolves, holds, and detonates — in half the distance.
 */

/** screens of scroll spent resolving chaos → word */
const ASSEMBLE = 0.67;
/** the word is held from ASSEMBLE until here */
const HOLD_END = 0.8;
/** the detonation — short, because violence is short */
const SHATTER_END = 1.0;
/** The drive begins while debris is still in the air, and lands FAST. */
const ENTER_START = 0.85;
const ENTER_END = 1.12;
/** the host releases the frame across this window — by then the camera is
 *  in clear porcelain, so nothing visible actually changes; this only frees
 *  the GPU layer */
const FADE_START = 1.1;
const FADE_END = 1.22;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
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
  const shatterRef = useRef(0);
  const enterRef = useRef(0);
  const scrollRef = useRef(0);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const q = new URLSearchParams(window.location.search);
    const pinA = q.get("assemble");
    const pinS = q.get("shatter");
    const pinE = q.get("enter");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;

    const publish = (assemble: number, shatter: number, enter: number) => {
      assembleRef.current = assemble;
      shatterRef.current = shatter;
      enterRef.current = enter;
      scrollState.assemble = assemble;
      scrollState.shatter = shatter;
      scrollState.enter = enter;
      const d = document.documentElement.dataset;
      d.assemble = assemble.toFixed(3);
      d.shatter = shatter.toFixed(3);
      d.enter = enter.toFixed(3);
    };

    /* ---------- scroll ----------
     * Everything the hero's state depends on is a pure function of scroll
     * position, so it is computed HERE rather than in the frame loop — the
     * page is then correct on a restored scroll position, on a deep link,
     * and in a tab where rAF is paused. */
    const apply = () => {
      const s = scrollState.screens;

      const assemble = reduced ? 1 : clamp01(s / ASSEMBLE);
      const shatter = clamp01((s - HOLD_END) / (SHATTER_END - HOLD_END));
      const enter = clamp01((s - ENTER_START) / (ENTER_END - ENTER_START));
      publish(assemble, shatter, enter);

      const fade = easeInOut(
        clamp01((s - FADE_START) / (FADE_END - FADE_START))
      );
      scrollState.wordFade = fade;

      if (host) {
        // No transform, no blur: the camera does all the leaving now. The
        // host only releases its layer once the frame is already pure
        // porcelain, so this fade is invisible by construction.
        host.style.opacity = String((1 - fade) * presence);
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
      scrollState.p = max > 0 ? clamp01(y / max) : 0;
      scrollState.screens = y / vh;
      apply();
    };
    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);

    /* ---------- the pinned case ----------
     * A later pin implies the earlier phases are complete: `?enter=0.5`
     * means "the word was built and has shattered; hold the drive halfway" —
     * without having to spell all three out. */
    if (pinA !== null || pinS !== null || pinE !== null) {
      const enter = clamp01(parseFloat(pinE ?? "0") || 0);
      const shatter =
        pinS !== null
          ? clamp01(parseFloat(pinS) || 0)
          : enter > 0
            ? 1
            : 0;
      const assemble =
        pinA !== null ? clamp01(parseFloat(pinA) || 0) : 1;
      publish(assemble, shatter, enter);
      setReady();
      if (host) host.style.opacity = String(presence);
      return () => {
        window.removeEventListener("scroll", readScroll);
        window.removeEventListener("resize", readScroll);
      };
    }

    // The copy may arrive at once — the resolve waits for the visitor.
    setReady();

    /* ---------- the frame ----------
     * Only what needs a clock: the trailing scroll value the scene drifts
     * on. If this loop never runs, the hero is still in the right state. */
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
      // a paused rAF left the entire hero invisible with nothing in the
      // console to say why.
      style={{ opacity: presence, willChange: "opacity" }}
    >
      <Assembly
        assembleRef={assembleRef}
        shatterRef={shatterRef}
        enterRef={enterRef}
        scrollRef={scrollRef}
      />
    </div>
  );
}
