"use client";

/**
 * Assembly — the signature, in three acts.
 *
 * ACT I — THE RESOLVE. Shredded records tumble through a porcelain volume,
 * and then, in ONE move, they are the wordmark. Each fragment is trimmed to
 * the glyph outline as it lands, so the union of the paper IS the typography:
 * the exact edge of the type, every pixel of it still a piece of document.
 *
 * ACT II — THE SHATTER. On the next scroll the word does not fade. It
 * detonates: every fragment that built a letterform is thrown outward and
 * un-sets back into paper as it flies — the trim releases, the grain and
 * shading return — because what breaks apart is the record, not a picture
 * of it. Nothing is created and nothing is destroyed, in both directions.
 *
 * ACT III — THE ENTRY. The camera drives forward through the debris field
 * into clear porcelain, and the PAGE ITSELF comes up to meet the viewer —
 * the sections below scale out of the distance toward full size (see
 * Entry.tsx). There is no set-piece between the word and the site: what you
 * enter through the shattered word is the product's own first argument.
 * The porcelain the camera arrives in is the page's own ground, so the
 * hand-off is invisible by construction.
 *
 * THE CLOCK IS THE SCROLLBAR throughout. Every act is scrubbed, never
 * played; the visitor can stop mid-detonation or back straight out again.
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
 * lightness. The palette here is authored as hex to match the stylesheet, so
 * the honest fix is to stay in one space end to end.
 */
THREE.ColorManagement.enabled = false;

/* Sampled from the stylesheet's own tokens rather than eyeballed:
 *   --porcelain oklch(0.966 0.006 286) → #f3f3f8
 *   --ink       oklch(0.17  0.019 286) → #0f0e17
 *   --vermilion oklch(0.53  0.205 30)  → #c71a0c  */
const PORCELAIN = 0xf3f3f8;
const INK = 0x0f0e17;

/* ------------------------------ fragments ------------------------------ */

const VERT = /* glsl */ `
precision highp float;

attribute vec3 aChaosPos;
attribute vec3 aWordPos;
attribute vec3 aChaosRot;
attribute vec3 aWordRot;
attribute vec3 aBurst;
attribute vec2 aScale;
attribute float aDelay;
attribute float aTone;
attribute float aRules;

uniform float uProgress;
uniform float uShatter;
uniform float uTime;
uniform float uReduced;
uniform float uWordScale;
uniform float uLoosen;
uniform vec2  uWordSize;

varying vec2  vUv;
varying vec2  vWordUv;
varying float vSettle;
varying float vShatter;
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
  // is written rather than switched on.
  float local = clamp((uProgress - aDelay * 0.40) / 0.60, 0.0, 1.0);
  float s = 1.0 - pow(1.0 - local, 3.0);
  vSettle = s;

  // The detonation is nearly simultaneous — a stagger wide enough to read as
  // a sequence would read as a dissolve, and the beat is a BREAK.
  float sh = clamp((uShatter - aDelay * 0.12) / 0.88, 0.0, 1.0);
  // ease-out: the violence is all in the first instant
  float shD = 1.0 - pow(1.0 - sh, 2.2);
  vShatter = sh;

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
  ) * s * (0.03 + uLoosen * 0.35) * (1.0 - uReduced) * (1.0 - sh);

  vec3 pos = mix(aChaosPos, aWordPos, s) + drift + breath;

  // THE BURST. Directions are baked per fragment — outward from the word's
  // centre with a strong bias toward the camera, so the debris does not just
  // scatter, it comes PAST the viewer. Distance keys off tone so the field
  // gets depth instead of a uniform shell.
  pos += aBurst * shD * (16.0 + aTone * 30.0);

  vec3 spin = aChaosRot + vec3(uTime * 0.09) * (1.0 - uReduced);
  vec3 rot = mix(spin, aWordRot, s);
  // it tumbles again as it flies — settled stillness has no business
  // surviving a detonation
  rot += aChaosRot * sh * 2.4 + vec3(uTime * 0.6, uTime * 0.5, uTime * 0.7) * sh * (1.0 - uReduced);

  // Placed pieces are near-uniform tiles so the letterforms hold an edge;
  // flying debris regains its torn-strip shape, because it is paper again.
  vec2 wordSc = vec2(uWordScale, uWordScale * 0.78) * (0.88 + aTone * 0.24);
  vec2 sc = mix(mix(aScale, wordSc, s), aScale, sh * 0.85);

  mat3 R = rotate(rot);
  vec3 local3 = vec3(position.xy * sc, 0.0);
  vec3 world = R * local3 + pos;

  // PAPER CATCHES LIGHT — one fixed directional term, one dot product.
  vec3 N = normalize(R * vec3(0.0, 0.0, 1.0));
  vec3 L = normalize(vec3(-0.35, 0.78, 0.52));
  float ndl = dot(N, L);
  float facing = step(0.0, ndl);
  vShade = mix(0.58, 1.0, abs(ndl)) * mix(0.82, 1.0, facing);

  // Where this pixel falls inside the wordmark, in the SAME space the sample
  // points were drawn from — this is what lets the fragment shader cut the
  // tile along the glyph edge instead of keeping or dropping it whole.
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
uniform sampler2D uWordTex;

varying vec2  vUv;
varying vec2  vWordUv;
varying float vSettle;
varying float vShatter;
varying float vTone;
varying float vFog;
varying float vShade;
varying float vRules;

void main(){
  vec2 p = abs(vUv - 0.5) * 2.0;

  // the sheet is CUT, not faded: paper has an edge
  float border = smoothstep(0.98, 0.9, max(p.x, p.y));
  if (border < 0.5) discard;

  // THE PAPER IS TRIMMED TO THE LETTERFORM as it lands — and RELEASED as it
  // shatters. The trim is what gives the word the exact edge of the type;
  // its release is what turns the letterforms back into whole scraps the
  // instant they break away. The same mechanism, run in both directions.
  float cover = texture2D(uWordTex, vWordUv).a;
  float trim  = smoothstep(0.45, 0.98, vSettle) * (1.0 - vShatter);
  float inside = smoothstep(0.42, 0.58, cover);
  float keep = mix(1.0, inside, trim);
  if (keep < 0.02) discard;

  // ruled lines — a document reads as a document because of the horizontal
  // rhythm of type on it
  float rule = smoothstep(0.07, 0.0, abs(fract(vUv.y * vRules) - 0.5) - 0.33);
  float head = smoothstep(0.055, 0.0, abs(vUv.y - 0.82) - 0.02);
  float body = 0.86 + rule * 0.14 + head * 0.14;

  // Texture cues belong to loose paper: scaled out as a fragment sets into
  // the word, and brought BACK as it shatters out of it.
  float settleEff = vSettle * (1.0 - vShatter * 0.85);
  float fog = 1.0 - exp(-uFogDensity * uFogDensity * vFog * vFog);
  float paper = body * (0.82 + vTone * 0.18) * vShade * (1.0 - clamp(fog, 0.0, 1.0));
  float surface = mix(paper, 1.0, settleEff * 0.88);

  float density = (0.30 + settleEff * 0.70) * surface;

  gl_FragColor = vec4(mix(uPorcelain, uInk, clamp(density, 0.0, 1.0)), keep);
}
`;

type Props = {
  /** 0 → 1 assembly, scrubbed by scroll. */
  assembleRef: React.RefObject<number>;
  /** 0 → 1 detonation of the settled word. */
  shatterRef: React.RefObject<number>;
  /** 0 → 1 drive through the debris into the page. */
  enterRef: React.RefObject<number>;
  /** 0 → 1 continued scroll, for the breathing. */
  scrollRef: React.RefObject<number>;
  className?: string;
};

const COUNT = 7200;
const WORD = "LedgerOS";
/** the wordmark's width in world units — the camera is fitted to this */
const WORD_W = 24;
const FOV = 42;
const HALF_FOV = (FOV / 2) * (Math.PI / 180);
const FIT_LANDSCAPE = 0.68;
const FIT_PORTRAIT = 0.86;
/** word drop below frame centre, as a fraction of visible height */
const DROP_LANDSCAPE = 0.09;
const DROP_PORTRAIT = 0.025;

/** where the camera ends its drive — past the origin plane the debris burst
 *  from, into clear porcelain. Empty on purpose: the destination is not a
 *  set-piece, it is the page, and the page arrives in the DOM (Entry.tsx). */
const THROUGH_Z = -42;

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** deterministic, so SSR/CSR and every reload agree */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Draw the wordmark with one fit rule at any resolution. Both the point
 * sampler and the trim stencil go through here, so they describe the same
 * geometry and the trim lines up by construction.
 *
 * `expanded` is the only way to reach Archivo's width axis from canvas —
 * percentages are silently rejected (the assignment fails and the context
 * keeps its previous font, which looks exactly like it worked).
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

  const unit = WORD_W / W;
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const h = Math.floor(rand() * n) * 2;
    const x = hits[h] + rand() - 0.5;
    const y = hits[h + 1] + rand() - 0.5;
    out[i * 3 + 0] = (x - W / 2) * unit;
    out[i * 3 + 1] = -(y - H / 2) * unit;
    out[i * 3 + 2] = (rand() - 0.5) * 1.1;
  }
  return out;
}

export default function Assembly({
  assembleRef,
  shatterRef,
  enterRef,
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
      // Resolve the real, scoped family off a live element carrying the
      // display class — next/font's plain name matches nothing in canvas.
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
      // `?assemble=` / `?shatter=` / `?enter=` must show the state they name,
      // exactly — easing toward a pin makes the tuning surface lie.
      const q = new URLSearchParams(window.location.search);
      const pinned =
        q.has("assemble") || q.has("shatter") || q.has("enter");
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
      const burst = new Float32Array(count * 3);
      const scale = new Float32Array(count * 2);
      const delay = new Float32Array(count);
      const tone = new Float32Array(count);
      const rules = new Float32Array(count);

      for (let i = 0; i < count; i += 1) {
        const a = rand() * Math.PI * 2;
        const r = 12 + Math.pow(rand(), 0.55) * 30;
        chaosPos[i * 3 + 0] = Math.cos(a) * r * 1.2;
        chaosPos[i * 3 + 1] = (rand() - 0.5) * 44;
        chaosPos[i * 3 + 2] = Math.sin(a) * r - 10;

        chaosRot[i * 3 + 0] = rand() * Math.PI * 2;
        chaosRot[i * 3 + 1] = rand() * Math.PI * 2;
        chaosRot[i * 3 + 2] = rand() * Math.PI * 2;

        wordRot[i * 3 + 0] = (rand() - 0.5) * 0.012;
        wordRot[i * 3 + 1] = (rand() - 0.5) * 0.012;
        wordRot[i * 3 + 2] = (rand() - 0.5) * 0.014;

        // THE BURST DIRECTION: radial from the word's centre, with a strong
        // bias toward the camera so the debris comes past the viewer rather
        // than merely scattering in plane. Baked, like everything else.
        const ba = rand() * Math.PI * 2;
        let bx = Math.cos(ba) * (0.5 + rand() * 0.5);
        let by = Math.sin(ba) * (0.5 + rand() * 0.5);
        bx += wordPos[i * 3 + 0] / 16;
        by += wordPos[i * 3 + 1] / 7;
        const bz = rand() * 1.5 - 0.25;
        const bl = Math.hypot(bx, by, bz) || 1;
        burst[i * 3 + 0] = bx / bl;
        burst[i * 3 + 1] = by / bl;
        burst[i * 3 + 2] = bz / bl;

        const strip = rand();
        const w = 0.8 + rand() * 0.4;
        scale[i * 2 + 0] = w;
        scale[i * 2 + 1] =
          strip < 0.62
            ? w * (0.16 + rand() * 0.14)
            : w * (0.42 + rand() * 0.3);

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
      geo.setAttribute("aBurst", inst(burst, 3));
      geo.setAttribute("aScale", inst(scale, 2));
      geo.setAttribute("aDelay", inst(delay, 1));
      geo.setAttribute("aTone", inst(tone, 1));
      geo.setAttribute("aRules", inst(rules, 1));
      geo.instanceCount = count;
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 120);

      /* the trim stencil — same fit rule as the sampler, at 2x */
      const stencil = renderWordCanvas(
        WORD,
        family,
        RASTER_W * 2,
        RASTER_H * 2,
        "#000"
      );
      const wordTex = stencil ? new THREE.CanvasTexture(stencil.canvas) : null;
      if (wordTex) {
        wordTex.colorSpace = THREE.NoColorSpace;
        // v is derived from world Y in the vertex shader (v=0 at the top),
        // so the texture must NOT also flip — flipY renders mirrored glyphs.
        wordTex.flipY = false;
        wordTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        wordTex.minFilter = THREE.LinearMipmapLinearFilter;
        wordTex.magFilter = THREE.LinearFilter;
        wordTex.wrapS = THREE.ClampToEdgeWrapping;
        wordTex.wrapT = THREE.ClampToEdgeWrapping;
        wordTex.needsUpdate = true;
      }

      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uProgress: { value: 0 },
          uShatter: { value: 0 },
          uTime: { value: 0 },
          uReduced: { value: reduced ? 1 : 0 },
          uWordScale: { value: 0.34 },
          uLoosen: { value: 0 },
          uPorcelain: { value: new THREE.Color(PORCELAIN) },
          uInk: { value: new THREE.Color(INK) },
          uFogDensity: { value: 0.019 },
          uWordTex: { value: wordTex },
          uWordSize: {
            value: new THREE.Vector2(WORD_W, (RASTER_H / RASTER_W) * WORD_W),
          },
        },
        transparent: false,
        depthWrite: true,
        depthTest: true,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
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
        if (pinned || rawDt > 0.25 || reduced) eased = target;
        else eased += (target - eased) * Math.min(1, dt * 4.0);
        const p = eased;
        const sh = THREE.MathUtils.clamp(shatterRef.current ?? 0, 0, 1);
        const en = THREE.MathUtils.clamp(enterRef.current ?? 0, 0, 1);
        const sp = THREE.MathUtils.clamp(scrollRef.current ?? 0, 0, 1);

        mat.uniforms.uProgress.value = p;
        mat.uniforms.uShatter.value = sh;
        mat.uniforms.uTime.value = t;
        mat.uniforms.uLoosen.value = sp;

        ptr.x += (ptr.tx - ptr.x) * 0.05;
        ptr.y += (ptr.ty - ptr.y) * 0.05;

        // THE CAMERA IS THE NARRATOR. It rests square-on to the word, takes
        // one hard knock as the word detonates, and then DRIVES — forward
        // through the debris field into clear porcelain, while the page
        // scales up to meet it in the DOM. One continuous move, never cut.
        const e = 1 - Math.pow(1 - p, 2.1);
        const fit = portrait ? FIT_PORTRAIT : FIT_LANDSCAPE;
        const restD =
          WORD_W / (fit * 2 * Math.tan(HALF_FOV) * Math.max(camera.aspect, 0.3));
        const startD = restD * 1.5;
        const baseD = startD + (restD - startD) * e;

        const enterE = easeInOut(en);
        // the shatter itself shoves the camera forward a little — impact
        const camZ =
          (baseD - sh * restD * 0.14) * (1 - enterE) + THROUGH_Z * enterE;

        // the knock: a decaying shake that peaks just after detonation.
        // Decoration, so reduced motion drops it entirely.
        const knock = reduced ? 0 : Math.sin(sh * Math.PI) * (1 - en) * 0.5;
        const shakeX = Math.sin(t * 47.0) * knock * 0.4;
        const shakeY = Math.cos(t * 61.0) * knock * 0.3;

        camera.position.set(
          ptr.x * (2.6 - e * 2.0) * (1 - enterE) + shakeX,
          (1 - e) * 5.0 - ptr.y * (2.2 - e * 1.6) * (1 - enterE) + shakeY,
          camZ
        );

        const visH = 2 * Math.max(camZ, 6) * Math.tan(HALF_FOV);
        const drop = portrait ? DROP_PORTRAIT : DROP_LANDSCAPE;
        const restLookY = (1 - e) * 1.4 + e * visH * drop;
        // through the entry the camera stops looking AT the word's position
        // and looks AHEAD, or the view would flip as it passes it
        camera.lookAt(
          camera.position.x * 0.2 * enterE,
          restLookY * (1 - enterE),
          enterE * (camZ - 24)
        );

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
      // StrictMode double-invokes effects; disposing GPU state the remounted
      // component still holds is a black canvas with no error. Deferring one
      // cancellable tick lets the remount win.
      setTimeout(() => teardown?.(), 0);
    };
  }, [assembleRef, shatterRef, enterRef, scrollRef]);

  return (
    // absolute, not fixed: this lives inside the Stage's fixed host
    <div
      ref={hostRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    />
  );
}
