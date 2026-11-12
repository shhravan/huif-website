"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Torana from "./Torana";
import SiteHeader from "./SiteHeader";
import { ScenePlate } from "./Scene";
import { site, opening } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Centre of the walk-through opening in the gate image (see Torana.tsx).
const OPENING = "49.1% 62.8%";
// Horizon point of the landscape photo (see Scene.tsx).
const HORIZON = "50% 76%";

/**
 * The opening ("title card"). First screen: the real gate to the right, the forum's name and
 * one strong line lower left in cream over a gently darkened foreground, the full logo top left.
 * Scrolling (pinned): the title fades, the camera turns to the gate, walks through it, and on
 * the other side the sky softens into the site's paper where the forum's statement appears.
 * From then on a slim bar (logo, navigation, Register interest) stays at the top of the page.
 */
export default function GateIntro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const bar = document.querySelector(".site-header--bar");
      gsap.set(q(".torana"), { transformOrigin: OPENING });
      gsap.set(q(".scene__back"), { transformOrigin: HORIZON });

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
          portrait: "(orientation: portrait)",
        },
        (ctx) => {
          const { motion, portrait } = ctx.conditions as { motion: boolean; portrait: boolean };
          if (!motion) {
            gsap.set(q(".opening__cue"), { autoAlpha: 0 });
            if (bar) gsap.set(bar, { autoAlpha: 1 });
            return;
          }
          if (bar) gsap.set(bar, { autoAlpha: 0, yPercent: -100 });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=300%",
              scrub: 0.4,
              pin: true,
              anticipatePin: 1,
            },
          });

          tl.to(q(".opening__cue"), { autoAlpha: 0, duration: 0.05 }, 0)
            // 1→2: the title steps aside and the camera turns to face the gate.
            .to(q(".opening__title"), { autoAlpha: 0, y: 40, duration: 0.16, ease: "power1.in" }, 0)
            .to(q(".opening__scrim"), { opacity: 0, duration: 0.22 }, 0)
            .to(q(".scene__gate"), { left: "50%", duration: 0.24, ease: "power1.inOut" }, 0)
            // 2→4: approach and pass between the pillars.
            .to(q(".torana"), { scale: portrait ? 5 : 11, duration: 0.6, ease: "power2.in" }, 0.02)
            .to(q(".torana"), { autoAlpha: 0, duration: 0.08 }, 0.56)
            .to(q(".scene__back"), { scale: 1.28, duration: 0.62, ease: "power1.in" }, 0)
            // 5: the sky softens into the site's paper; the statement appears; the slim bar takes over.
            .to(q(".scene__back"), { yPercent: 18, duration: 0.2, ease: "power2.inOut" }, 0.58)
            .to(q(".opening__paper"), { opacity: 1, duration: 0.18 }, 0.6)
            .to(q(".site-header--photo"), { autoAlpha: 0, duration: 0.08 }, 0.6)
            .fromTo(q(".opening__statement"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.72)
            .to({}, { duration: 0.1 });
          if (bar) tl.to(bar, { autoAlpha: 1, yPercent: 0, duration: 0.08, ease: "power2.out" }, 0.7);
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="scene opening" aria-label={site.name}>
      <ScenePlate />
      <div className="scene__gate">
        <Torana />
      </div>
      <div className="opening__scrim" aria-hidden="true" />
      <div className="opening__paper" aria-hidden="true" />

      <SiteHeader variant="photo" />

      <div className="opening__title">
        <h1>
          Harvard Undergraduate
          <br />
          India Forum
        </h1>
        <p>{opening.line}</p>
      </div>
      <div className="opening__cue" aria-hidden="true">
        {opening.cue}
      </div>

      <div className="opening__statement">
        <p className="opening__statement-text">{opening.statement}</p>
      </div>
    </section>
  );
}
