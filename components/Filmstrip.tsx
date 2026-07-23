"use client";

/**
 * Filmstrip — the five stages as a horizontal reel driven by vertical scroll.
 *
 * A tall track holds a sticky viewport; scrolling down translates the reel
 * sideways. The stage number is enormous and cropped by the frame edge, so
 * what you read is a continuous strip rather than a row of equal cards.
 *
 * Under 768px and under reduced motion it degrades to an ordinary vertical
 * list — a horizontal hijack on a phone is a trap, not an effect.
 */

import { useEffect, useRef, useState } from "react";
import { STAGES } from "@/lib/content";

export default function Filmstrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const [horizontal, setHorizontal] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sync = () => setHorizontal(mq.matches && !reduced);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!horizontal) return;
    const track = trackRef.current;
    const reel = reelRef.current;
    if (!track || !reel) return;

    let raf = 0;
    let eased = 0;
    let target = 0;
    let lastT = 0;

    const measure = () => {
      const rect = track.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const travelled = Math.min(Math.max(-rect.top, 0), Math.max(distance, 1));
      target = distance > 0 ? travelled / distance : 0;
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      measure();
      if (t - lastT > 250) eased = target;
      lastT = t;
      eased += (target - eased) * 0.12;
      const span = reel.scrollWidth - window.innerWidth;
      reel.style.transform = `translate3d(${-eased * Math.max(span, 0)}px,0,0)`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [horizontal]);

  const panels = STAGES.map((s, i) => (
    <article
      key={s.key}
      className="relative flex w-[86vw] shrink-0 flex-col justify-between border-l rule px-6 py-10 md:w-[52vw] md:px-10 md:py-0 lg:w-[42vw]"
    >
      {/* the numeral is the graphic — cropped, oversized, behind the text */}
      <span
        aria-hidden
        className="wide pointer-events-none absolute -top-[3vh] right-2 select-none text-[26vh] leading-none text-ink/[0.055] md:right-6 md:text-[34vh]"
      >
        {s.n}
      </span>
      <div className="relative">
        <span className="readout text-vermilion">{s.spec}</span>
        <h2 className="wide mt-4 text-[clamp(2rem,4.6vw,3.4rem)]">{s.name}</h2>
      </div>
      <div className="relative mt-8 md:mt-0 md:max-w-sm">
        <p className="text-[15px] leading-relaxed text-graphite">{s.line}</p>
        <p className="mt-4 border-t rule pt-4 text-[13.5px] leading-relaxed text-ink">
          {s.detail}
        </p>
      </div>
      <span className="readout relative mt-8 text-graphite md:mt-0">
        {i + 1} / {STAGES.length}
      </span>
    </article>
  ));

  if (!horizontal) {
    return <div className="flex flex-col">{panels}</div>;
  }

  return (
    <div ref={trackRef} style={{ height: `${STAGES.length * 62}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div
          ref={reelRef}
          className="flex h-[62vh] items-stretch pl-5 pr-[18vw] md:pl-10"
          style={{ willChange: "transform" }}
        >
          {panels}
        </div>
      </div>
    </div>
  );
}
