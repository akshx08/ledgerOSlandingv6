"use client";

/**
 * Scramble — the reference's ScrambleIn, ported.
 *
 * A line resolves out of noise once the stage is ready, and scrambles back
 * out the moment the visitor starts scrolling. Timings, thresholds and the
 * glyph set are lifted from 08-synapsex.html:643-725 rather than re-invented,
 * because the feel of it is in those exact numbers.
 *
 * Two things the reference does not do, added here because this is a real
 * page and not a demo: the semantic string lives in an sr-only span and the
 * animated glyphs are aria-hidden, so a screen reader gets the sentence and
 * not a stream of punctuation; and a failsafe reveals the text outright if
 * the loop never runs, so copy can never be trapped invisible.
 */

import { useEffect, useRef, useState } from "react";
import { onReady, scrollState } from "@/lib/stage";

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><";

type Phase = "idle" | "in" | "revealed" | "out" | "hidden";

export default function Scramble({
  text,
  delay = 0,
  className = "",
  as: Tag = "span",
}: {
  text: string;
  delay?: number;
  className?: string;
  as?: "span" | "div";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [failsafe, setFailsafe] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = text;
      el.style.opacity = "1";
      return;
    }

    let phase: Phase = "idle";
    let progress = 0;
    let lastTime = 0;
    let started = false;
    let armed = false;
    let raf = 0;

    const unsub = onReady(() => {
      armed = true;
    });

    // If the loop never runs — throttled tab, a bug — the copy still lands.
    const fs = window.setTimeout(() => setFailsafe(true), 2600 + delay);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      // Keyed to the RESOLVE, not to raw scroll. The reference scrambles out
      // on the first wheel click because scrolling is when its hero leaves;
      // here the first wheel click is when the animation STARTS, so the copy
      // has to survive the whole assembly and leave with it.
      const scrollActive = scrollState.assemble > 0.72;

      if (armed && phase === "idle" && !scrollActive && !started) {
        started = true;
        window.setTimeout(() => {
          phase = "in";
          progress = 0;
          lastTime = performance.now();
        }, delay);
        return;
      }

      if (scrollActive && (phase === "revealed" || phase === "in")) {
        phase = "out";
        progress = 0;
        lastTime = now;
      } else if (!scrollActive && (phase === "hidden" || phase === "out")) {
        phase = "in";
        progress = 0;
        lastTime = now;
      }

      if (phase === "in") {
        progress = Math.min(1, progress + (now - lastTime) / 900);
        lastTime = now;
        const t = progress;
        let out = "";
        for (let i = 0; i < text.length; i += 1) {
          if (text[i] === " ") {
            out += " ";
            continue;
          }
          const threshold = i / text.length;
          if (t >= threshold + 0.15) out += text[i];
          else if (t >= threshold - 0.1)
            out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          else out += " ";
        }
        el.textContent = out;
        el.style.opacity = "1";
        if (t >= 1) {
          phase = "revealed";
          el.textContent = text;
        }
      } else if (phase === "out") {
        progress = Math.min(1, progress + (now - lastTime) / 700);
        lastTime = now;
        const t = progress;
        let out = "";
        for (let i = 0; i < text.length; i += 1) {
          if (text[i] === " ") {
            out += " ";
            continue;
          }
          const threshold = i / text.length;
          if (t >= threshold + 0.2) out += " ";
          else if (t >= threshold - 0.05)
            out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          else out += text[i];
        }
        el.textContent = out;
        el.style.opacity = String(Math.max(0, 1 - t * 1.5));
        if (t >= 1) {
          phase = "hidden";
          el.textContent = text.replace(/\S/g, " ");
          el.style.opacity = "0";
        }
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fs);
      unsub();
    };
  }, [text, delay]);

  return (
    <Tag className={className} style={{ display: "block" }}>
      <span className="sr-only">{text}</span>
      <span
        ref={ref}
        aria-hidden
        style={{ opacity: failsafe ? 1 : 0, display: "inline-block" }}
      >
        {failsafe ? text : " "}
      </span>
    </Tag>
  );
}
