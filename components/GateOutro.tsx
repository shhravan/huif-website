"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Torana from "./Torana";
import { ScenePlate } from "./Scene";
import { site, closing, CONTACT_EMAIL } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const OPENING = "49.1% 62.8%";
const HORIZON = "50% 76%";

/**
 * End of the site: the gate comes back as if you are walking out backwards, in the
 * same daylight. You start inside the opening and the full gate settles into view,
 * with "Get in touch" in the sky above it.
 */
export default function GateOutro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q(".torana"), { transformOrigin: OPENING });
      gsap.set(q(".gate-scene__back"), { transformOrigin: HORIZON });
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=140%",
            scrub: 0.4,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.fromTo(q(".torana"), { scale: 3.2 }, { scale: 1, duration: 0.6, ease: "power2.out" }, 0)
          .fromTo(q(".gate-scene__back"), { scale: 1.28 }, { scale: 1, duration: 0.62, ease: "power1.out" }, 0)
          .fromTo(q(".outro__cta"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.4)
          .to({}, { duration: 0.15 });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q(".outro__cta"), { autoAlpha: 1 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="gate-scene outro" id="contact" aria-labelledby="outro-title">
      <ScenePlate />
      <div className="gate-scene__gate">
        <Torana />
      </div>
      <div className="outro__cta">
        <h2 id="outro-title">{closing.heading}</h2>
        <p className="outro__line">{closing.line}</p>
        {CONTACT_EMAIL ? (
          <a className="button" href={site.contact.href}>
            {CONTACT_EMAIL}
          </a>
        ) : (
          <p className="outro__note">{closing.pending}</p>
        )}
      </div>
    </section>
  );
}
