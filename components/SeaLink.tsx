"use client";

import { useEffect, useRef, type RefObject } from "react";
import { asset } from "@/lib/asset";

/**
 * The Bandra–Worli Sea Link drawn in points across the whole About section.
 * The points were sampled once from the team's night photograph (public/scene/sealink-points.json:
 * x, y on a 0–scale grid, brightness 0–9, warm 0/1). Drawn at whole device pixels so they stay crisp.
 *
 * The bridge itself stays still. The one motion: impulses of light run along it, each lighting a short stretch
 * of one lane of points and travelling on.
 * Nothing moves under reduced motion; the loop pauses while the section is off screen.
 */

const IMPULSES = 7; // running at once
const LANE = 0.02; // half-width of the lane of points an impulse lights, in picture heights
const TAIL = 0.22; // length of the lit trail behind each impulse's head, in picture heights

/** `text`: the words laid over the bridge; points behind them are drawn faint. */
export default function SeaLink({
  label,
  text,
}: {
  label: string;
  text: RefObject<HTMLElement | null>;
}) {
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
    let aspect = 1.78;
    let dpr = 1;
    // impulses run along the bridge's own axis (its main direction, found from the points): su is a point's place
    // along the bridge, sw its place across it, both in picture heights
    let su = new Float32Array(0);
    let sw = new Float32Array(0);
    let uMin = 0;
    let uMax = 1;
    const impulses = Array.from({ length: IMPULSES }, () => ({
      x: 0,
      y: 0,
      v: 0,
    }));
    const launch = (
      imp: { x: number; y: number; v: number },
      anywhere: boolean,
    ) => {
      const i = Math.floor(Math.random() * n);
      imp.y = sw[i]; // the lane of a random point, so impulses follow the deck, the cables and the lights
      imp.v = (0.25 + Math.random() * 0.35) * (Math.random() < 0.5 ? -1 : 1); // picture heights per second
      const span = uMax - uMin;
      imp.x = anywhere
        ? uMin + Math.random() * span
        : imp.v > 0
          ? uMin - TAIL - Math.random() * span * 0.4
          : uMax + TAIL + Math.random() * span * 0.4;
    };
    const axis = () => {
      let mx = 0,
        my = 0;
      for (let i = 0; i < n; i++) {
        mx += sx[i] * aspect;
        my += sy[i];
      }
      mx /= n;
      my /= n;
      let xx = 0,
        xy = 0,
        yy = 0;
      for (let i = 0; i < n; i++) {
        const a = sx[i] * aspect - mx,
          b = sy[i] - my;
        xx += a * a;
        xy += a * b;
        yy += b * b;
      }
      const t = 0.5 * Math.atan2(2 * xy, xx - yy); // the main direction
      const c = Math.cos(t),
        sn = Math.sin(t);
      su = new Float32Array(n);
      sw = new Float32Array(n);
      uMin = Infinity;
      uMax = -Infinity;
      for (let i = 0; i < n; i++) {
        const a = sx[i] * aspect - mx,
          b = sy[i] - my;
        su[i] = a * c + b * sn;
        sw[i] = -a * sn + b * c;
        uMin = Math.min(uMin, su[i]);
        uMax = Math.max(uMax, su[i]);
      }
    };
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
      const words =
        getComputedStyle(el).position === "absolute"
          ? text.current?.getBoundingClientRect()
          : null;
      const me = el.getBoundingClientRect();
      for (let i = 0; i < n; i++) {
        const x = left + sx[i] * pw;
        const y = top + sy[i] * scale;
        hx[i] = x * dpr;
        hy[i] = y * dpr;
        quiet[i] =
          words &&
          x > words.left - me.left - 32 &&
          x < words.right - me.left + 32 &&
          y > words.top - me.top - 24 &&
          y < words.bottom - me.top + 24
            ? 1
            : 0;
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
            const sz = dpr > 1 ? size[i] + 1 : size[i];
            ctx.fillRect(Math.round(hx[i]), Math.round(hy[i]), sz, sz);
          }
        }
      }
      // the impulses: points on an impulse's row, just behind its head, drawn again brighter, fading along the trail
      if (!still) {
        for (const imp of impulses) {
          if (!imp.v) continue; // not launched yet
          const dir = Math.sign(imp.v);
          for (let i = 0; i < n; i++) {
            const off = Math.abs(sw[i] - imp.y);
            if (off > LANE) continue;
            const behind = (imp.x - su[i]) * dir; // 0 at the head, growing along the trail
            if (behind < 0 || behind > TAIL) continue;
            const k = 1 - behind / TAIL;
            ctx.globalAlpha = k * (1 - off / LANE) * (quiet[i] ? 0.3 : 1);
            ctx.fillStyle =
              bucket[i] >= 3 ? "rgb(255, 214, 165)" : "rgb(255, 255, 255)";
            const sz = (dpr > 1 ? size[i] + 1 : size[i]) + (k > 0.85 ? 2 : 1); // the head a little larger
            ctx.fillRect(Math.round(hx[i]), Math.round(hy[i]), sz, sz);
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    let prev = 0;
    const step = (t: number) => {
      const dt = prev ? Math.min(0.05, (t - prev) / 1000) : 0;
      prev = t;
      for (const imp of impulses) {
        imp.x += imp.v * dt;
        const span = uMax - uMin;
        if (
          imp.x < uMin - TAIL - span * 0.5 ||
          imp.x > uMax + TAIL + span * 0.5
        )
          launch(imp, false);
      }
    };

    const loop = (t: number) => {
      if (visible) {
        step(t);
        draw();
      }
      raf = requestAnimationFrame(loop);
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
          bucket[i] =
            (d.points[i * 4 + 3] ? 3 : 0) + (b >= 8 ? 2 : b >= 6 ? 1 : 0);
          size[i] = b >= 8 ? 2 : 1;
        }
        hx = new Float32Array(n);
        hy = new Float32Array(n);
        axis();
        for (const imp of impulses) launch(imp, true);
        layout();
        if (!still) {
          io.observe(el);
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
    };
  }, [text]);

  return (
    <canvas ref={canvas} className="sealink" role="img" aria-label={label} />
  );
}
