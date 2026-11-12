"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Torana from "./Torana";
import SiteHeader from "./SiteHeader";
import { ScenePlate } from "./Scene";
import { GateWalk } from "@/lib/walk";
import Picture from "./Picture";
import { asset } from "@/lib/asset";
import { site, opening, photos } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The opening ("title card"). First screen: the real gate standing on the paving to the right;
 * the forum's name, the Theme, city and dates, and "See the programme" in the sky to the left.
 * Scrolling (pinned): the title fades, you turn towards the gate and walk through it, the ground
 * passing under you (lib/walk.ts), and India opens through the gate to the whole screen. From then on a slim bar (logo, navigation, Get in touch)
 * stays at the top of the page.
 */
export default function GateIntro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(root);
      const bar = document.querySelector(".site-header--bar");
      const [back] = q(".gate-scene__back") as HTMLElement[];
      const [canvas] = q(".gate-scene__ground") as HTMLCanvasElement[];
      const [gate] = q(".gate-scene__gate") as HTMLElement[];
      const [portal] = q(".gate-scene__india") as HTMLElement[];

      const small = window.matchMedia("(max-width: 860px)").matches;
      const walk = new GateWalk(el, back, canvas, gate, asset(small ? "/scene/paving-1024.webp" : "/scene/paving-2048.webp"), {
        offset: 0.27,
        size: 0.86,
        portal,
      });
      let ready = false;
      walk.load().then(() => {
        ready = true;
        ScrollTrigger.refresh();
      });
      const onResize = () => ready && walk.layout();
      window.addEventListener("resize", onResize);

      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { motion } = ctx.conditions as { motion: boolean };
          if (!motion) {
            if (bar) gsap.set(bar, { autoAlpha: 1 });
            walk.render(0);
            return;
          }
          if (bar) gsap.set(bar, { autoAlpha: 0, yPercent: -100 });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=260%",
              scrub: 1.2,
              pin: true,
              anticipatePin: 1,
            },
            onUpdate: () => walk.render(tl.progress()),
          });

          // the walk itself runs on the timeline's progress, from 0 to 1
          tl.to({}, { duration: 1 }, 0)
            // halfway through the gate the slim bar takes over
            .to(q(".site-header--photo"), { autoAlpha: 0, duration: 0.06 }, 0.82);

          // the title steps aside as you turn towards the gate; tied to the scroll directly, with no
          // smoothing lag, so it is back in full the moment you return to the top
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "+=30%", scrub: true } })
            .to(q(".opening__title"), { autoAlpha: 0, y: 40, ease: "power1.in" }, 0)
            .to(q(".opening__scrim"), { opacity: 0, ease: "none" }, 0);
          if (bar) tl.to(bar, { autoAlpha: 1, yPercent: 0, duration: 0.06, ease: "power2.out" }, 0.84);
        },
      );

      return () => window.removeEventListener("resize", onResize);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="gate-scene opening" aria-label={site.name}>
      <ScenePlate />
      <canvas className="gate-scene__ground" aria-hidden="true" />
      <div className="gate-scene__gate">
        <Torana />
      </div>
      <div className="gate-scene__india" aria-hidden="true">
        <Picture photo={photos.coastal} sizes="100vw" priority />
      </div>
      <div className="opening__scrim" aria-hidden="true" />

      <SiteHeader variant="photo" />

      <div className="opening__title">
        <h1 className="display">
          Harvard Undergraduate
          <br />
          India Forum
        </h1>
        <div className="opening__row">
          <p>{opening.line}</p>
          <a className="button button--light" href={opening.action.href}>
            {opening.action.label}
          </a>
        </div>
      </div>
    </section>
  );
}
