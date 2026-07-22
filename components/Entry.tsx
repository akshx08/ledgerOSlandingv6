"use client";

/**
 * Entry — the page pops out to meet the viewer.
 *
 * After the word detonates there is no set-piece: the destination is the
 * site itself. Everything below the hero starts small and deep — scaled
 * down, slightly translucent, further away — and as the camera drives
 * forward through the debris, the page scales up through the porcelain to
 * full size, arriving exactly as the canvas releases the frame. The
 * shattered word does not give way to a transition; it gives way to the
 * product's first argument.
 *
 * Driven by the stage's scroll handler (`scrollState.enter`), so it is a
 * pure function of scroll position: correct on a restored scroll position,
 * on a deep link, and in a tab where rAF is paused.
 *
 * Once the entry completes, the transform is cleared to `none` — not left
 * at scale(1). A transform on this wrapper creates a containing block, and
 * the rest of the site's browsing life should happen in a normal one.
 *
 * Under reduced motion the page is simply already there.
 */

import { useEffect, useRef } from "react";
import { onFrame, scrollState } from "@/lib/stage";

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function Entry({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const apply = () => {
      const en = scrollState.enter;

      if (reduced || en >= 1) {
        el.style.transform = "none";
        el.style.opacity = "1";
        return;
      }

      const e = easeInOut(en);
      // From 82% and half-present to full presence. The origin sits at the
      // top of the wrapper, centred — the visible first section grows toward
      // the viewer out of the middle of the frame rather than swinging up
      // from a corner. The floor is deliberately high: the incoming copy is
      // the thing that ends the porcelain stretch, so it has to be readable
      // while it is still arriving, not only once it has arrived.
      const sc = 0.82 + 0.18 * e;
      el.style.transform = `scale(${sc.toFixed(4)})`;
      el.style.opacity = String(0.5 + 0.5 * e);
    };

    el.style.transformOrigin = "50% 0";
    el.style.willChange = "transform, opacity";
    return onFrame(apply);
  }, []);

  return <div ref={ref}>{children}</div>;
}
