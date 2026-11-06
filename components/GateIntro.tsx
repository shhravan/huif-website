"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Gate from "./Gate";
import Sanctuary from "./Sanctuary";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Scroll-driven intro: the stage is pinned while you scroll about three screens,
 * and the gate scales up around its opening so you pass through it. Behind it,
 * the stupa approaches more slowly (parallax), the sky warms, and the hero text
 * fades in. Then the pin releases and the page scrolls normally.
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
          // Walk through the gate: accelerate as we get close.
          .to(q(".gate"), { scale: 11, duration: 0.72, ease: "power2.in" }, 0)
          // Extra separation between parts so the layers feel like real depth.
          .to(q('[data-layer="pillar-left"]'), { x: -60, duration: 0.72, ease: "power2.in" }, 0)
          .to(q('[data-layer="pillar-right"]'), { x: 60, duration: 0.72, ease: "power2.in" }, 0)
          .to(q('[data-layer="arch-top"], [data-layer="finials"]'), { y: -50, duration: 0.72, ease: "power2.in" }, 0)
          .to(q('[data-layer="arch-mid"], [data-layer="struts-upper"]'), { y: -30, duration: 0.72, ease: "power2.in" }, 0)
          .to(q(".gate"), { autoAlpha: 0, duration: 0.12 }, 0.6)
          // The stupa comes closer, more slowly than the gate.
          .to(q('[data-layer="stupa"]'), { scale: 2.6, svgOrigin: "600 880", duration: 0.85, ease: "power1.inOut" }, 0)
          .to(q('[data-layer="ground"]'), { scale: 1.9, svgOrigin: "600 900", duration: 0.85, ease: "power1.inOut" }, 0)
          .to(q('[data-layer="sun"]'), { scale: 2.2, svgOrigin: "600 800", duration: 0.85, ease: "power1.inOut" }, 0)
          .to(q(".stage__dawn"), { opacity: 1, duration: 0.6 }, 0.3)
          // Night ground warms to sunlit sandstone (and blends into the page below).
          .fromTo(
            root.current,
            { "--ground": "#3b2a2f", "--path": "#574047" },
            { "--ground": "#ead3b4", "--path": "#d9b38c", duration: 0.5 },
            0.35,
          )
          // Arrive: lift the scene slightly and bring in the title.
          .to(q(".sanctuary"), { yPercent: -16, duration: 0.25, ease: "power2.out" }, 0.7)
          .fromTo(
            q(".hero"),
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" },
            0.75,
          )
          .to({}, { duration: 0.05 }); // short hold at the end before unpinning
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q(".hero"), { autoAlpha: 1 });
        gsap.set(q(".scroll-hint"), { autoAlpha: 0 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="stage" aria-label="Welcome">
      <div className="stage__dawn" aria-hidden="true" />
      <div className="scene">
        <Sanctuary className="sanctuary" />
        <Gate className="gate" />
      </div>

      <div className="hero">
        <h1 className="hero__title">HUIF</h1>
        <p className="hero__tagline">Placeholder tagline goes here</p>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <span>Scroll to enter</span>
        <span className="scroll-hint__line" />
      </div>
    </section>
  );
}
