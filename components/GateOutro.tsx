"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Torana from "./Torana";
import { ScenePlate } from "./Scene";
import { mountGateWalk } from "@/lib/walk";
import { site, closing, CONTACT_EMAIL } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The close: the opening's walk in reverse. Held on screen, you start inside the gate and walk backwards out of it
 * (the same camera and ground, lib/walk.ts) until it stands to the right; then the words appear beside it in the sky.
 * On tall screens the gate ends small, under the words.
 */
export default function GateOutro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(root);
      // the opening's walk, run backwards: wide screens end with the gate right of the words; tall screens, small under them
      const { walk, loaded, dispose } = mountGateWalk(el, { offset: 0.25, size: window.innerHeight > window.innerWidth ? 0.3 : 0.56 });
      loaded.then(() => ScrollTrigger.refresh());
      const state = { p: 0 };

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // held on screen: you start inside the gate's opening and walk backwards out of it, turning away
        // until it stands to one side; only then do the words appear, so nothing ever sits on the moving gate
        state.p = 0.88; // the pillars just inside the edges of the screen
        walk.render(state.p);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=130%", scrub: 1.2, pin: true, anticipatePin: 1 },
          onUpdate: () => {
            walk.render(state.p);
          },
        });
        tl.to(state, { p: 0, duration: 0.78, ease: "sine.inOut" }, 0)
          .fromTo(q(".outro__text"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.2, ease: "sine.out" }, 0.76)
          .to({}, { duration: 0.06 });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        state.p = 0;
        walk.render(state.p);
      });

      return dispose;
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
