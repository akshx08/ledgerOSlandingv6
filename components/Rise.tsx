"use client";

/**
 * Rise — a clip-path line reveal.
 *
 * The content is VISIBLE by default and the effect is additive: a transform
 * on an already-painted element. A reveal that gates visibility ships blank
 * whenever the transition never fires (hidden tab, headless render), which
 * is a bug dressed as a design choice.
 *
 * Deliberately not applied to every section — used on the three big
 * statements only, where the line-by-line lift earns its place.
 */

import { useEffect, useRef, useState } from "react";

export default function Rise({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only arm the animation for content that is genuinely still below the
    // fold. Anything already on screen stays up — there is no reveal to play,
    // and hiding it would depend on an observer callback to undo.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return;

    setShown(false);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "-12% 0px -12% 0px" }
    );
    io.observe(el);

    // Belt and braces: if the observer never fires — throttled rAF, a hidden
    // tab, a headless render — show it anyway rather than shipping a blank
    // section. A missed reveal must never cost the reader the content.
    const failsafe = window.setTimeout(() => {
      setShown(true);
      io.disconnect();
    }, 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <div
        style={{
          transform: shown ? "translateY(0)" : "translateY(105%)",
          opacity: shown ? 1 : 0,
          transition: `transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}s, opacity .7s ease-out ${delay}s`,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
