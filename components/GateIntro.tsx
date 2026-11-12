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
 * The opening ("title card"). First screen: the real gate to the right; the forum's name, the Theme,
 * city and dates, and "See the programme" in the sky to the left; the full logo top left.
 * Scrolling (pinned): the title fades, the camera turns to the gate, walks through it, and on
 * the other side the page scrolls on into Mumbai (Arrival).
 * From then on a slim bar (logo, navigation, Get in touch) stays at the top of the page.
 */
export default function GateIntro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const bar = document.querySelector(".site-header--bar");
      gsap.set(q(".torana"), { transformOrigin: OPENING });
      gsap.set(q(".gate-scene__back"), { transformOrigin: HORIZON });

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
            if (bar) gsap.set(bar, { autoAlpha: 1 });
            return;
          }
          if (bar) gsap.set(bar, { autoAlpha: 0, yPercent: -100 });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=150%",
              scrub: 0.4,
              pin: true,
              anticipatePin: 1,
            },
          });

          // 1→2: the title steps aside and the camera turns to face the gate.
          tl.to(q(".opening__title"), { autoAlpha: 0, y: 40, duration: 0.16, ease: "power1.in" }, 0)
            .to(q(".opening__scrim"), { opacity: 0, duration: 0.22 }, 0)
            .to(q(".gate-scene__gate"), { left: "50%", duration: 0.24, ease: "power1.inOut" }, 0)
            // 2→4: approach and pass between the pillars.
            .to(q(".torana"), { scale: portrait ? 5 : 11, duration: 0.6, ease: "power2.in" }, 0.02)
            .to(q(".torana"), { autoAlpha: 0, duration: 0.08 }, 0.56)
            .to(q(".gate-scene__back"), { scale: 1.28, duration: 0.62, ease: "power1.in" }, 0)
            // 5: through the gate; the slim bar takes over and the page scrolls on into Mumbai (Arrival).
            .to(q(".site-header--photo"), { autoAlpha: 0, duration: 0.08 }, 0.56);
          if (bar) tl.to(bar, { autoAlpha: 1, yPercent: 0, duration: 0.08, ease: "power2.out" }, 0.56);
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="gate-scene opening" aria-label={site.name}>
      <ScenePlate />
      <div className="gate-scene__gate">
        <Torana />
      </div>
      <div className="opening__scrim" aria-hidden="true" />

      <SiteHeader variant="photo" />

      <div className="opening__title">
        <h1>
          Harvard Undergraduate
          <br />
          India Forum
        </h1>
        <p>{opening.line}</p>
        <a className="button button--light" href={opening.action.href}>
          {opening.action.label}
        </a>
      </div>
    </section>
  );
}
