"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scrolling (Lenis) driven by GSAP's ticker, so the scroll position and the
 * scroll-linked animations update on the same frame. Off for reduced motion.
 *
 * Arriving from another page at /#about (or #panels, #programme): the browser jumps to the section before the
 * opening Gate adds its scroll length, so the section then slides down out of view. Until the visitor scrolls
 * or presses a key, each time ScrollTrigger re-measures the page we jump back to the section.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    const jump = () => window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 80);
    const stop = () => {
      ScrollTrigger.removeEventListener("refresh", jump);
      for (const t of ["wheel", "touchstart", "keydown"]) window.removeEventListener(t, stop);
    };
    ScrollTrigger.addEventListener("refresh", jump);
    for (const t of ["wheel", "touchstart", "keydown"]) window.addEventListener(t, stop, { passive: true });
    jump();
    const done = window.setTimeout(stop, 6000);
    return () => {
      window.clearTimeout(done);
      stop();
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, anchors: { offset: -80 } });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}
