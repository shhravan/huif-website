"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Torana from "./Torana";
import SiteHeader from "./SiteHeader";
import { ScenePlate } from "./Scene";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Centre of the walk-through opening in the gate image (see Torana.tsx).
const OPENING = "49.1% 62.8%";
// Horizon point of the landscape photo (see Scene.tsx).
const HORIZON = "50% 76%";

/**
 * Landing: the real torana at blue hour, just before sunrise. Scrolling (pinned,
 * ~3 screens) walks you through it as the sun comes up. On the other side
 * "Harvard Undergraduate" and "India Forum" slide in from opposite sides and meet.
 */
export default function GateIntro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q(".torana"), { transformOrigin: OPENING });
      gsap.set(q(".scene__back"), { transformOrigin: HORIZON });

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=320%",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.to(q(".scroll-hint"), { autoAlpha: 0, duration: 0.05 }, 0)
          // Walk up to and through the gate. The landscape behind moves much less (parallax).
          .to(q(".torana"), { scale: 9, duration: 0.6, ease: "power2.in" }, 0)
          .to(q(".torana"), { filter: "blur(5px)", duration: 0.1 }, 0.48)
          .to(q(".torana"), { autoAlpha: 0, duration: 0.08 }, 0.53)
          .to(q(".scene__back"), { scale: 1.28, duration: 0.62, ease: "power1.in" }, 0)
          .to(q(".site-header"), { color: "var(--marine)", duration: 0.15 }, 0.42)
          // Through the gate, the camera tilts up to the open sky where the name appears.
          .to(q(".scene__back"), { yPercent: 20, duration: 0.3, ease: "power2.inOut" }, 0.54)
          // Close the gap: the name arrives from both sides.
          .fromTo(q(".title__l"), { xPercent: -120, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.28, ease: "power3.out" }, 0.58)
          .fromTo(q(".title__r"), { xPercent: 120, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.28, ease: "power3.out" }, 0.58)
          .fromTo(q(".title__meta"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.8)
          .to({}, { duration: 0.06 });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q(".scroll-hint"), { autoAlpha: 0 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="scene intro" aria-label="Harvard Undergraduate India Forum">
      <ScenePlate />
      <div className="scene__gate">
        <Torana />
      </div>

      <SiteHeader />

      <div className="title">
        <h1 className="title__name">
          <span className="title__l">Harvard Undergraduate</span>
          <span className="title__r">India Forum</span>
        </h1>
        <p className="title__meta">
          <span>The first Harvard forum in India</span>
          <span className="title__dot" aria-hidden="true" />
          <span>13–14 March</span>
        </p>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <span>Scroll to enter</span>
        <span className="scroll-hint__line" />
      </div>
      <div className="grain" aria-hidden="true" />
    </section>
  );
}
