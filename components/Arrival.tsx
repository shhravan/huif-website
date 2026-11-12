"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Picture from "./Picture";
import { arrival, photos } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Through the Sanchi gate and into Mumbai: the Gateway of India, full screen, with the Theme.
 * The photograph settles slowly as it scrolls past (the page's one moving picture).
 */
export default function Arrival() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".arrival__photo",
          { scale: 1.12, yPercent: -4 },
          {
            scale: 1,
            yPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="arrival" aria-labelledby="arrival-title">
      <div className="arrival__frame">
        <Picture photo={photos.gateway} sizes="100vw" className="arrival__photo" />
      </div>
      <div className="arrival__scrim" aria-hidden="true" />
      <div className="frame arrival__text">
        <h2 id="arrival-title" data-reveal>
          {arrival.statement}
        </h2>
        <p data-reveal style={{ ["--i" as string]: 1 }}>
          {arrival.line}
        </p>
      </div>
    </section>
  );
}
