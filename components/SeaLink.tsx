"use client";

import { useEffect, useRef, type RefObject } from "react";
import { asset } from "@/lib/asset";

/**
 * The Bandra–Worli Sea Link drawn in points across the whole About section, after haurlan.com.
 * The points were sampled once from the team's night photograph (public/scene/sealink-points.json:
 * x, y on a 0–scale grid, brightness 0–9, warm 0/1). Drawn at whole device pixels so they stay crisp.
 *
 * Three motions, all small:
 * - a slow wave runs through the points, so the bridge breathes;
 * - the whole field drifts opposite to the cursor (parallax), eased;
 * - points right under the cursor push away and spring back.
 * Nothing moves under reduced motion; the loop pauses while the section is off screen.
 */

const WAVE = 3.2; // css px, height of the wave through the points
const DRIFT = { x: 26, y: 16 }; // css px the field drifts, opposite to the cursor, at the screen's edge
const EASE = 0.05; // how quickly the drift follows the cursor, per frame
const RADIUS = 100; // css px around the pointer that the points move away from
const PUSH = 40; // how far a point at the pointer is pushed, in css px
const SPRING = 0.09; // pull back towards home each frame
const DAMP = 0.78; // velocity kept each frame

/** `text`: the words laid over the bridge; points behind them are drawn faint. */
export default function SeaLink({ label, text }: { label: string; text: RefObject<HTMLElement | null> }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const host = el?.parentElement;
    const ctx = el?.getContext("2d");
    if (!el || !host || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let n = 0;
    let sx = new Float32Array(0); // position in the photograph, 0–1
    let sy = new Float32Array(0);
    let bucket = new Uint8Array(0); // 0–5: colour and brightness group, drawn together
    let size = new Uint8Array(0); // 1 or 2 device pixels
    let quiet = new Uint8Array(0); // 1 where the point sits behind the text, drawn fainter
    let hx = new Float32Array(0); // home, in device px
    let hy = new Float32Array(0);
    let ox = new Float32Array(0); // push offset from home
    let oy = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let aspect = 1.78;
    let dpr = 1;
    let pointer: { x: number; y: number } | null = null; // inside the canvas, device px
    const drift = { x: 0, y: 0, tx: 0, ty: 0 }; // eased and target drift, device px
    let raf = 0;
    let visible = false;

    const styles = [
      "rgba(240, 239, 235, 0.55)",
      "rgba(240, 239, 235, 0.8)",
      "rgba(255, 255, 255, 1)",
      "rgba(242, 184, 120, 0.6)",
      "rgba(242, 184, 120, 0.85)",
      "rgba(255, 205, 150, 1)",
    ];

    /** Fit the photograph's points to the section like object-fit: cover, the bridge kept to the left. */
    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = el.clientWidth;
      const H = el.clientHeight;
      el.width = Math.round(W * dpr);
      el.height = Math.round(H * dpr);
      const scale = Math.max(W / aspect, H); // height of the picture in css px
      const pw = scale * aspect;
      const left = (W - pw) * 0.35;
      const top = (H - scale) * 0.5;
      // behind the text the points are drawn fainter, so every line stays readable
      const words = getComputedStyle(el).position === "absolute" ? text.current?.getBoundingClientRect() : null;
      const me = el.getBoundingClientRect();
      for (let i = 0; i < n; i++) {
        const x = left + sx[i] * pw;
        const y = top + sy[i] * scale;
        hx[i] = x * dpr;
        hy[i] = y * dpr;
        quiet[i] =
          words && x > words.left - me.left - 32 && x < words.right - me.left + 32 && y > words.top - me.top - 24 && y < words.bottom - me.top + 24 ? 1 : 0;
      }
      draw(0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, el.width, el.height);
      const s = t / 1000;
      const wave = still ? 0 : WAVE * dpr;
      const dx = drift.x;
      const dy = drift.y;
      for (let q = 0; q < 2; q++) {
        ctx.globalAlpha = q ? 0.22 : 1;
        for (let b = 0; b < styles.length; b++) {
          ctx.fillStyle = styles[b];
          for (let i = 0; i < n; i++) {
            if (bucket[i] !== b || quiet[i] !== q) continue;
            // a long swell travelling along the bridge, and a smaller cross ripple
            const w = wave ? Math.sin(s * 0.9 + sx[i] * 9 + sy[i] * 4) * wave + Math.sin(s * 1.6 - sx[i] * 14) * wave * 0.35 : 0;
            const px = Math.round(hx[i] + ox[i] + dx + (wave ? Math.cos(s * 0.7 + sy[i] * 7) * wave * 0.4 : 0));
            const py = Math.round(hy[i] + oy[i] + dy + w);
            const sz = dpr > 1 ? size[i] + 1 : size[i];
            ctx.fillRect(px, py, sz, sz);
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const push = () => {
      const r = RADIUS * dpr;
      const strength = PUSH * dpr;
      for (let i = 0; i < n; i++) {
        if (pointer) {
          const ddx = hx[i] + ox[i] + drift.x - pointer.x;
          const ddy = hy[i] + oy[i] + drift.y - pointer.y;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < r * r) {
            const d = Math.sqrt(d2) || 1;
            const k = 1 - d / r;
            const f = k * k * (strength / 4);
            vx[i] += (ddx / d) * f;
            vy[i] += (ddy / d) * f;
          }
        }
        vx[i] = (vx[i] - ox[i] * SPRING) * DAMP;
        vy[i] = (vy[i] - oy[i] * SPRING) * DAMP;
        ox[i] += vx[i];
        oy[i] += vy[i];
      }
    };

    const loop = (t: number) => {
      if (visible) {
        drift.x += (drift.tx - drift.x) * EASE;
        drift.y += (drift.ty - drift.y) * EASE;
        push();
        draw(t);
      }
      raf = requestAnimationFrame(loop);
    };

    // the whole field drifts opposite to where the cursor is on the screen
    const onWindowMove = (e: PointerEvent) => {
      drift.tx = -((e.clientX / window.innerWidth) * 2 - 1) * DRIFT.x * dpr;
      drift.ty = -((e.clientY / window.innerHeight) * 2 - 1) * DRIFT.y * dpr;
      const rect = el.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      pointer = inside ? { x: (e.clientX - rect.left) * dpr, y: (e.clientY - rect.top) * dpr } : null;
    };
    const onLeave = () => {
      pointer = null;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });

    fetch(asset("/scene/sealink-points.json"))
      .then((r) => r.json())
      .then((d: { aspect: number; scale: number; points: number[] }) => {
        aspect = d.aspect;
        n = d.points.length / 4;
        sx = new Float32Array(n);
        sy = new Float32Array(n);
        bucket = new Uint8Array(n);
        size = new Uint8Array(n);
        quiet = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
          const b = d.points[i * 4 + 2];
          sx[i] = d.points[i * 4] / d.scale;
          sy[i] = d.points[i * 4 + 1] / d.scale;
          bucket[i] = (d.points[i * 4 + 3] ? 3 : 0) + (b >= 8 ? 2 : b >= 6 ? 1 : 0);
          size[i] = b >= 8 ? 2 : 1;
        }
        hx = new Float32Array(n);
        hy = new Float32Array(n);
        ox = new Float32Array(n);
        oy = new Float32Array(n);
        vx = new Float32Array(n);
        vy = new Float32Array(n);
        layout();
        if (!still) {
          io.observe(el);
          window.addEventListener("pointermove", onWindowMove, { passive: true });
          document.documentElement.addEventListener("pointerleave", onLeave);
          raf = requestAnimationFrame(loop);
        }
      })
      .catch(() => {});

    const ro = new ResizeObserver(() => layout());
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onWindowMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [text]);

  return <canvas ref={canvas} className="sealink" role="img" aria-label={label} />;
}
