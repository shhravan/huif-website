"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Torana from "./Torana";
import { ScenePlate, SceneGrades } from "./Scene";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const OPENING = "49.1% 62.8%";
const HORIZON = "50% 76%";

/**
 * End of the site: the gate comes back as if you are walking out backwards, in the
 * same morning light. You start inside the opening and the full gate settles into view,
 * with the "Become a Part" call to action in the sky above it.
 */
export default function GateOutro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q(".torana"), { transformOrigin: OPENING });
      gsap.set(q(".scene__back"), { transformOrigin: HORIZON });
      gsap.set(q(".torana__shade"), { opacity: 0 });
      gsap.set(q(".scene__plate--day"), { opacity: 1 });
      gsap.set(q(".scene__warm"), { opacity: 0.45 });
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=220%",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.fromTo(q(".torana"), { scale: 9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 0)
          .fromTo(q(".torana"), { filter: "blur(5px)" }, { filter: "blur(0px)", duration: 0.14 }, 0.02)
          .fromTo(q(".scene__back"), { scale: 1.28 }, { scale: 1, duration: 0.62, ease: "power1.out" }, 0)
          .fromTo(q(".outro__cta"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.6)
          .to({}, { duration: 0.15 });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q(".outro__cta"), { autoAlpha: 1 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="scene outro" id="join" aria-labelledby="outro-title">
      <ScenePlate />
      <div className="scene__gate">
        <Torana />
      </div>
      <SceneGrades />
      <div className="outro__cta">
        <h2 id="outro-title">Be part of the first Harvard forum in India</h2>
        <a className="button" href="#get-involved">
          Become a Part
          <span aria-hidden="true">→</span>
        </a>
      </div>
      <div className="grain" aria-hidden="true" />
    </section>
  );
}
