"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Torana from "./Torana";
import { ScenePlate } from "./Scene";
import { GateWalk } from "@/lib/walk";
import { asset } from "@/lib/asset";
import { site, closing, CONTACT_EMAIL } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The close: the Sanchi gate again, centred, as if you step back out through it.
 * The same camera and ground as the opening (lib/walk.ts); "Get in touch" in the sky above.
 */
export default function GateOutro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(root);
      const [back] = q(".gate-scene__back") as HTMLElement[];
      const [canvas] = q(".gate-scene__ground") as HTMLCanvasElement[];
      const [gate] = q(".gate-scene__gate") as HTMLElement[];
      const small = window.matchMedia("(max-width: 860px)").matches;
      const walk = new GateWalk(el, back, canvas, gate, asset(small ? "/scene/paving-1024.webp" : "/scene/paving-2048.webp"), {
        offset: 0,
        size: 0.5,
      });
      // start close to the gate and step back from it as the section scrolls into view
      const state = { p: 0.55 };
      let ready = false;
      walk.load().then(() => {
        ready = true;
        walk.render(state.p);
      });
      const onResize = () => ready && walk.layout();
      window.addEventListener("resize", onResize);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(state, {
          p: 0.04,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: 1.2 },
          onUpdate: () => {
            if (ready) walk.render(state.p);
          },
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        state.p = 0.04;
        if (ready) walk.render(state.p);
      });

      return () => window.removeEventListener("resize", onResize);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contact" className="gate-scene outro" aria-labelledby="outro-title">
      <ScenePlate />
      <canvas className="gate-scene__ground" aria-hidden="true" />
      <div className="gate-scene__gate">
        <Torana />
      </div>
      <div className="frame outro__text">
        <h2 id="outro-title" className="head">
          {closing.heading}
        </h2>
        <p>{closing.line}</p>
        {CONTACT_EMAIL ? (
          <a className="button" href={site.contact.href}>
            {closing.action}
          </a>
        ) : (
          <p>{closing.pending}</p>
        )}
      </div>
    </section>
  );
}
