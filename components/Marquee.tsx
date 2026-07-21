"use client";

/**
 * Marquee — a continuous belt of terms, transform-only.
 *
 * Two identical tracks translated by -50% in a keyframe; the seam is
 * invisible because the second track is an exact copy. Pauses under reduced
 * motion (the list is still fully readable, just static).
 */

export default function Marquee({ items }: { items: readonly string[] }) {
  const track = (
    <ul className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap">
          <span className="wide px-6 text-[clamp(1.6rem,3.4vw,2.6rem)]">{t}</span>
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-porcelain/60" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative flex overflow-hidden" aria-label={items.join(", ")}>
      <div className="flex animate-[belt_28s_linear_infinite] motion-reduce:animate-none">
        {track}
        <span aria-hidden className="contents">
          {track}
        </span>
      </div>
      <style>{`@keyframes belt{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}`}</style>
    </div>
  );
}
