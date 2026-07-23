"use client";

/**
 * Instrument — a precision crosshair cursor with a live coordinate readout.
 *
 * Adapted from Originkit's "Axis Cursor" (originkit.dev), rebuilt as a
 * document-level layer rather than a bounded container: the Framer canvas
 * branches are gone, position is written straight to the DOM in one rAF
 * instead of through React state, and the reticle dilates like an aperture
 * over interactive targets.
 *
 * Fine pointers only. Touch and coarse pointers keep the native cursor, and
 * reduced-motion keeps it too — a lagging custom cursor is a motion problem.
 */

import { useEffect, useRef } from "react";

export default function Instrument() {
  const vRef = useRef<HTMLDivElement>(null);
  const hRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.documentElement.classList.add("instrument");

    const pos = { x: -200, y: -200 };
    const eased = { x: -200, y: -200 };
    let dilate = 0;
    let targetDilate = 0;
    let visible = 0;
    let targetVisible = 0;
    let raf = 0;
    let lastT = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      targetVisible = 1;
      const el = e.target as HTMLElement | null;
      targetDilate = el?.closest("a,button,input,select,textarea,[data-target]") ? 1 : 0;
    };
    const onLeave = () => {
      targetVisible = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - lastT > 250) {
        eased.x = pos.x;
        eased.y = pos.y;
      }
      lastT = t;
      // the reticle tracks tight; the rails track tighter still so the
      // crosshair never feels rubbery
      eased.x += (pos.x - eased.x) * 0.32;
      eased.y += (pos.y - eased.y) * 0.32;
      dilate += (targetDilate - dilate) * 0.16;
      visible += (targetVisible - visible) * 0.16;

      const v = vRef.current;
      const h = hRef.current;
      const r = ringRef.current;
      const g = tagRef.current;
      if (v) {
        v.style.transform = `translate3d(${eased.x}px,0,0)`;
        v.style.opacity = String(visible * 0.22);
      }
      if (h) {
        h.style.transform = `translate3d(0,${eased.y}px,0)`;
        h.style.opacity = String(visible * 0.22);
      }
      if (r) {
        const s = 1 + dilate * 2.4;
        r.style.transform = `translate3d(${eased.x}px,${eased.y}px,0) translate(-50%,-50%) scale(${s})`;
        r.style.opacity = String(visible);
        r.style.borderWidth = `${1 + dilate * 0.6}px`;
      }
      if (g) {
        g.style.transform = `translate3d(${eased.x + 14}px,${eased.y + 14}px,0)`;
        g.style.opacity = String(visible * (1 - dilate) * 0.75);
        g.textContent = `${Math.round(pos.x)} ${Math.round(pos.y)}`;
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("instrument");
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-cursor hidden md:block" aria-hidden>
      <div
        ref={vRef}
        className="absolute left-0 top-0 h-screen w-px bg-ink opacity-0"
        style={{ willChange: "transform" }}
      />
      <div
        ref={hRef}
        className="absolute left-0 top-0 h-px w-screen bg-ink opacity-0"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-[18px] w-[18px] rounded-full border border-vermilion opacity-0"
        style={{ willChange: "transform" }}
      />
      <div
        ref={tagRef}
        className="readout absolute left-0 top-0 text-graphite opacity-0"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
