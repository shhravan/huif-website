/**
 * The walk through the Sanchi gate, as one camera moving over one ground plane.
 *
 * The scene plate (public/scene/day-*.webp) was rendered with a level camera: 60° vertical field
 * of view, eye 1.6 m above the ground, horizon at 76% of the frame, one paving texture per 4.6 m
 * (scripts/render_plate.py). This module uses that same camera. The near ground is drawn every
 * frame on a canvas from the real paving texture, in true perspective (one textured row per
 * screen row), and fades into the plate's own hazy distance. The gate is projected through the
 * same camera, so its feet stay planted on the paving as you walk towards it and between its pillars.
 */

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

const STEP = 0.78; // metres per step, for the walking sway
const PILLAR = 0.27; // each pillar's centre, as a fraction of the gate width from the opening's centre

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
const easeInOut = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t));

export class GateWalk {
  private ctx: CanvasRenderingContext2D | null;
  private mips: { pattern: CanvasPattern; k: number }[] = [];
  private layoutState: Layout | null = null;
  private last = -1;

  constructor(
    private world: HTMLElement,
    private back: HTMLElement,
    private canvas: HTMLCanvasElement,
    private gate: HTMLElement,
    private textureUrl: string,
  ) {
    this.ctx = canvas.getContext("2d");
  }

  /** Loads the paving texture and builds a small mip chain, so distant rows never shimmer. */
  async load() {
    const img = new Image();
    img.decoding = "async";
    img.src = this.textureUrl;
    await img.decode();
    if (!this.ctx) return;
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
    // the gate's first size on screen, as before: tall on a phone, right of the title on a desktop
    const gateScreenH = portrait ? Math.min(0.98 * h, 1.92 * w) : Math.min(0.918 * h, 1.53 * w);
    const d0 = (GATE_H * f) / gateScreenH;
    const gateX = portrait ? 0 : (0.24 * w * d0) / f;
    // the walk ends where the pillars' centres reach the edges of the screen
    const pass = Math.min(d0 * 0.8, (GATE_H * f * 2 * PILLAR * GATE_ASPECT) / w);
    this.layoutState = { w, h, f, hy, gateX, d0, baseH: gateScreenH, pass };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.gate.style.height = `${gateScreenH}px`;
    this.gate.style.width = `${gateScreenH * GATE_ASPECT}px`;
    const p = this.last;
    this.last = -1;
    this.render(p < 0 ? 0 : p);
  }

  /**
   * Draws the scene at walk progress p (0: standing back, title in view; 1: through the gate).
   * The first fifth turns towards the gate; the rest is the walk.
   */
  render(p: number) {
    const L = this.layoutState;
    if (!L || !this.ctx || p === this.last) return;
    this.last = p;

    const turn = easeInOut(p / 0.22);
    const walk = easeInOut((p - 0.06) / 0.94);
    const camX = L.gateX * turn;
    const camZ = (L.d0 - L.pass) * walk;
    const d = L.d0 - camZ; // distance from the eye to the gate

    // a gentle sway with each step, only while walking
    const phase = (camZ / STEP) * Math.PI;
    const moving = Math.sin(Math.PI * clamp(walk * 1.15));
    const bob = Math.abs(Math.sin(phase)) * -0.004 * L.h * moving;
    const sway = Math.sin(phase) * 0.0025 * L.w * moving;
    const hy = L.hy + bob;
    const cx = L.w / 2 + sway;

    // the sky and the far ground move with the head, too
    this.back.style.transform = `translate3d(${sway}px, ${bob}px, 0) scale(1.02)`;
    this.drawGround(L, camX, camZ, cx, hy);

    // the gate, through the same camera: its feet sit on the ground line for its distance
    const s = (GATE_H * L.f) / d / L.baseH;
    const gh = L.baseH * s;
    const feetY = hy + (EYE * L.f) / d;
    const top = feetY - GATE_FEET * gh;
    const left = cx + ((L.gateX - camX) * L.f) / d - (gh * GATE_ASPECT) / 2;
    this.gate.style.transform = `translate3d(${left}px, ${top}px, 0) scale(${s})`;
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
      // near ground is solid; from 9 m it hands over to the plate's own hazy distance
      const alpha = clamp((17 - dist) / 8);
      if (alpha <= 0) continue;
      // pick the mip whose texels are about one device pixel wide at this distance
      const texPerPx = (dist * this.mips[0].k) / f;
      const level = Math.min(this.mips.length - 1, Math.max(0, Math.floor(Math.log2(texPerPx))));
      const { pattern, k } = this.mips[level];
      const sx = f / (dist * k);
      const tx = cxD - (camX * f) / dist;
      const v = (camZ + dist) * k;
      pattern.setTransform(new DOMMatrix([sx, 0, 0, 1, tx, y - v]));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = pattern;
      ctx.fillRect(0, y, W, 1);
    }
    ctx.globalAlpha = 1;
  }
}
