/**
 * The walk through the Sanchi gate, as one camera moving over one ground plane.
 *
 * The scene plate (public/scene/day-*.webp) was rendered with a level camera: 60° vertical field
 * of view, eye 1.6 m above the ground, horizon at 76% of the frame, one paving texture per 4.6 m
 * (scripts/render_plate.py). This module uses that same camera. The near ground is drawn every
 * frame on a canvas from the real paving texture, in true perspective (one textured row per
 * screen row) all the way to the horizon, hazing with distance as the plate does. The gate is projected through the
 * same camera, so its feet stay planted on the paving as you walk towards it and between its pillars.
 */

import { asset } from "@/lib/asset";

const PLATE_W = 2880;
const PLATE_H = 1620;
const PLATE_F = PLATE_H / 2 / Math.tan(Math.PI / 6); // focal length of the plate, in plate pixels
const HORIZON = 0.76; // horizon, as a fraction of the frame height
const EYE = 1.6; // eye height, metres
const TILE = 4.6; // metres covered by one paving texture

// Gate photo geometry, as fractions of the image box (scripts/build_assets.py).
const GATE_ASPECT = 0.6265;
const GATE_EYE = 0.753; // the photo's eye-level line
const GATE_FEET = 0.915; // where the pillars meet the ground
const GATE_H = EYE / (GATE_FEET - GATE_EYE); // image height in metres that puts the eye line at 1.6 m

const HAZE = 130; // metres: the air thickens towards the horizon as 1 − e^(−d/HAZE), measured from the plate
const HAZE_RGB = "170, 169, 169"; // the plate's horizon colour
// each pillar's footprint, as fractions of the gate width (measured from the photo's alpha at the feet)
const FEET_X: [number, number][] = [
  [0.134, 0.286],
  [0.685, 0.83],
];
const GATE_CX = 0.491; // the opening's centre
const PILLAR_DEPTH = 0.9; // metres: the pillars are square in plan
const PILLAR = 0.27; // each pillar's centre, as a fraction of the gate width from the opening's centre
// the empty doorway, as fractions of the image box (measured from the photo's alpha): once it is wider and taller
// than the screen no stone is in view, so the gate is hidden rather than scaled up to tens of thousands of pixels,
// a layer too large for the browser to keep (it would drop it, and the gate would flicker or vanish)
const HOLE_X: [number, number] = [0.311, 0.671];
const HOLE_TOP = 0.353;

export type WalkOptions = {
  /** where the gate first stands: 0 is the centre of the screen, 0.27 is right of centre */
  offset: number;
  /** the gate's first height, as a fraction of the screen height (desktop; phones fill the height) */
  size: number;
};

type Layout = {
  w: number;
  h: number;
  f: number;
  hy: number;
  gateX: number;
  d0: number;
  baseH: number;
  pass: number;
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** walk progress by which the opening title has gone; the turn towards the gate starts here */
export const TITLE_OUT = 0.08;
const easeInOut = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t));

export class GateWalk {
  private ctx: CanvasRenderingContext2D | null;
  private mips: { pattern: CanvasPattern; k: number }[] = [];
  private layoutState: Layout | null = null;
  private last = -1;
  private want = 0; // the progress last asked for, drawn as soon as the stage is laid out

  constructor(
    private world: HTMLElement,
    private back: HTMLElement,
    private canvas: HTMLCanvasElement,
    private gate: HTMLElement,
    private textureUrl: string,
    private options: WalkOptions = { offset: 0.27, size: 0.86 },
  ) {
    this.ctx = canvas.getContext("2d");
  }

  /** Loads the paving texture and builds a small mip chain, so distant rows never shimmer. */
  async load() {
    // stand the gate up and let it walk straight away; the moving paving joins in once it has loaded (on a slow
    // network the gate would otherwise stand still while the title has already gone)
    this.layout();
    const img = new Image();
    img.decoding = "async";
    img.src = this.textureUrl;
    try {
      await img.decode();
    } catch {
      // decode() can reject (Safari does at times) although the image loads; wait for it instead, and if the
      // paving never arrives, lay the stage out anyway so the gate still stands and walks
      await new Promise<void>((done) => (img.complete ? done() : ((img.onload = () => done()), (img.onerror = () => done()))));
    }
    if (!this.ctx || !img.naturalWidth) return this.layout();
    let size = img.naturalWidth;
    let source: CanvasImageSource = img;
    while (size >= 64) {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const cx = c.getContext("2d");
      if (!cx) break;
      cx.imageSmoothingQuality = "high";
      cx.drawImage(source, 0, 0, size, size);
      const pattern = this.ctx.createPattern(c, "repeat");
      if (pattern) this.mips.push({ pattern, k: size / TILE });
      source = c;
      size = Math.floor(size / 2);
    }
    this.layout();
  }

  /** Measures the stage. Call on load and on resize. */
  layout() {
    this.world.classList.add("is-walk-ready");
    const w = this.world.clientWidth;
    const h = this.world.clientHeight;
    const portrait = h > w;
    const scale = Math.max(w / PLATE_W, h / PLATE_H); // the plate is shown with object-fit: cover
    const f = PLATE_F * scale;
    const hy = HORIZON * h;
    // the gate's first size on screen: tall on a phone; on a desktop, right of the title and clear of the navigation
    const { offset, size } = this.options;
    const gateScreenH = portrait ? Math.min(0.98 * h, 1.92 * w) * (size / 0.86) : Math.min(size * h, 1.66 * size * w);
    const d0 = (GATE_H * f) / gateScreenH;
    const gateX = portrait ? 0 : (offset * w * d0) / f;
    // the walk ends where the pillars' centres reach the edges of the screen
    const pass = Math.min(d0 * 0.8, (GATE_H * f * 2 * PILLAR * GATE_ASPECT) / w);
    this.layoutState = { w, h, f, hy, gateX, d0, baseH: gateScreenH, pass };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.gate.style.height = `${gateScreenH}px`;
    this.gate.style.width = `${gateScreenH * GATE_ASPECT}px`;
    this.last = -1;
    this.render(this.want);
  }

  /**
   * Draws the scene at walk progress p (0: standing back, title in view; 1: through the gate).
   * Once the title has gone (TITLE_OUT) the camera turns towards the gate; the walk itself is one smooth ease, with no head sway.
   * Safe to call before the paving has loaded: the latest progress is drawn once it has.
   */
  render(p: number) {
    this.want = p;
    const L = this.layoutState;
    if (!L || !this.ctx || p === this.last) return;
    this.last = p;

    // the camera holds still until the title has gone (TITLE_OUT), so the title never sits over a moving gate,
    // and on the way back up the gate is at rest again before the title returns
    // (the turn's slow first steps overlap the title's last, faint ones, so the gate never seems parked without a title)
    const turn = easeInOut((p - TITLE_OUT + 0.02) / 0.2);
    const walk = easeInOut((p - TITLE_OUT) / 0.78);
    const camX = L.gateX * turn;
    // after the doorway has opened, keep walking: the pillars slide out past the edges of the screen
    const through = easeInOut((p - 0.86) / 0.14);
    const camZ = (L.d0 - L.pass) * walk + (L.pass - 0.12) * through;
    const d = L.d0 - camZ; // distance from the eye to the gate

    const hy = L.hy;
    const cx = L.w / 2;

    this.drawGround(L, camX, camZ, cx, hy);
    this.drawContact(L, camX, d, cx, hy);

    // the gate, through the same camera: its feet sit on the ground line for its distance
    const s = (GATE_H * L.f) / d / L.baseH;
    const gh = L.baseH * s;
    const feetY = hy + (EYE * L.f) / d;
    const top = feetY - GATE_FEET * gh;
    const left = cx + ((L.gateX - camX) * L.f) / d - (gh * GATE_ASPECT) / 2;
    const gw = gh * GATE_ASPECT;
    // how far the stone still reaches into the screen, past the doorway's edges: as it leaves, the gate fades out,
    // and once it has gone it is hidden and no longer scaled up
    const reach = Math.max(left + HOLE_X[0] * gw, L.w - (left + HOLE_X[1] * gw), top + HOLE_TOP * gh, L.h - feetY);
    const fade = clamp(reach / (0.08 * L.w));
    this.gate.style.opacity = fade < 1 ? String(fade) : "";
    this.gate.style.visibility = fade > 0 ? "" : "hidden";
    if (fade > 0) this.gate.style.transform = `translate3d(${left}px, ${top}px, 0) scale(${s})`;
  }

  /**
   * Contact shadows: where each pillar stands, the ground is darkest right at the stone and
   * lightens over half a metre, drawn on the ground plane in perspective so it stays put.
   */
  private drawContact(L: Layout, camX: number, d: number, cx: number, hy: number) {
    const ctx = this.ctx!;
    const dpr = this.canvas.width / L.w;
    const gateW = GATE_H * GATE_ASPECT; // metres
    const project = (x: number, z: number): [number, number] => {
      const dz = Math.max(0.05, z);
      return [(cx + ((x - camX) * L.f) / dz) * dpr, (hy + (EYE * L.f) / dz) * dpr];
    };
    ctx.fillStyle = "rgb(28, 22, 18)";
    for (const [x0f, x1f] of FEET_X) {
      const x0 = L.gateX + (x0f - GATE_CX) * gateW;
      const x1 = L.gateX + (x1f - GATE_CX) * gateW;
      // wide and faint to tight and dark: a soft falloff without a blur filter
      for (const [r, a] of [
        [0.7, 0.07],
        [0.45, 0.1],
        [0.26, 0.14],
        [0.13, 0.18],
        [0.06, 0.26],
        [0.02, 0.42],
      ] as const) {
        const near = d - r;
        if (near <= 0.1) continue;
        const pts = [project(x0 - r, near), project(x1 + r, near), project(x1 + r, d + PILLAR_DEPTH + r), project(x0 - r, d + PILLAR_DEPTH + r)];
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (const [px, py] of pts.slice(1)) ctx.lineTo(px, py);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  private drawGround(L: Layout, camX: number, camZ: number, cx: number, hy: number) {
    const ctx = this.ctx!;
    const dpr = this.canvas.width / L.w;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!this.mips.length) return;

    const f = L.f * dpr;
    const hyD = hy * dpr;
    const cxD = cx * dpr;
    const W = this.canvas.width;
    const start = Math.ceil(hyD + 1);
    for (let y = start; y < this.canvas.height; y++) {
      const dist = (f * EYE) / (y - hyD); // metres to this row of ground
      // pick the mip whose texels are about one device pixel wide at this distance
      const texPerPx = (dist * this.mips[0].k) / f;
      const level = Math.min(this.mips.length - 1, Math.max(0, Math.floor(Math.log2(texPerPx))));
      const { pattern, k } = this.mips[level];
      const sx = f / (dist * k);
      const tx = cxD - (camX * f) / dist;
      const v = (camZ + dist) * k;
      pattern.setTransform(new DOMMatrix([sx, 0, 0, 1, tx, y - v]));
      ctx.fillStyle = pattern;
      ctx.fillRect(0, y, W, 1);
      // air between the eye and this row of ground
      ctx.fillStyle = `rgba(${HAZE_RGB}, ${1 - Math.exp(-dist / HAZE)})`;
      ctx.fillRect(0, y, W, 1);
    }
  }
}

/**
 * Sets up the walk for a gate scene (ScenePlate, the ground canvas and the gate inside `scene`): picks the
 * paving texture for the screen, loads it and keeps the stage laid out on resize. Call dispose() on unmount.
 */
export function mountGateWalk(scene: HTMLElement, options: WalkOptions) {
  const part = <T extends HTMLElement>(cls: string) => scene.querySelector<T>(cls)!;
  const small = window.matchMedia("(max-width: 860px)").matches;
  const walk = new GateWalk(
    scene,
    part(".gate-scene__back"),
    part<HTMLCanvasElement>(".gate-scene__ground"),
    part(".gate-scene__gate"),
    asset(small ? "/scene/paving-1024.webp" : "/scene/paving-2048.webp"),
    options,
  );
  const loaded = walk.load();
  const onResize = () => walk.layout();
  window.addEventListener("resize", onResize);
  return { walk, loaded, dispose: () => window.removeEventListener("resize", onResize) };
}
