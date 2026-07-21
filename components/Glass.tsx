/**
 * The liquid-glass plate.
 *
 * Almost no fill — 5% — so the panel is essentially a lens rather than a
 * surface. What makes it read as glass at that transparency is everything
 * except the fill: a heavy backdrop blur that averages the paper field behind
 * it into a smooth tone, a saturation lift so the blurred ground keeps some
 * life, a hairline edge, and a lit top bevel.
 *
 * Square corners, no rounding. This site's plates are specimen plates.
 *
 * LEGIBILITY IS THE RISK. At 5% fill the panel contributes almost nothing of
 * its own, so the type is effectively sitting on whatever the blur averages
 * the field to. That average is light — the ground is porcelain and the
 * fragments are paper — so ink copy clears comfortably, but this is the first
 * thing to re-measure if the field behind it is ever darkened.
 */
export const GLASS =
  "bg-porcelain/5 backdrop-blur-3xl backdrop-saturate-[1.6] " +
  "border border-white/50 " +
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75),0_28px_70px_-40px_rgba(23,22,32,0.4)]";
