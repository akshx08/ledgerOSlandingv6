"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis inertial scroll. Bails on reduced motion and on `?native=1`, which is
 * the escape hatch the screenshot protocol needs. Renders nothing.
 */
export default function Smooth() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const native = new URLSearchParams(window.location.search).has("native");
    if (reduce || native) return;

    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, touchMultiplier: 1.5 });
    let raf = 0;
    const tick = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
