/**
 * The liquid-glass plate — iOS "materials" model.
 *
 * ZERO FILL. There is no background tint at all; the panel is purely a lens.
 * Everything that makes it read as glass is done to what is BEHIND it, which
 * is the whole idea of the iOS material and the thing a flat translucent
 * white gets wrong:
 *
 *   blur       — separates the panel from the field so type has a quiet bed
 *   saturate   — the vibrancy lift; blurred colour goes muddy without it
 *   brightness — a hair above 1, which is what actually buys the contrast a
 *                fill would otherwise have provided, without tinting anything
 *
 * The edge does the rest: a hairline that is brighter along the top than the
 * bottom, so the plate catches light like a physical pane rather than sitting
 * flat. Corners are softened to a radius rather than square — the one place
 * this site departs from its specimen-plate language, because a hard-cornered
 * pane of glass reads as a cut-out, not as a material.
 *
 * LEGIBILITY IS THE RISK, and it is now carried entirely by the backdrop.
 * With no fill, ink copy is sitting on whatever the blur averages the field
 * to. That average is light — porcelain ground, paper fragments — so it
 * clears comfortably. Re-measure if the field behind is ever darkened, and
 * note the hero copy exits at `assemble > 0.72`, before the wordmark darkens
 * underneath it; that timing is load-bearing, not incidental.
 */
export const GLASS =
  "bg-transparent " +
  "backdrop-blur-2xl backdrop-saturate-[1.8] backdrop-brightness-[1.04] " +
  "border border-white/40 rounded-2xl " +
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),inset_0_-1px_0_0_rgba(255,255,255,0.18),0_18px_50px_-30px_rgba(15,14,23,0.35)]";
