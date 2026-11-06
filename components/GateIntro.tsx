"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Gate from "./Gate";
import Backdrop from "./Backdrop";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Scroll-driven intro. The gate is the hero: it opens filling the screen with the
 * name framed in its opening. Scrolling (about three screens, pinned) walks you
 * through it — the gate scales up around its opening while the sky warms. On the
 * other side the gate reappears as a small logo mark above the title, then the pin
 * releases and the page scrolls normally.
 */
export default function GateIntro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Scale the gate around the centre of its walk-through opening (x 600, y 760 of 1200×1000).
      gsap.set(q(".gate"), { transformOrigin: "50% 76%" });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Only the big gate's layers, not the logo mark's.
        const layer = (names: string) =>
          q(names.split(",").map((n) => `.gate [data-layer="${n.trim()}"]`).join(","));

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=300%",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        });

        // 0 → 1 is the whole pinned scroll.
        tl.to(q(".scroll-hint"), { autoAlpha: 0, y: 20, duration: 0.08 }, 0)
          .to(q(".intro-name"), { autoAlpha: 0, scale: 1.25, duration: 0.18, ease: "power1.in" }, 0)
          // Walk through the gate: accelerate as we get close.
          .to(q(".gate"), { scale: 11, duration: 0.72, ease: "power2.in" }, 0)
          // Extra separation between parts so the layers feel like real depth.
          .to(layer("pillar-left"), { x: -60, duration: 0.72, ease: "power2.in" }, 0)
          .to(layer("pillar-right"), { x: 60, duration: 0.72, ease: "power2.in" }, 0)
          .to(layer("arch-top, finials"), { y: -50, duration: 0.72, ease: "power2.in" }, 0)
          .to(layer("arch-mid, struts-upper"), { y: -30, duration: 0.72, ease: "power2.in" }, 0)
          .to(q(".gate"), { autoAlpha: 0, duration: 0.12 }, 0.6)
          // Atmosphere moves with us.
          .to(q('[data-layer="ground"]'), { scale: 1.9, svgOrigin: "600 900", duration: 0.85, ease: "power1.inOut" }, 0)
          .to(q('[data-layer="sun"]'), { scale: 2.2, svgOrigin: "600 820", duration: 0.85, ease: "power1.inOut" }, 0)
          .to(q(".stage__dawn"), { opacity: 1, duration: 0.6 }, 0.3)
          // Night ground warms to sunlit sandstone (and blends into the page below).
          .fromTo(
            root.current,
            { "--ground": "#3b2a2f", "--path": "#574047" },
            { "--ground": "#ead3b4", "--path": "#d9b38c", duration: 0.5 },
            0.35,
          )
          // Other side: the gate settles back in as the logo mark, then the title.
          .fromTo(
            q(".hero__mark"),
            { autoAlpha: 0, scale: 1.8 },
            { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power2.out" },
            0.6,
          )
          .fromTo(
            q(".hero__text"),
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.15, ease: "power2.out" },
            0.72,
          )
          .to({}, { duration: 0.05 }); // short hold at the end before unpinning
      });

      // No motion: show the arrival state (logo mark + title) as a static hero.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q(".scroll-hint, .intro-name, .gate"), { autoAlpha: 0 });
        gsap.set(q(".hero__mark, .hero__text, .stage__dawn"), { autoAlpha: 1 });
        gsap.set(root.current, { "--ground": "#ead3b4", "--path": "#d9b38c" });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="stage" aria-label="Welcome">
      <div className="stage__dawn" aria-hidden="true" />
      <div className="scene">
        <Backdrop className="backdrop" />
        <Gate className="gate" />
        {/* The name, framed in the gate's opening at the start. */}
        <p className="intro-name" aria-hidden="true">
          HUIF
        </p>
      </div>

      <div className="hero">
        <Gate className="hero__mark" decorative />
        <div className="hero__text">
          <h1 className="hero__title">HUIF</h1>
          <p className="hero__tagline">Placeholder tagline goes here</p>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <span>Scroll to enter</span>
        <span className="scroll-hint__line" />
      </div>
    </section>
  );
}
