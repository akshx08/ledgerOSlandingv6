/**
 * Stage bus.
 *
 * One writer (the Stage), many readers (the hero copy, the cinematic
 * paragraph). Scroll is published as a plain mutable object rather than React
 * state on purpose: these values change every frame, and putting a per-frame
 * number through a reducer would re-render the whole hero sixty times a
 * second to move two transforms.
 *
 * Readiness is the one thing that IS an event, because it happens once.
 */

export const scrollState = {
  /** raw normalised document scroll, 0 → 1 */
  p: 0,
  /** the same value trailed — the reference lerps at 0.12 and so do we */
  smooth: 0,
  /** raw scrollY in px, for the parallax that is authored in pixels */
  px: 0,
  /** scrollY expressed in viewport heights — the hero's budget is measured in
   *  screens, so a section added below cannot silently re-time the opening */
  screens: 0,
  /** 0 → 1 resolve of chaos into the wordmark, scrubbed by scroll */
  assemble: 0,
  /** 0 → 1 detonation of the settled word */
  shatter: 0,
  /** 0 → 1 unlock, part, and push through the vault doors */
  vault: 0,
  /** 0 → 1 eased release of the canvas layer at the very end */
  wordFade: 0,
};

/**
 * Anything whose value is a pure function of scroll position is published
 * here from the SCROLL HANDLER, not from a rAF loop, and subscribers apply it
 * synchronously. rAF is paused outright in a backgrounded tab — not throttled,
 * paused — so a hero that computes its state only inside a frame loop is
 * frozen at t=0 on a restored scroll position until something happens to
 * schedule a frame. Scroll events keep firing regardless.
 */
const frameSubs = new Set<() => void>();

export function onFrame(cb: () => void) {
  frameSubs.add(cb);
  cb();
  return () => {
    frameSubs.delete(cb);
  };
}

export function emit() {
  frameSubs.forEach((f) => f());
}

let ready = false;
const subs = new Set<(r: boolean) => void>();

export function isReady() {
  return ready;
}

export function setReady() {
  if (ready) return;
  ready = true;
  subs.forEach((f) => f(true));
}

/** Fires immediately if readiness has already happened. */
export function onReady(f: (r: boolean) => void) {
  if (ready) f(true);
  subs.add(f);
  return () => {
    subs.delete(f);
  };
}

/** Test/dev reset — the stage remounts under StrictMode. */
export function resetStage() {
  ready = false;
  subs.clear();
  scrollState.p = 0;
  scrollState.smooth = 0;
  scrollState.px = 0;
  scrollState.screens = 0;
  scrollState.assemble = 0;
  scrollState.shatter = 0;
  scrollState.vault = 0;
  scrollState.wordFade = 0;
}
