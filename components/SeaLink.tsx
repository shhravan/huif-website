"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";

/**
 * The Bandra–Worli Sea Link drawn in points, after haurlan.com. The points were sampled once from
 * the team's night photograph of the bridge (public/scene/sealink-points.json: x, y, brightness,
 * warm, as 0–1000 integers). Each point drifts on a slow wave; the shape holds. Still under reduced
 * motion, paused when off screen.
 */
export default function SeaLink({ label }: { label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    let raf = 0;
    let visible = true;
    let points: number[] = [];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(el.clientWidth * dpr);
      el.height = Math.round(el.clientHeight * dpr);
    };

    const draw = (t: number) => {
      const W = el.width;
      const H = el.height;
      const dot = Math.max(1, Math.min(2.4, W / 560));
      ctx.clearRect(0, 0, W, H);
      const s = t / 1000;
      for (let i = 0; i < points.length; i += 4) {
        const x = points[i] / 1000;
        const y = points[i + 1] / 1000;
        // a long slow swell along the bridge, and a small shimmer per point
        const wave = Math.sin(s * 0.7 + x * 6 + y * 3) * 0.012 + Math.sin(s * 1.9 + i) * 0.002;
        const px = (x + Math.cos(s * 0.5 + y * 5) * 0.004) * W;
        const py = (y + wave) * H;
        const a = Math.min(1, 0.5 + points[i + 2] * 0.07);
        ctx.fillStyle = points[i + 3] ? `rgba(242, 184, 120, ${a})` : `rgba(240, 239, 235, ${a})`;
        ctx.fillRect(px, py, dot, dot);
      }
    };

    const loop = (t: number) => {
      if (visible) draw(t);
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(el);

    const onResize = () => {
      size();
      if (still) draw(0);
    };

    fetch(asset("/scene/sealink-points.json"))
      .then((r) => r.json())
      .then((d: { points: number[] }) => {
        points = d.points;
        size();
        if (still) draw(0);
        else raf = requestAnimationFrame(loop);
      })
      .catch(() => {});
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvas} className="sealink" role="img" aria-label={label} />;
}
