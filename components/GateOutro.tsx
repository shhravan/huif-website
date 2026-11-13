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
      const [back] = q(".gate-scene__back") as HTMLElement[];
      const [canvas] = q(".gate-scene__ground") as HTMLCanvasElement[];
      const [gate] = q(".gate-scene__gate") as HTMLElement[];
      const small = window.matchMedia("(max-width: 860px)").matches;
      // the opening's walk, run backwards: wide screens end with the gate right of the words; tall screens, small under them
      const walk = new GateWalk(el, back, canvas, gate, asset(small ? "/scene/paving-1024.webp" : "/scene/paving-2048.webp"), {
        offset: 0.25,
        size: window.innerHeight > window.innerWidth ? 0.3 : 0.56,
      });
      const state = { p: 0 };
      let ready = false;
      walk.load().then(() => {
        ready = true;
        walk.render(state.p);
        ScrollTrigger.refresh();
      });
      const onResize = () => ready && walk.layout();
      window.addEventListener("resize", onResize);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // held on screen: you start inside the gate's opening and walk backwards out of it, turning away
        // until it stands to one side; only then do the words appear, so nothing ever sits on the moving gate
        state.p = 0.88; // the pillars just inside the edges of the screen
        if (ready) walk.render(state.p);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=200%", scrub: 0.8, pin: true, anticipatePin: 1 },
          onUpdate: () => {
            if (ready) walk.render(state.p);
          },
        });
        tl.to(state, { p: 0, duration: 0.78 }, 0)
          .fromTo(q(".outro__text"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.8)
          .to({}, { duration: 0.06 });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        state.p = 0;
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
