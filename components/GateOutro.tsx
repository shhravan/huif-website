"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Torana from "./Torana";
import { ScenePlate } from "./Scene";
import { mountGateWalk } from "@/lib/walk";
import { site, closing, CONTACT_EMAIL } from "@/content/site";

gsap.registerPlugin(useGSAP);

/**
 * The close: the gate standing still to the right of the words (on tall screens, small under them),
 * on the same sky and paving as the opening (lib/walk.ts at rest).
 */
export default function GateOutro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      // the gate simply stands to the right of the words, as on the first screen: no pin, no walk
      const { walk, dispose } = mountGateWalk(el, { offset: 0.25, size: window.innerHeight > window.innerWidth ? 0.3 : 0.56 });
      walk.render(0);
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
