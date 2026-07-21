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
 * As the last fragments land, a hard offset plate slides out from behind the
 * word in vermilion — v2's specimen-plate shadow, at wordmark scale. That is
 * the brutalist beat: no blur, no glow, one flat block of colour with a hard
 * edge, carrying the contrast the letterforms deliberately no longer carry.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * COLOUR MANAGEMENT OFF, DELIBERATELY.
 *
 * three converts `new THREE.Color(0x3b3947)` from sRGB into its linear
 * working space (0.041, not 0.231) and relies on the renderer's output
 * transform to convert back. That transform is appended to the fragment
 * shaders of three's OWN materials; a ShaderMaterial that writes gl_FragColor
 * itself never receives it. The result is every colour in this scene emitting
 * at roughly half its intended lightness — which is exactly why the wordmark
 * kept reading as a black slab no matter how light the ink was set.
 *
 * This scene is flat-shaded and its palette is authored as hex to match the
 * stylesheet, so the honest fix is to stay in one space end to end rather than
 * to hand-roll an encode in the shader and hope the two agree.
 */
THREE.ColorManagement.enabled = false;

const VERT = /* glsl */ `
precision highp float;

attribute vec3 aChaosPos;
attribute vec3 aWordPos;
attribute vec3 aChaosRot;
attribute vec3 aWordRot;
attribute vec2 aScale;
attribute float aDelay;
attribute float aTone;
attribute float aAccent;
attribute float aRules;

uniform float uProgress;
uniform float uTime;
uniform float uReduced;
uniform float uWordScale;
uniform float uLoosen;
uniform float uShadow;      // 1.0 on the brutalist offset plate
uniform vec3  uShadowOff;

varying vec2  vUv;
varying float vSettle;
varying float vTone;
varying float vAccent;
varying float vFog;
varying float vShade;
varying float vRules;
varying float vFacing;

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
  vAccent = aAccent;
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

  // the plate is a HARD offset of the finished word — flat, unblurred, and
  // only ever where the word already is
  pos += uShadowOff * uShadow * s;

  vec3 spin = aChaosRot + vec3(uTime * 0.09) * (1.0 - uReduced);
  vec3 rot = mix(spin, aWordRot, s);

  // THE PLACED PIECE DOES NOT KEEP THE TORN SHAPE.
  //
  // Chaos wants long ripped strips — that is what shredded paper is. But
  // scaling those same strips down and laying them into letterforms gives
  // thousands of thin slivers at slightly different angles, and that reads as
  // hatching, or handwriting, or scribble. It does not read as type. The word
  // is meant to arrive as a BOLD SETTING, so the placed piece resolves to a
  // small, near-uniform tile whose union has a clean edge and a solid middle.
  //
  // The plate's growth must stay well UNDER its offset, or it spreads past
  // the word on every side and reads as a halo instead of a second impression.
  vec2 wordSc = vec2(uWordScale, uWordScale * 0.78) * (0.88 + aTone * 0.24);
  vec2 sc = mix(aScale, wordSc, s) * (1.0 + uShadow * 0.38);

  mat3 R = rotate(rot);
  vec3 local3 = vec3(position.xy * sc, 0.0);
  vec3 world = R * local3 + pos;

  // PAPER CATCHES LIGHT. A sheet with no shading is a coloured rectangle; a
  // sheet whose face brightens as it turns through a key light is paper. One
  // fixed directional term is enough, and it costs a dot product.
  vec3 N = normalize(R * vec3(0.0, 0.0, 1.0));
  vec3 L = normalize(vec3(-0.35, 0.78, 0.52));
  float ndl = dot(N, L);
  vFacing = step(0.0, ndl);
  // the back of a sheet is not black, it is the same paper in less light
  vShade = mix(0.58, 1.0, abs(ndl)) * mix(0.82, 1.0, vFacing);

  vec4 mv = modelViewMatrix * vec4(world, 1.0);
  vFog = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
precision highp float;

uniform vec3  uPorcelain;
uniform vec3  uInk;
uniform vec3  uVermilion;
uniform float uFogDensity;
uniform float uShadow;
uniform float uPlateIn;   // when the brutalist plate is allowed to exist

varying vec2  vUv;
varying float vSettle;
varying float vTone;
varying float vAccent;
varying float vFog;
varying float vShade;
varying float vRules;
varying float vFacing;

void main(){
  vec2 p = abs(vUv - 0.5) * 2.0;

  // the sheet is CUT, not faded: paper has an edge, and an opaque sheet lets
  // the stack occlude itself the way paper actually does
  float border = smoothstep(0.98, 0.9, max(p.x, p.y));
  if (border < 0.5) discard;

  /* ---- the brutalist plate ---- */
  if (uShadow > 0.5) {
    // It exists only once the word has essentially landed, and it is FLAT:
    // no shading, no fog, no tonal variation. That flatness is the point —
    // it reads as a printed block behind the type, not as more paper.
    float on = smoothstep(0.90, 1.0, vSettle) * uPlateIn;
    if (on < 0.01) discard;
    gl_FragColor = vec4(mix(uPorcelain, uVermilion, on), 1.0);
    return;
  }

  // Fragments carry ruled lines, not a texture: a document reads as a
  // document because of the horizontal rhythm of type on it. The count varies
  // per sheet, so a shredded pile does not repeat one printed page.
  float rule = smoothstep(0.07, 0.0, abs(fract(vUv.y * vRules) - 0.5) - 0.33);
  // a heavier band near the head of the sheet — a letterhead, a total row
  float head = smoothstep(0.055, 0.0, abs(vUv.y - 0.82) - 0.02);
  // The floor is HIGH. These terms all multiply, and a 0.60 base combined
  // with tone and shading landed the settled word at ~0.45 density — a light
  // grey, not the graphite it is meant to be. Ruling should modulate the
  // sheet, not halve it.
  float body = 0.86 + rule * 0.14 + head * 0.14;

  // INK ON PAPER. Loose fragments sit light against the ground; placed ones
  // darken as they take their place, so the darkening and the placing are the
  // same event. The ceiling is deliberately short of black: the letterforms
  // sit at a graphite weight and let the vermilion plate carry the contrast.
  float density = (0.30 + vSettle * 0.70) * body * (0.82 + vTone * 0.18);
  // Directional shading is what makes a TUMBLING sheet read as paper, and it
  // is exactly what must not survive into the word: a settled fragment sits
  // face-on, so N·L lands near 0.5 for every one of them and quietly halves
  // the ink across the whole wordmark. Same failure as the fog — the depth
  // cue belongs to the chaos, not to the payoff.
  density *= mix(vShade, 1.0, vSettle * 0.85);

  vec3 col = mix(uPorcelain, uInk, clamp(density, 0.0, 1.0));

  // the signal: a rare minority of records carry the accent once placed.
  // Colour is measurement here — it marks the ones the system acted on.
  col = mix(col, uVermilion, vAccent * vSettle * 0.8);

  // Porcelain fog — depth is distance into the page, not into shadow. Scaled
  // OUT by settle: unstructured debris needs the depth cue and should
  // dissolve into the ground, but fogging the resolved letterforms is what
  // turns the wordmark grey, and the payoff has to arrive at full strength.
  float f = 1.0 - exp(-uFogDensity * uFogDensity * vFog * vFog);
  col = mix(col, uPorcelain, clamp(f, 0.0, 1.0) * (1.0 - vSettle * 0.92));

  gl_FragColor = vec4(col, 1.0);
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
 * THE FAMILY NAME MATTERS. next/font emits a scoped family
 * (`__Archivo_afd4a3`), so `ctx.font = "700 300px Archivo"` silently matches
 * nothing and rasterises in the browser's default sans — which is how the
 * first build ended up with a wordmark in the wrong typeface entirely. The
 * real name is read off the live headline, and `expanded` in the shorthand is
 * what reaches Archivo's width axis, since canvas cannot take
 * font-variation-settings.
 */
function sampleWord(
  text: string,
  count: number,
  rand: () => number,
  family: string
) {
  const W = 1800;
  const H = 460;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000";
  type Tracking = CanvasRenderingContext2D & { letterSpacing?: string };
  try {
    (ctx as Tracking).letterSpacing = "-0.035em";
  } catch {
    /* pre-2023 engines simply set the word slightly loose */
  }

  // 800, not the 700 the DOM display uses: this is a lockup made of paper
  // rather than a line of running text, and it has to hold as a bold mass
  // once several thousand tiles are standing in for its strokes.
  const spec = (px: number) => `800 expanded ${px}px "${family}"`;

  // fit the word to the plate rather than guessing a size
  let size = 300;
  ctx.font = spec(size);
  const measured = ctx.measureText(text).width || 1;
  size = Math.max(40, Math.floor(size * ((W * 0.94) / measured)));
  ctx.font = spec(size);

  ctx.clearRect(0, 0, W, H);
  ctx.fillText(text, W / 2, H / 2);

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
        getComputedStyle(probe).fontFamily.split(",")[0].trim().replace(/["']/g, "") ||
        "sans-serif";
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
      // matches the ColorManagement.enabled = false decision above: no output
      // transform, so what the shader writes is what the display gets
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
      renderer.setClearColor(0xf3f2f6, 1); // porcelain
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
      const accent = new Float32Array(count);
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

        // Placed: square to the reader. The residual jitter is now a fifth of
        // what it was — at ±4° every tile fought its neighbours and the
        // letterform edges came out furred, which is most of what made the
        // wordmark read as a texture rather than as set type. A trace remains
        // so the setting is hand-straightened, not machine-perfect.
        wordRot[i * 3 + 0] = (rand() - 0.5) * 0.012;
        wordRot[i * 3 + 1] = (rand() - 0.5) * 0.012;
        wordRot[i * 3 + 2] = (rand() - 0.5) * 0.014;

        // A shredded pile is not one repeated sheet. Most fragments are torn
        // strips — long and thin — with a minority of squarer pieces, which
        // is what a document actually breaks into.
        const strip = rand();
        const w = 0.8 + rand() * 0.4;
        scale[i * 2 + 0] = w;
        scale[i * 2 + 1] =
          strip < 0.62
            ? w * (0.16 + rand() * 0.14) // torn strip
            : w * (0.42 + rand() * 0.3); // a squarer piece

        delay[i] = rand();
        tone[i] = 0.55 + rand() * 0.45;
        // ~2% carry the signal. At 7% this read as measles across the
        // letterforms rather than as a marked minority.
        accent[i] = rand() < 0.02 ? 1 : 0;
        // 3–7 ruled lines per sheet
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
      geo.setAttribute("aAccent", inst(accent, 1));
      geo.setAttribute("aRules", inst(rules, 1));
      geo.instanceCount = count;
      // instances are placed entirely in the vertex shader, so three's own
      // culling would discard the whole field on the origin
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 90);

      const shared = {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uReduced: { value: reduced ? 1 : 0 },
        uWordScale: { value: 0.34 },
        uLoosen: { value: 0 },
        uPlateIn: { value: 0 },
        uPorcelain: { value: new THREE.Color(0xf3f2f6) },
        // Graphite, not near-black. v2's body ink at full strength made the
        // wordmark a black slab that fought the porcelain; pulled all the way
        // back to a light grey it stopped reading as type at all. This sits
        // between, and lets the vermilion plate carry the contrast.
        uInk: { value: new THREE.Color(0x3b3947) },
        uVermilion: { value: new THREE.Color(0xc8482a) },
        uFogDensity: { value: 0.019 },
      };

      const mkMat = (isShadow: boolean) =>
        new THREE.ShaderMaterial({
          vertexShader: VERT,
          fragmentShader: FRAG,
          uniforms: {
            ...shared,
            uShadow: { value: isShadow ? 1 : 0 },
            // A TIGHT offset. Far enough to read as a deliberate second
            // impression, close enough that the word still reads as one
            // object — at 0.62 the plate detached and became a red shape
            // sitting next to the type rather than under it.
            uShadowOff: {
              value: isShadow
                ? new THREE.Vector3(0.52, -0.52, -0.9)
                : new THREE.Vector3(),
            },
          },
          transparent: false,
          depthWrite: true,
          depthTest: true,
          side: THREE.DoubleSide,
          blending: THREE.NormalBlending,
        });

      const mat = mkMat(false);
      const plateMat = mkMat(true);

      // the plate is drawn first and sits behind — a hard offset block, the
      // way v2's specimen plates cast theirs
      const plate = new THREE.Mesh(geo, plateMat);
      plate.frustumCulled = false;
      plate.renderOrder = 0;
      scene.add(plate);

      const mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      mesh.renderOrder = 1;
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
        if (rawDt > 0.25 || reduced) eased = target;
        else eased += (target - eased) * Math.min(1, dt * 4.0);
        const p = eased;
        const sp = THREE.MathUtils.clamp(scrollRef.current ?? 0, 0, 1);

        mat.uniforms.uProgress.value = p;
        mat.uniforms.uTime.value = t;
        mat.uniforms.uLoosen.value = sp;
        plateMat.uniforms.uProgress.value = p;
        plateMat.uniforms.uTime.value = t;
        plateMat.uniforms.uLoosen.value = sp;
        // the plate arrives in the last of the resolve, not with it
        const plateIn = THREE.MathUtils.smoothstep(p, 0.86, 1.0);
        mat.uniforms.uPlateIn.value = plateIn;
        plateMat.uniforms.uPlateIn.value = plateIn;

        ptr.x += (ptr.tx - ptr.x) * 0.05;
        ptr.y += (ptr.ty - ptr.y) * 0.05;

        // THE CAMERA IS THE NARRATOR. It begins inside the debris and comes
        // to rest square-on to the word. One move, never cut.
        //
        // The resting distance is SOLVED from the aspect rather than typed in.
        // A fixed dolly frames the word correctly on the one viewport it was
        // authored against and lets it run off both edges on a phone.
        const e = 1 - Math.pow(1 - p, 2.1);
        const fit = portrait ? FIT_PORTRAIT : FIT_LANDSCAPE;
        const restD =
          WORD_W / (fit * 2 * Math.tan(HALF_FOV) * Math.max(camera.aspect, 0.3));
        const startD = restD * 1.5;
        const dolly = startD + (restD - startD) * e - sp * restD * 0.1;

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
        plateMat.dispose();
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
