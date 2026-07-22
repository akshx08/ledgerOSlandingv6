"use client";

/**
 * Stage — the fixed field under the whole document, and the clock that drives it.
 *
 * THE SCROLLBAR IS THE ONLY CLOCK. Every act is scrubbed, never played: the
 * visitor drives the fragments into the word, detonates it, and drives the
 * camera through the vault — and can stop or reverse at any beat. An earlier
 * build ran the resolve on a timer and it was wrong; a hero that performs
 * itself while the visitor sits still is a video.
 *
 * The scroll budget, in screens:
 *
 *   0        → ASSEMBLE      the fragments resolve into the wordmark
 *   ASSEMBLE → HOLD_END      the word is held
 *   HOLD_END → SHATTER_END   the word DETONATES — debris flies past the viewer
 *   VAULT_*  (overlapping)   the dial turns, the doors part, the camera
 *                            drives through into porcelain light
 *   FADE_*                   the host quietly releases the frame — invisible,
 *                            because the vault interior IS the page's ground
 *
 * The shatter and the vault overlap on purpose: the doors begin to unlock
 * while the debris is still in the air, which is what makes it one continuous
 * event instead of two queued animations.
 *
 * Everything is measured in viewport heights rather than document
 * percentages, so adding a section further down cannot silently re-time the
 * opening — the failure mode v2's document-normalised aperture shipped with.
 *
 * Pins: `?assemble=0.7`, `?shatter=0.5`, `?vault=0.4` each hold their phase
 * still and skip the scroll listener — the tuning surface, and the way to
 * capture a beat in a pane where scrolled screenshots come back blank.
 * Pinning a later phase implies the earlier ones are complete.
 */

import { useEffect, useRef } from "react";
import Assembly from "@/components/Assembly";
import { emit, scrollState, setReady } from "@/lib/stage";

/** screens of scroll spent resolving chaos → word */
const ASSEMBLE = 1.35;
/** the word is held from ASSEMBLE until here */
const HOLD_END = 1.6;
/** the detonation — short, because violence is short */
const SHATTER_END = 2.0;
/** the unlock begins while debris is still in the air */
const VAULT_START = 1.8;
/** and the camera is through the doors by here */
const VAULT_END = 2.7;
/** the host releases the frame across this window — by then the camera is
 *  inside the vault and the frame is pure porcelain, so nothing visible
 *  actually changes; this only frees the GPU layer */
const FADE_START = 2.65;
const FADE_END = 2.9;

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
  const vaultRef = useRef(0);
  const scrollRef = useRef(0);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const q = new URLSearchParams(window.location.search);
    const pinA = q.get("assemble");
    const pinS = q.get("shatter");
    const pinV = q.get("vault");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;

    const publish = (assemble: number, shatter: number, vault: number) => {
      assembleRef.current = assemble;
      shatterRef.current = shatter;
      vaultRef.current = vault;
      scrollState.assemble = assemble;
      scrollState.shatter = shatter;
      scrollState.vault = vault;
      const d = document.documentElement.dataset;
      d.assemble = assemble.toFixed(3);
      d.shatter = shatter.toFixed(3);
      d.vault = vault.toFixed(3);
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
      const vault = clamp01((s - VAULT_START) / (VAULT_END - VAULT_START));
      publish(assemble, shatter, vault);

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
     * A later pin implies the earlier phases are complete: `?vault=0.5`
     * means "the word was built and has shattered; hold the doors half
     * open" — without having to spell all three out. */
    if (pinA !== null || pinS !== null || pinV !== null) {
      const vault = clamp01(parseFloat(pinV ?? "0") || 0);
      const shatter =
        pinS !== null
          ? clamp01(parseFloat(pinS) || 0)
          : vault > 0
            ? 1
            : 0;
      const assemble =
        pinA !== null
          ? clamp01(parseFloat(pinA) || 0)
          : shatter > 0 || vault > 0
            ? 1
            : 1;
      publish(assemble, shatter, vault);
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
        vaultRef={vaultRef}
        scrollRef={scrollRef}
      />
    </div>
  );
}
