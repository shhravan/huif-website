"use client";

import { useRef } from "react";
import SeaLink from "./SeaLink";
import { about } from "@/content/site";

/** The response: what the Forum is, over the Sea Link drawn in points across the whole section. */
export default function About() {
  const body = useRef<HTMLDivElement>(null);
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <SeaLink label="The Bandra–Worli Sea Link in Mumbai at night, drawn in points of light" text={body} />
      <div className="frame about__grid">
        <div ref={body} className="about__body">
          <h2 id="about-title" className="head" data-reveal>
            {about.heading}
          </h2>
          <div className="about__text" data-reveal style={{ ["--i" as string]: 1 }}>
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <p className="about__mumbai" data-reveal style={{ ["--i" as string]: 2 }}>
            {about.mumbai}
          </p>
        </div>
      </div>
    </section>
  );
}
