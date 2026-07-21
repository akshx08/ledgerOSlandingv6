# LedgerOS — v2, "Aperture"

A ground-up redesign of the LedgerOS site. Shares no layout, palette,
typeface, component, or visual metaphor with v1 (`../ledgeros-site`); the only
things carried across are the business facts, the sample records, and the
hardened waitlist endpoint.

Next.js 14 · React 18 · TypeScript · Tailwind 3.4 · Three.js · Lenis.
Runs locally on **http://localhost:3342** — not deployed.

## The concept

**The instrument opens.** A twelve-blade iris diaphragm in machined
aluminium, generated in code, with a glass element seated behind it. Page
scroll drives one mechanism — the blades rotate about their pivots and the
bore clears — and everything else follows: the glass warms toward the accent,
a jade-free vermilion wireframe rises through the middle of the swing, and the
instrument withdraws once content takes over.

It is a rotational mechanism, deliberately: v1's signature was a linear
explode with an annotation constellation, so v2 could not be either.

## Routes

| Route | What |
|---|---|
| `/` | Cold open (iris shut) → statement → vermilion drench + belt → three specimen plates → hand-off |
| `/system` | The five pipeline stages as a horizontal reel driven by vertical scroll; the unbuilt knowledge layer, stated as unbuilt; the roadmap as a ledger |
| `/practice` | A morning at the firm as a time column, then the surfaces at full width |
| `/access` | Fully drenched waitlist |

All copy lives in `lib/content.ts`.

## Design system

- **Colour — Committed.** Cool porcelain ground (tinted toward violet, never
  cream), blue-black ink, and one electric vermilion carrying whole surfaces.
  The vermilion is pinned at OKLCH L 0.53: the single lightness that clears
  4.5:1 *both* as porcelain-on-drench and as accent-on-porcelain (5.3:1 each
  way). Brighter read hotter and failed both directions.
- **Type — one family, two axes.** Archivo variable. Display is set wide
  (`wdth` 122) and heavy; navigation and labels narrow (`wdth` 76). The width
  contrast does the work a second typeface usually does. Martian Mono appears
  only on numeric readouts.
- **Motion.** Ease-out quint/expo, no bounce. Every animated surface has a
  reduced-motion path; the aperture renders one static mid-swing frame.

## Originkit / 21st.dev

Two Originkit components were adapted rather than dropped in:

- `components/Instrument.tsx` — from **Axis Cursor**. Rebuilt as a document
  level layer: Framer canvas branches removed, per-frame writes go straight to
  the DOM, and the reticle dilates over interactive targets. Fine pointers
  only.
- `components/Type.tsx` — from **Dynamic Weight**. Bundled Inter dropped for
  the project's Archivo, and *both* `wght` and `wdth` are driven instead of
  weight alone.

21st.dev was searched for the 3D hero; everything on offer was the saturated
cliché (neon HUD, glass blobs, warp starfields), so it was used as a negative
signal and the aperture was written from scratch.

## Run

```bash
npm install
npm run dev   # http://localhost:3342
```

Query params:

- `?open=0.55` — pin the aperture at a fixed progress (tuning + screenshots)
- `?native=1` — disable Lenis smooth scroll

## Waitlist

`POST /api/access` writes to Supabase when `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` are set (see `.env.example`; server-only). Without
them it returns 503 and the form falls back to email rather than faking a
success. Length-capped, honeypot-guarded, and network failures keep the JSON
error contract. Table migration is in `../ledgeros-site/README.md`.
