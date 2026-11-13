"use client";

import { useEffect, useRef, type RefObject } from "react";
import { asset } from "@/lib/asset";

/**
 * The Bandra–Worli Sea Link drawn in points across the whole About section, after haurlan.com.
 * The points were sampled once from the team's night photograph (public/scene/sealink-points.json:
 * x, y on a 0–scale grid, brightness 0–9, warm 0/1). Drawn at whole device pixels so they stay crisp.
 *
 * The bridge itself stays still. The one motion: slow, faint impulses of light run along it, one in every lane of
 * points, so in time they pass through the whole pattern without drawing the eye; each lights a short stretch
 * of one lane of points and travelling on.
 * Nothing moves under reduced motion; the loop pauses while the section is off screen.
 */

const LANE = 0.025; // width of each lane of points along the bridge, in picture heights; every lane carries an impulse
const TAIL = 0.2; // length of the lit trail behind an impulse's head, in picture heights
const SPEED = [0.035, 0.07]; // picture heights per second: slow, so the light seems to seep along
const SPACING = 0.55; // distance between impulses along one lane, in picture heights
const GLOW = 0.45; // brightness of an impulse's head, over the point's own

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
    // one impulse per lane: where its head starts, how fast it goes and which way (picked once per lane)
    let lane = new Uint16Array(0);
    let lanePhase = new Float32Array(0);
    let laneSpeed = new Float32Array(0);
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
      let wMin = Infinity;
      for (let i = 0; i < n; i++) wMin = Math.min(wMin, sw[i]);
      lane = new Uint16Array(n);
      let lanes = 0;
      for (let i = 0; i < n; i++) {
        lane[i] = Math.floor((sw[i] - wMin) / LANE);
        lanes = Math.max(lanes, lane[i] + 1);
      }
      lanePhase = new Float32Array(lanes);
      laneSpeed = new Float32Array(lanes);
      for (let L = 0; L < lanes; L++) {
        lanePhase[L] = Math.random() * SPACING;
        laneSpeed[L] =
          (SPEED[0] + Math.random() * (SPEED[1] - SPEED[0])) *
          (Math.random() < 0.5 ? -1 : 1);
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
      // the impulses: in every lane, the points just behind that lane's head, drawn again a little brighter
      if (!still && lane.length) {
        for (let i = 0; i < n; i++) {
          const L = lane[i];
          const v = laneSpeed[L];
          // how far this point is behind the nearest impulse ahead of it in its lane (heads every SPACING)
          const a = Math.sign(v) * (lanePhase[L] - su[i]) + Math.abs(v) * clock;
          const behind = ((a % SPACING) + SPACING) % SPACING;
          if (behind > TAIL) continue;
          const k = 1 - behind / TAIL;
          ctx.globalAlpha = GLOW * k * k * (quiet[i] ? 0.3 : 1);
          ctx.fillStyle =
            bucket[i] >= 3 ? "rgb(255, 214, 165)" : "rgb(255, 255, 255)";
          const sz = dpr > 1 ? size[i] + 1 : size[i];
          ctx.fillRect(Math.round(hx[i]), Math.round(hy[i]), sz, sz);
        }
      }
      ctx.globalAlpha = 1;
    };

    let prev = 0;
    let clock = 0; // seconds the impulses have run (only while on screen)
    const step = (t: number) => {
      clock += prev ? Math.min(0.05, (t - prev) / 1000) : 0;
      prev = t;
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
