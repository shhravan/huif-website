"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";

/**
 * The Bandra–Worli Sea Link drawn in points across the whole About section.
 * The points were sampled once from the team's night photograph (public/scene/sealink-points.json:
 * x, y on a 0–scale grid, brightness 0–9, warm 0/1). The picture is still; under the pointer the
 * points spread away and spring back. Drawn at device pixels, so each point stays crisp. No movement
 * under reduced motion.
 */

const RADIUS = 110; // css px around the pointer that the points move away from
const PUSH = 46; // how far a point at the pointer is pushed, in css px
const SPRING = 0.09; // pull back towards home each frame
const DAMP = 0.78; // velocity kept each frame

export default function SeaLink({ label }: { label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const host = el?.parentElement;
    const ctx = el?.getContext("2d");
    if (!el || !host || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let n = 0;
    let src = { x: new Float32Array(0), y: new Float32Array(0) };
    let bucket = new Uint8Array(0); // 0–5: colour and brightness group, drawn together
    let size = new Uint8Array(0); // 1 or 2 device pixels
    let quiet = new Uint8Array(0); // 1 where the point sits behind the text, drawn fainter
    let hx = new Float32Array(0); // home, in device px
    let hy = new Float32Array(0);
    let ox = new Float32Array(0); // offset from home
    let oy = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let aspect = 1.78;
    let dpr = 1;
    let pointer: { x: number; y: number } | null = null;
    let raf = 0;
    let running = false;

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
      const left = (W - pw) * 0.15;
      const top = (H - scale) * 0.5;
      // behind the text the points are drawn fainter, so every line stays readable
      const text = getComputedStyle(el).position === "absolute" ? host.querySelector(".about__body")?.getBoundingClientRect() : null;
      const me = el.getBoundingClientRect();
      for (let i = 0; i < n; i++) {
        const x = left + src.x[i] * pw;
        const y = top + src.y[i] * scale;
        hx[i] = Math.round(x * dpr);
        hy[i] = Math.round(y * dpr);
        quiet[i] =
          text && x > text.left - me.left - 32 && x < text.right - me.left + 32 && y > text.top - me.top - 24 && y < text.bottom - me.top + 24 ? 1 : 0;
      }
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, el.width, el.height);
      for (let q = 0; q < 2; q++) {
        ctx.globalAlpha = q ? 0.22 : 1;
        for (let b = 0; b < styles.length; b++) {
        ctx.fillStyle = styles[b];
        for (let i = 0; i < n; i++) {
          if (bucket[i] !== b || quiet[i] !== q) continue;
          const s = dpr > 1 ? size[i] + 1 : size[i];
          ctx.fillRect(Math.round(hx[i] + ox[i]), Math.round(hy[i] + oy[i]), s, s);
        }
        }
      }
      ctx.globalAlpha = 1;
    };

    const step = () => {
      const r = RADIUS * dpr;
      const push = PUSH * dpr;
      let moving = false;
      for (let i = 0; i < n; i++) {
        if (pointer) {
          const dx = hx[i] + ox[i] - pointer.x;
          const dy = hy[i] + oy[i] - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r * r) {
            const d = Math.sqrt(d2) || 1;
            const k = 1 - d / r;
            const f = k * k * (push / 4);
            vx[i] += (dx / d) * f;
            vy[i] += (dy / d) * f;
          }
        }
        vx[i] = (vx[i] - ox[i] * SPRING) * DAMP;
        vy[i] = (vy[i] - oy[i] * SPRING) * DAMP;
        ox[i] += vx[i];
        oy[i] += vy[i];
        if (Math.abs(ox[i]) > 0.3 || Math.abs(oy[i]) > 0.3 || Math.abs(vx[i]) > 0.05) moving = true;
      }
      draw();
      if (moving || pointer) raf = requestAnimationFrame(step);
      else running = false;
    };

    const wake = () => {
      if (still || running) return;
      running = true;
      raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointer = { x: (e.clientX - rect.left) * dpr, y: (e.clientY - rect.top) * dpr };
      wake();
    };
    const onLeave = () => {
      pointer = null;
      wake();
    };

    fetch(asset("/scene/sealink-points.json"))
      .then((r) => r.json())
      .then((d: { aspect: number; scale: number; points: number[] }) => {
        aspect = d.aspect;
        n = d.points.length / 4;
        src = { x: new Float32Array(n), y: new Float32Array(n) };
        bucket = new Uint8Array(n);
        size = new Uint8Array(n);
        quiet = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
          const b = d.points[i * 4 + 2];
          src.x[i] = d.points[i * 4] / d.scale;
          src.y[i] = d.points[i * 4 + 1] / d.scale;
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
      })
      .catch(() => {});

    const ro = new ResizeObserver(() => layout());
    ro.observe(el);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvas} className="sealink" role="img" aria-label={label} />;
}
