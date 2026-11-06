"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Torana from "./Torana";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const OPENING = "49.1% 68.3%";

/**
 * End of the site: the gate comes back as if you are walking out backwards.
 * You start inside the opening and the full gate settles into view at dusk,
 * with the "Become a Part" call to action framed beneath it.
 */
export default function GateOutro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q(".torana"), { transformOrigin: OPENING });
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
          .fromTo(q(".torana"), { filter: "blur(6px)" }, { filter: "blur(0px)", duration: 0.15 }, 0)
          .fromTo(q(".land"), { yPercent: 40, scale: 1.4, autoAlpha: 0 }, { yPercent: 0, scale: 1, autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 0)
          // Dawn on the way in, dusk on the way out.
          .fromTo(q(".sky__day"), { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0.05)
          .fromTo(q(".sky__dawn"), { opacity: 1 }, { opacity: 0.85, duration: 0.6 }, 0.2)
          .fromTo(q(".torana__shade"), { opacity: 0 }, { opacity: 0.28, duration: 0.5 }, 0.2)
          .fromTo(q(".outro__cta"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.62)
          .to({}, { duration: 0.15 });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q(".sky__day"), { opacity: 0 });
        gsap.set(q(".sky__dawn"), { opacity: 0.85 });
        gsap.set(q(".outro__cta"), { autoAlpha: 1 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="outro" id="get-involved" aria-labelledby="outro-title">
      <div className="sky" aria-hidden="true">
        <div className="sky__dawn" />
        <div className="sky__day" />
        <div className="sky__sun sky__sun--low" />
      </div>
      <div className="land" aria-hidden="true">
        <div className="land__mist" />
      </div>
      <div className="outro__gate">
        <Torana />
      </div>
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
