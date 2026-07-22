"use client";

/**
 * Assembly — the signature.
 *
 * Shredded records tumble through a porcelain volume, and then, in ONE move,
 * they are the wordmark. There is no intermediate sorted state. v4's version
 * of this scene resolved into a filed archive wall first, and a wall of
 * near-aligned sheets reads as untidy at exactly the moment it is meant to
 * read as resolved — so the wall is gone and the word is the only order.
 *
 * The constraint that survives from v4 is the one that matters: nothing fades
 * in and nothing fades out. Every fragment in the finished word was in the
 * opening chaos, moved. The product does not create records; it puts the ones
 * a business already has into an order, and an animation where documents
 * materialise would be describing a different, and untrue, product.
 *
 * THE CLOCK IS THE SCROLLBAR. The resolve is scrubbed, not played: the
 * visitor drives it, can stop halfway, and can run it backwards.
 *
 * GROUND
 * v4 lit this field additively against near-black. On porcelain that image
 * does not exist — a luminous sheet on a near-white ground is a nothing. So
 * the material is inverted: fragments are ink on paper, and the fog is
 * porcelain, so depth reads as fragments dissolving into the page rather than
 * into shadow.
 *
 * THE FINISH
 * The word arrives as SET TYPE, not as a texture in the shape of type. The
 * paper grain, the directional shading and the fog all belong to the chaos
 * and are scaled out as each fragment takes its place, so the letterforms
 * land flat and solid in the same ink the rest of the site sets its display
 * type in. One colour, no accent, no plate: the wordmark is the argument, and
 * anything decorating it is competing with it.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * COLOUR MANAGEMENT OFF, DELIBERATELY.
 *
 * three converts `new THREE.Color(0x0f0e17)` from sRGB into its linear
 * working space and relies on the renderer's output transform to convert
 * back. That transform is appended to the fragment shaders of three's OWN
 * materials; a ShaderMaterial that writes gl_FragColor itself never receives
 * it. The result is every colour emitting at roughly half its intended
 * lightness — which is why the wordmark once read as a black slab no matter
 * how light the ink was set.
 *
 * This scene is flat-shaded and its palette is authored as hex to match the
 * stylesheet, so the honest fix is to stay in one space end to end rather
 * than to hand-roll an encode in the shader and hope the two agree.
 */
THREE.ColorManagement.enabled = false;

/* Sampled from the stylesheet's own tokens rather than eyeballed, so the
 * canvas ground and the CSS ground are the same colour and the seam between
 * them is invisible:
 *   --porcelain oklch(0.966 0.006 286) → #f3f3f8
 *   --ink       oklch(0.17  0.019 286) → #0f0e17   (the display type's black) */
const PORCELAIN = 0xf3f3f8;
const INK = 0x0f0e17;

const VERT = /* glsl */ `
precision highp float;

attribute vec3 aChaosPos;
attribute vec3 aWordPos;
attribute vec3 aChaosRot;
attribute vec3 aWordRot;
attribute vec2 aScale;
attribute float aDelay;
attribute float aTone;
attribute float aRules;

uniform float uProgress;
uniform float uTime;
uniform float uReduced;
uniform float uWordScale;
uniform float uLoosen;
uniform vec2  uWordSize;   // the wordmark plane in world units

varying vec2  vUv;
varying vec2  vWordUv;     // where this pixel falls in the wordmark
varying float vSettle;
varying float vTone;
varying float vFog;
varying float vShade;
varying float vRules;

mat3 rotate(vec3 r){
  vec3 s = sin(r), c = cos(r);
  mat3 rx = mat3(1.0,0.0,0.0, 0.0,c.x,-s.x, 0.0,s.x,c.x);
  mat3 ry = mat3(c.y,0.0,s.y, 0.0,1.0,0.0, -s.y,0.0,c.y);
  mat3 rz = mat3(c.z,-s.z,0.0, s.z,c.z,0.0, 0.0,0.0,1.0);
  return rz * ry * rx;
}

void main(){
  vUv = uv;
  vTone = aTone;
  vRules = aRules;

  // Each fragment has its own window inside the global progress, so the word
  // is written rather than switched on. A uniform arrival reads as one object
  // animating; a staggered one reads as many things being placed.
  float local = clamp((uProgress - aDelay * 0.40) / 0.60, 0.0, 1.0);
  float s = 1.0 - pow(1.0 - local, 3.0);
  vSettle = s;

  // drift while unstructured — the chaos is alive, not a frozen scatter
  vec3 drift = vec3(
    sin(uTime * 0.21 + aDelay * 31.0),
    cos(uTime * 0.17 + aDelay * 17.0),
    sin(uTime * 0.13 + aDelay * 44.0)
  ) * (1.0 - s) * 0.62 * (1.0 - uReduced);

  // once settled, a whisper of breathing so the word is held, not printed
  vec3 breath = vec3(
    sin(uTime * 0.55 + aDelay * 60.0),
    cos(uTime * 0.47 + aDelay * 40.0),
    0.0
  ) * s * (0.03 + uLoosen * 0.35) * (1.0 - uReduced);

  vec3 pos = mix(aChaosPos, aWordPos, s) + drift + breath;

  vec3 spin = aChaosRot + vec3(uTime * 0.09) * (1.0 - uReduced);
  vec3 rot = mix(spin, aWordRot, s);

  // THE PLACED PIECE DOES NOT KEEP THE TORN SHAPE.
  //
  // Chaos wants long ripped strips — that is what shredded paper is. But
  // scaling those same strips down and laying them into letterforms gives
  // thousands of thin slivers at slightly different angles, and that reads as
  // hatching, or handwriting, or scribble. It does not read as type. The word
  // is meant to arrive as a bold setting, so the placed piece resolves to a
  // small, near-uniform tile whose union has a clean edge and a solid middle.
  vec2 wordSc = vec2(uWordScale, uWordScale * 0.78) * (0.88 + aTone * 0.24);
  vec2 sc = mix(aScale, wordSc, s);

  mat3 R = rotate(rot);
  vec3 local3 = vec3(position.xy * sc, 0.0);
  vec3 world = R * local3 + pos;

  // PAPER CATCHES LIGHT. A sheet with no shading is a coloured rectangle; a
  // sheet whose face brightens as it turns through a key light is paper. One
  // fixed directional term is enough, and it costs a dot product.
  vec3 N = normalize(R * vec3(0.0, 0.0, 1.0));
  vec3 L = normalize(vec3(-0.35, 0.78, 0.52));
  float ndl = dot(N, L);
  float facing = step(0.0, ndl);
  // the back of a sheet is not black, it is the same paper in less light
  vShade = mix(0.58, 1.0, abs(ndl)) * mix(0.82, 1.0, facing);

  // Where this pixel falls inside the wordmark, in the SAME space the sample
  // points were drawn from. Taken from the interpolated world position rather
  // than from the instance's target, so it varies across the face of each
  // tile — which is what lets the fragment shader cut the tile along the
  // glyph edge instead of merely keeping or dropping it whole.
  vWordUv = vec2(world.x / uWordSize.x + 0.5, 0.5 - world.y / uWordSize.y);

  vec4 mv = modelViewMatrix * vec4(world, 1.0);
  vFog = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
precision highp float;

uniform vec3      uPorcelain;
uniform vec3      uInk;
uniform float     uFogDensity;
uniform sampler2D uWordTex;   // the wordmark's own coverage, as a stencil

varying vec2  vUv;
varying vec2  vWordUv;
varying float vSettle;
varying float vTone;
varying float vFog;
varying float vShade;
varying float vRules;

void main(){
  vec2 p = abs(vUv - 0.5) * 2.0;

  // the sheet is CUT, not faded: paper has an edge, and an opaque sheet lets
  // the stack occlude itself the way paper actually does
  float border = smoothstep(0.98, 0.9, max(p.x, p.y));
  if (border < 0.5) discard;

  // THE PAPER IS TRIMMED TO THE LETTERFORM.
  //
  // A tile is sampled from a point inside a glyph, but the tile itself is a
  // rectangle and overhangs the glyph's edge. Thousands of overhangs are what
  // furred the wordmark, and no tile count fixes it — the union of rectangles
  // simply is not a letterform.
  //
  // So as a fragment lands it gets CUT against the wordmark's own coverage.
  // The union then has the exact edge of the type, while every pixel inside
  // it is still a piece of document. The word is made of the paper rather
  // than printed over it.
  //
  // Per-fragment, driven by that fragment's own settle: a scrap in flight is
  // whole, and is trimmed only as it takes its place.
  float cover = texture2D(uWordTex, vWordUv).a;
  float trim  = smoothstep(0.45, 0.98, vSettle);
  // soft across roughly one texel of the 3600px stencil, so the cut edge is
  // resolved by coverage rather than by a hard alpha test
  float inside = smoothstep(0.42, 0.58, cover);
  float keep = mix(1.0, inside, trim);
  if (keep < 0.02) discard;

  // Fragments carry ruled lines, not a texture: a document reads as a
  // document because of the horizontal rhythm of type on it. The count varies
  // per sheet, so a shredded pile does not repeat one printed page.
  float rule = smoothstep(0.07, 0.0, abs(fract(vUv.y * vRules) - 0.5) - 0.33);
  float head = smoothstep(0.055, 0.0, abs(vUv.y - 0.82) - 0.02);
  float body = 0.86 + rule * 0.14 + head * 0.14;

  // EVERY TEXTURE CUE BELONGS TO THE CHAOS.
  //
  // Grain, tone variance, directional shading and fog are what make a
  // tumbling scrap read as paper. All four also multiply, and carried into
  // the settled state they drag the wordmark off full ink and leave it a
  // washed grey with a furred surface. They are scaled out by settle, so the
  // fragment is paper on the way in and set type once it lands.
  float fog = 1.0 - exp(-uFogDensity * uFogDensity * vFog * vFog);
  float paper = body * (0.82 + vTone * 0.18) * vShade * (1.0 - clamp(fog, 0.0, 1.0));
  float surface = mix(paper, 1.0, vSettle * 0.88);

  float density = (0.30 + vSettle * 0.70) * surface;

  // alphaToCoverage turns this into MSAA coverage, so the trimmed edge is
  // antialiased while the material stays opaque and keeps occluding properly
  gl_FragColor = vec4(mix(uPorcelain, uInk, clamp(density, 0.0, 1.0)), keep);
}
`;

type Props = {
  /** 0 → 1 assembly, scrubbed by scroll. */
  assembleRef: React.RefObject<number>;
  /** 0 → 1 continued scroll after the word has landed. */
  scrollRef: React.RefObject<number>;
  className?: string;
};

const COUNT = 7200;
const WORD = "LedgerOS";
/** the wordmark's width in world units — the camera is fitted to this */
const WORD_W = 24;
const FOV = 42;
const HALF_FOV = (FOV / 2) * (Math.PI / 180);
/** fraction of the frame's width the word should occupy at rest */
const FIT_LANDSCAPE = 0.68;
const FIT_PORTRAIT = 0.86;
/** How far below the frame's centre the word settles, as a fraction of the
 *  visible height. Portrait gets far less: the offset scales with the visible
 *  height, and on a tall frame the same fraction drops the word onto the rule
 *  above the body copy. */
const DROP_LANDSCAPE = 0.09;
const DROP_PORTRAIT = 0.025;

/** deterministic, so SSR/CSR and every reload agree */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Rasterise the wordmark and sample points inside its glyphs.
 *
 * Set to match `.wide` exactly — the class the site's display type uses, and
 * the one on the closing "Seats are few." — so the wordmark is the same
 * setting the page ends on rather than a near-miss of it:
 *   wght 700 · wdth 122 · letter-spacing -0.035em
 *
 * THE FAMILY NAME MATTERS. next/font emits a scoped family
 * (`__Archivo_afd4a3`), so `ctx.font = "700 300px Archivo"` silently matches
 * nothing and rasterises in the browser's default sans — which is how an
 * earlier build ended up with a wordmark in the wrong typeface entirely. The
 * real name is read off the live headline. Canvas cannot take
 * font-variation-settings, but `expanded` in the shorthand is what reaches
 * Archivo's width axis.
 */
/**
 * Draw the wordmark into an offscreen canvas of the given size, always with
 * the same relative layout: fitted to 94% of the width and centred. Both the
 * point sampler and the set-type texture go through here, so they describe
 * the same geometry at different resolutions and land on top of each other
 * exactly — alignment is a property of the construction rather than
 * something to nudge into place afterwards.
 *
 * `fill: null` leaves the background transparent, which is what the texture
 * wants; the sampler only reads alpha, so it does not care.
 */
function renderWordCanvas(
  text: string,
  family: string,
  W: number,
  H: number,
  fill: string | null
) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  type Tracking = CanvasRenderingContext2D & { letterSpacing?: string };
  try {
    (ctx as Tracking).letterSpacing = "-0.035em";
  } catch {
    /* pre-2023 engines simply set the word slightly loose */
  }

  // NOTE: `expanded` is the only way to reach the width axis from canvas —
  // it maps to wdth 125 against the stylesheet's 122. Percentages are NOT
  // accepted here: the assignment fails silently and the context keeps
  // whatever font it had, which looks exactly like it worked.
  const spec = (px: number) => `700 expanded ${px}px "${family}"`;

  let size = Math.round(W / 6);
  ctx.font = spec(size);
  const measured = ctx.measureText(text).width || 1;
  size = Math.max(40, Math.floor(size * ((W * 0.94) / measured)));
  ctx.font = spec(size);

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = fill ?? "#000";
  ctx.fillText(text, W / 2, H / 2);
  return { canvas, ctx };
}

/** the raster the point sampler reads; also fixes the plane's aspect */
const RASTER_W = 1800;
const RASTER_H = 460;

function sampleWord(
  text: string,
  count: number,
  rand: () => number,
  family: string
) {
  const W = RASTER_W;
  const H = RASTER_H;
  const made = renderWordCanvas(text, family, W, H, "#000");
  if (!made) return null;
  const { ctx } = made;

  const data = ctx.getImageData(0, 0, W, H).data;
  const hits: number[] = [];
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      if (data[(y * W + x) * 4 + 3] > 130) hits.push(x, y);
    }
  }
  const n = hits.length / 2;
  if (n < 64) return null;

  // World framing. The word is built WORD_W units wide and centred on the
  // origin; where it sits in frame is the camera's job, not the geometry's,
  // so the composition holds at any aspect instead of only at the one it was
  // authored on.
  const unit = WORD_W / W;
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const h = Math.floor(rand() * n) * 2;
    // jitter inside the sampled pixel so the fill is not a visible lattice
    const x = hits[h] + rand() - 0.5;
    const y = hits[h + 1] + rand() - 0.5;
    out[i * 3 + 0] = (x - W / 2) * unit;
    out[i * 3 + 1] = -(y - H / 2) * unit;
    // a thin slab, so the word has a body and the ranks parallax slightly
    out[i * 3 + 2] = (rand() - 0.5) * 1.1;
  }
  return out;
}

export default function Assembly({
  assembleRef,
  scrollRef,
  className = "",
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let teardown: (() => void) | null = null;

    const boot = async () => {
      // Resolve the real, scoped family off a live element that carries the
      // display class, then wait for it — bounded, so a slow font cannot hold
      // the opening hostage.
      const probe = document.createElement("span");
      probe.className = "wide";
      probe.style.cssText =
        "position:absolute;left:-9999px;top:0;font-size:40px";
      probe.textContent = WORD;
      document.body.appendChild(probe);
      const family =
        getComputedStyle(probe)
          .fontFamily.split(",")[0]
          .trim()
          .replace(/["']/g, "") || "sans-serif";
      probe.remove();

      try {
        await Promise.race([
          (async () => {
            await document.fonts.load(`700 300px "${family}"`);
            await document.fonts.ready;
          })(),
          new Promise((r) => setTimeout(r, 1500)),
        ]);
      } catch {
        /* fall through to whatever is available */
      }
      if (disposed) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      // `?assemble=` must show the state it names, exactly. Easing toward it
      // makes the tuning surface lie — most visibly in a pane where rAF is
      // paused and the eased value never arrives at all.
      const pinned = new URLSearchParams(window.location.search).has("assemble");
      const small = window.innerWidth < 900;
      const count = reduced ? 2400 : small ? 4200 : COUNT;

      const rand = rng(20260721);
      const wordPos = sampleWord(WORD, count, rand, family);
      if (!wordPos || disposed) return;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      // matches the ColorManagement decision above: no output transform, so
      // what the shader writes is what the display gets
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
      renderer.setClearColor(PORCELAIN, 1);
      host.appendChild(renderer.domElement);
      renderer.domElement.style.cssText =
        "width:100%;height:100%;display:block";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 320);

      /* ---------- the fragments ---------- */
      const geo = new THREE.InstancedBufferGeometry();
      const plane = new THREE.PlaneGeometry(1, 1);
      geo.index = plane.index;
      geo.attributes.position = plane.attributes.position;
      geo.attributes.uv = plane.attributes.uv;

      const chaosPos = new Float32Array(count * 3);
      const chaosRot = new Float32Array(count * 3);
      const wordRot = new Float32Array(count * 3);
      const scale = new Float32Array(count * 2);
      const delay = new Float32Array(count);
      const tone = new Float32Array(count);
      const rules = new Float32Array(count);

      for (let i = 0; i < count; i += 1) {
        // chaos: a wide, deep, unstructured volume that the camera starts
        // inside, so the opening is "in the middle of it" rather than
        // "looking at it"
        const a = rand() * Math.PI * 2;
        const r = 12 + Math.pow(rand(), 0.55) * 30;
        chaosPos[i * 3 + 0] = Math.cos(a) * r * 1.2;
        chaosPos[i * 3 + 1] = (rand() - 0.5) * 44;
        chaosPos[i * 3 + 2] = Math.sin(a) * r - 10;

        chaosRot[i * 3 + 0] = rand() * Math.PI * 2;
        chaosRot[i * 3 + 1] = rand() * Math.PI * 2;
        chaosRot[i * 3 + 2] = rand() * Math.PI * 2;

        // Placed: square to the reader. The residual jitter is a fifth of
        // what it once was — at ±4° every tile fought its neighbours and the
        // letterform edges came out furred, which is most of what made the
        // wordmark read as a texture rather than as set type.
        wordRot[i * 3 + 0] = (rand() - 0.5) * 0.012;
        wordRot[i * 3 + 1] = (rand() - 0.5) * 0.012;
        wordRot[i * 3 + 2] = (rand() - 0.5) * 0.014;

        // A shredded pile is not one repeated sheet. Most fragments are torn
        // strips — long and thin — with a minority of squarer pieces.
        const strip = rand();
        const w = 0.8 + rand() * 0.4;
        scale[i * 2 + 0] = w;
        scale[i * 2 + 1] =
          strip < 0.62
            ? w * (0.16 + rand() * 0.14) // torn strip
            : w * (0.42 + rand() * 0.3); // a squarer piece

        delay[i] = rand();
        tone[i] = 0.55 + rand() * 0.45;
        rules[i] = 3.0 + Math.floor(rand() * 5);
      }

      const inst = (arr: Float32Array, n: number) =>
        new THREE.InstancedBufferAttribute(arr, n);
      geo.setAttribute("aChaosPos", inst(chaosPos, 3));
      geo.setAttribute("aWordPos", inst(wordPos, 3));
      geo.setAttribute("aChaosRot", inst(chaosRot, 3));
      geo.setAttribute("aWordRot", inst(wordRot, 3));
      geo.setAttribute("aScale", inst(scale, 2));
      geo.setAttribute("aDelay", inst(delay, 1));
      geo.setAttribute("aTone", inst(tone, 1));
      geo.setAttribute("aRules", inst(rules, 1));
      geo.instanceCount = count;
      // instances are placed entirely in the vertex shader, so three's own
      // culling would discard the whole field on the origin
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 90);

      /* The stencil: the same wordmark the points were sampled from, at 2x,
       * used purely as coverage. Because it comes out of renderWordCanvas
       * with the same fit rule as the sampler, its UV space and the sample
       * space are the same space — the trim lines up by construction. */
      const stencil = renderWordCanvas(
        WORD,
        family,
        RASTER_W * 2,
        RASTER_H * 2,
        "#000"
      );
      const wordTex = stencil
        ? new THREE.CanvasTexture(stencil.canvas)
        : null;
      if (wordTex) {
        wordTex.colorSpace = THREE.NoColorSpace;
        // The vertex shader derives v from world Y directly (v=0 at the top
        // of the word), so the texture must NOT also flip. Leaving three's
        // default flipY on samples the glyphs upside down, which renders as
        // convincing-looking but mirrored letterforms.
        wordTex.flipY = false;
        wordTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        wordTex.minFilter = THREE.LinearMipmapLinearFilter;
        wordTex.magFilter = THREE.LinearFilter;
        // the stencil is sampled far outside 0..1 by tiles that have not
        // landed yet; clamping keeps those reading as "outside the glyph"
        wordTex.wrapS = THREE.ClampToEdgeWrapping;
        wordTex.wrapT = THREE.ClampToEdgeWrapping;
        wordTex.needsUpdate = true;
      }

      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uReduced: { value: reduced ? 1 : 0 },
          uWordScale: { value: 0.34 },
          uLoosen: { value: 0 },
          uPorcelain: { value: new THREE.Color(PORCELAIN) },
          uInk: { value: new THREE.Color(INK) },
          uFogDensity: { value: 0.019 },
          uWordTex: { value: wordTex },
          uWordSize: {
            value: new THREE.Vector2(
              WORD_W,
              (RASTER_H / RASTER_W) * WORD_W
            ),
          },
        },
        transparent: false,
        depthWrite: true,
        depthTest: true,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
        // resolves the trimmed edge through MSAA samples instead of a hard
        // alpha test, without giving up depth-sorted opacity
        alphaToCoverage: true,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      scene.add(mesh);


      /* ---------- resize ---------- */
      let portrait = false;
      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        portrait = w / h < 1;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      /* ---------- pointer ---------- */
      const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMove = (e: PointerEvent) => {
        ptr.tx = (e.clientX / window.innerWidth) * 2 - 1;
        ptr.ty = (e.clientY / window.innerHeight) * 2 - 1;
      };
      if (!reduced)
        window.addEventListener("pointermove", onMove, { passive: true });

      const onLost = (e: Event) => e.preventDefault();
      renderer.domElement.addEventListener("webglcontextlost", onLost);

      /* ---------- frame ---------- */
      let raf = 0;
      let last = performance.now();
      let eased = 0;
      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
        rootMargin: "120px",
      });
      io.observe(host);

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        if (!visible) return;
        const rawDt = (now - last) / 1000;
        last = now;
        const dt = Math.min(rawDt, 1 / 30);
        const t = now / 1000;

        const target = THREE.MathUtils.clamp(assembleRef.current ?? 0, 0, 1);
        // A stalled tab must snap, never crawl the whole assembly. Reduced
        // motion snaps too: the sort itself is content and stays scroll-
        // linked, but the smoothing that trails the scroll is decoration.
        if (pinned || rawDt > 0.25 || reduced) eased = target;
        else eased += (target - eased) * Math.min(1, dt * 4.0);
        const p = eased;
        const sp = THREE.MathUtils.clamp(scrollRef.current ?? 0, 0, 1);

        mat.uniforms.uProgress.value = p;
        mat.uniforms.uTime.value = t;
        mat.uniforms.uLoosen.value = sp;

        ptr.x += (ptr.tx - ptr.x) * 0.05;
        ptr.y += (ptr.ty - ptr.y) * 0.05;

        // THE CAMERA IS THE NARRATOR. It begins inside the debris and comes
        // to rest square-on to the word. One move, never cut.
        //
        // The resting distance is SOLVED from the aspect rather than typed
        // in. A fixed dolly frames the word correctly on the one viewport it
        // was authored against and lets it run off both edges on a phone.
        const e = 1 - Math.pow(1 - p, 2.1);
        const fit = portrait ? FIT_PORTRAIT : FIT_LANDSCAPE;
        const restD =
          WORD_W / (fit * 2 * Math.tan(HALF_FOV) * Math.max(camera.aspect, 0.3));
        const startD = restD * 1.5;
        const dolly = startD + (restD - startD) * e;

        camera.position.set(
          ptr.x * (2.6 - e * 2.0),
          (1 - e) * 5.0 - ptr.y * (2.2 - e * 1.6),
          dolly
        );

        // Looking ABOVE the word drops it into the lower part of the frame,
        // clear of the display headline. Expressed against the visible height
        // so the gap is the same shape on every screen.
        const visH = 2 * dolly * Math.tan(HALF_FOV);
        const drop = portrait ? DROP_PORTRAIT : DROP_LANDSCAPE;
        camera.lookAt(0, (1 - e) * 1.4 + e * visH * drop, 0);

        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(frame);

      teardown = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        renderer.domElement.removeEventListener("webglcontextlost", onLost);
        plane.dispose();
        geo.dispose();
        mat.dispose();
        wordTex?.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    void boot();

    return () => {
      disposed = true;
      // React StrictMode double-invokes effects; disposing GPU state the
      // remounted component still holds is a black canvas with no error.
      // Deferring one cancellable tick lets the remount win.
      setTimeout(() => teardown?.(), 0);
    };
  }, [assembleRef, scrollRef]);

  return (
    // absolute, not fixed: this lives inside the Stage's fixed host, and a
    // second fixed layer inside a transformed parent is positioned against
    // the parent anyway.
    <div
      ref={hostRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    />
  );
}
