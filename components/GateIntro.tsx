"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Torana from "./Torana";
import SiteHeader from "./SiteHeader";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Centre of the walk-through opening in the gate image (see Torana.tsx).
const OPENING = "49.1% 68.3%";

/**
 * Landing: the real torana at night. Scrolling (pinned, ~3 screens) walks you through
 * it while dawn breaks. On the other side "Harvard Undergraduate" and "India Forum"
 * slide in from opposite sides and meet in the middle.
 */
export default function GateIntro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q(".intro .torana"), { transformOrigin: OPENING });

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
          // Approach and pass through the gate.
          .to(q(".torana"), { scale: 9, duration: 0.6, ease: "power2.in" }, 0)
          .to(q(".torana__shade"), { opacity: 0, duration: 0.45, ease: "power1.out" }, 0)
          .to(q(".torana"), { filter: "blur(6px)", duration: 0.12 }, 0.46)
          .to(q(".torana"), { autoAlpha: 0, duration: 0.08 }, 0.52)
          // The world moves past: ground drops away, the horizon glow grows.
          .to(q(".land"), { yPercent: 40, scale: 1.4, duration: 0.6, ease: "power2.in" }, 0)
          .to(q(".sky__sun"), { scale: 2.4, opacity: 1, duration: 0.6, ease: "power1.inOut" }, 0)
          .to(q(".sky__dawn"), { opacity: 1, duration: 0.5 }, 0.1)
          .to(q(".sky__stars"), { opacity: 0, duration: 0.3 }, 0.05)
          .to(q(".land"), { autoAlpha: 0, duration: 0.1 }, 0.5)
          .to(q(".sky__day"), { opacity: 1, duration: 0.25 }, 0.5)
          .to(q(".site-header"), { color: "var(--marine)", duration: 0.2 }, 0.5)
          // Close the gap: the name arrives from both sides.
          .fromTo(q(".title__l"), { xPercent: -120, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.28, ease: "power3.out" }, 0.58)
          .fromTo(q(".title__r"), { xPercent: 120, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.28, ease: "power3.out" }, 0.58)
          .fromTo(q(".title__meta"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.8)
          .to({}, { duration: 0.06 });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q(".scroll-hint"), { autoAlpha: 0 });
        gsap.set(q(".title__l, .title__r, .title__meta"), { autoAlpha: 1 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="intro" aria-label="Harvard Undergraduate India Forum">
      <div className="sky" aria-hidden="true">
        <div className="sky__stars" />
        <div className="sky__dawn" />
        <div className="sky__day" />
        <div className="sky__sun" />
      </div>
      <div className="land" aria-hidden="true">
        <div className="land__mist" />
      </div>

      <div className="intro__gate">
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
