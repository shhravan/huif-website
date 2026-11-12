"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Picture from "./Picture";
import { photos } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Through the Sanchi gate and into Mumbai: the Gateway of India, full screen, on its own.
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
          { scale: 1.08 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="arrival" aria-label="Mumbai">
      <div className="arrival__frame">
        <Picture photo={photos.gateway} sizes="100vw" className="arrival__photo" />
      </div>
    </section>
  );
}
