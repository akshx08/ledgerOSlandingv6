# LedgerOS — the compiled landing page

Six sibling builds of this site were made (v1–v6), each committing to a
different aesthetic. This one is the compile: **v2 "Aperture" as the base**,
for its porcelain/vermilion palette and its Archivo width-axis type system,
with **v4's instanced-sheet field** replacing v2's iris as the hero, and the
scroll treatment taken from a reference build (`08-synapsex.html`).

Next.js 14 · React 18 · TypeScript · Tailwind 3.4 · Three.js · Lenis.
Runs locally on **http://localhost:3350** — not deployed.

## The hero

**The record sorts itself, because you asked it to.**

Several thousand shredded document fragments tumble through a porcelain
volume, and then, in one move, they *are* the wordmark. Two rules hold the
scene together:

1. **Nothing is created and nothing is destroyed.** Every fragment in the
   finished word was in the opening chaos, moved. The product does not create
   records — it puts the ones a business already has into an order, and an
   animation where documents materialise would be describing a different, and
   untrue, product.
2. **The scrollbar is the only clock.** The resolve is scrubbed, never played.
   You drive it, you can stop halfway, and you can run it backwards. An
   earlier cut ran on a timer; a hero that performs itself while the visitor
   sits still is a video.

Deliberately absent: v4's original build resolved into a filed archive wall
first. A wall of near-aligned sheets reads as *untidy* at exactly the moment
it is meant to read as resolved, so there is no intermediate sorted state —
chaos, then the word.

The finish is brutalist: a hard vermilion offset plate slides out from behind
the letterforms in the last 10% of the resolve. Flat, unblurred, one block of
colour — v2's specimen-plate shadow at wordmark scale. The letterforms
themselves sit at a graphite weight so the plate carries the contrast.

The exit is not a fade. The word DETONATES — every fragment that built a
letterform is thrown outward, un-setting back into paper as it flies — and
what the visitor enters through the shattered word is the site itself: the
camera drives forward through the debris into clear porcelain while the page
scales up out of the distance to meet it (`components/Entry.tsx`). No
set-piece stands between the word and the product's first argument. The
porcelain the camera arrives in is the page's own ground, so the hand-off is
invisible by construction.

Scroll budget, measured in screens (`components/Stage.tsx`):

| Screens | What |
|---|---|
| 0 → 1.35 | the fragments resolve into the wordmark |
| 1.35 → 1.6 | the word is held |
| 1.6 → 2.0 | the detonation — debris flies past the viewer |
| 1.75 → 2.55 | the camera drives through the debris; the page pops out to meet it |
| 2.45 → 2.7 | the host releases the frame — invisible, the frame is already porcelain |

Measured in viewport heights rather than document percentages on purpose: a
section added further down cannot silently re-time the opening.

## Routes

| Route | What |
|---|---|
| `/` | The resolve → the statement, laid back in space → vermilion drench + belt → three specimen plates → hand-off |
| `/system` | The five pipeline stages as a horizontal reel driven by vertical scroll; the unbuilt knowledge layer, stated as unbuilt; the roadmap as a ledger |
| `/practice` | A morning at the firm as a time column, then the surfaces at full width |
| `/access` | Fully drenched waitlist |

All copy lives in `lib/content.ts`. **Only the hero act on `/` is the compile;**
everything below it, and the three interior routes, are still v2's originals.

## Design system

- **Colour — committed.** Cool porcelain ground (tinted toward violet, never
  cream), blue-black ink, and one electric vermilion carrying whole surfaces.
  The vermilion is pinned at OKLCH L 0.53: the single lightness that clears
  4.5:1 *both* as porcelain-on-drench and as accent-on-porcelain (5.3:1 each
  way). Brighter read hotter and failed both directions.
- **Type — one family, two axes.** Archivo variable. Display is set wide
  (`wdth` 122) and heavy; navigation and labels narrow (`wdth` 76). The width
  contrast does the work a second typeface usually does. Martian Mono appears
  only on numeric readouts. The 3D wordmark is set heavier still, at `wght`
  800, because several thousand tiles standing in for strokes need the mass.
- **Glass.** Hero copy and the statement sit on 5%-fill plates
  (`components/Glass.tsx`) — a lens, not a surface. Square corners; this
  site's plates are specimen plates.
- **Motion.** Ease-out quint/expo, no bounce. Every animated surface has a
  reduced-motion path; under it the wordmark is simply already assembled.

## Run

```bash
npm install
npm run dev   # http://localhost:3350
```

Query params:

- `?assemble=0.55`, `?shatter=0.5`, `?enter=0.4` — pin any act at a fixed
  progress. The tuning surface, and the only way to capture a mid-act frame
  in a headless pane. A later pin implies the earlier acts are complete.
- `?native=1` — disable Lenis smooth scroll.

## If you touch the scene

Four things cost real time to find. All four are silent — no console error,
no failed build.

- **`THREE.ColorManagement` is disabled deliberately** (`Assembly.tsx`).
  three converts `new THREE.Color(0x3b3947)` from sRGB into its linear working
  space (0.041, not 0.231) and relies on the renderer's output transform to
  convert back — but that transform is appended only to the fragment shaders
  of three's *own* materials. A `ShaderMaterial` that writes `gl_FragColor`
  itself never receives it, so every colour renders at roughly half its
  intended lightness. The palette here is authored as hex to match the
  stylesheet, so the fix is to stay in one space end to end.
- **Canvas cannot see a `next/font` family by its plain name.** next/font
  emits a scoped family (`__Archivo_afd4a3`); `ctx.font = "700 300px Archivo"`
  matches nothing and rasterises in the browser's default sans. The real name
  is read off a live element carrying the display class. Canvas also cannot
  take `font-variation-settings` — but `expanded` in the `font` shorthand does
  reach the `wdth` axis, and `ctx.letterSpacing` works.
- **Anything that is a pure function of scroll is computed in the scroll
  handler, not in rAF.** rAF is *paused* in a backgrounded tab, not throttled,
  so state computed only inside a frame loop is frozen at t=0 on a restored
  scroll position. `Stage.apply()` does the work and `emit()`s; `Hero` and
  `Cinematic` subscribe via `onFrame`. The frame loop keeps only the trailing
  smoothed value.
- **Depth cues must be scaled out by `settle`.** Both the porcelain fog and
  the directional shading are what make a *tumbling* sheet read as paper — and
  both quietly halve the ink across the finished wordmark if they survive into
  it. Settled fragments sit face-on, so N·L lands near 0.5 for all of them.

Two smaller ones: the settled fragment must not keep the torn-strip aspect
(thin slivers at slightly different angles read as hatching, never as type),
and the offset plate's fragment growth must stay well under its offset or it
spreads on every side and becomes a halo.

## Waitlist

`POST /api/access` writes to Supabase when `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` are set (see `.env.example`; server-only, never
`NEXT_PUBLIC`). Without them it returns 503 and the form falls back to email
rather than faking a success. Length-capped per field before the database sees
anything, honeypot-guarded, and network failures keep the JSON error contract.

Create the table once:

```sql
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  firm text not null,
  role text,
  city text,
  volume text,
  created_at timestamptz not null default now()
);
alter table public.waitlist enable row level security;
-- no policies: only the service role (the API route) can read or write
```

## Deploy

Vercel, defaults. Set the two env vars for the live waitlist.
