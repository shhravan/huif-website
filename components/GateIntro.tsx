"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Torana from "./Torana";
import SiteHeader from "./SiteHeader";
import { ScenePlate } from "./Scene";
import { mountGateWalk } from "@/lib/walk";
import { sceneAt } from "@/lib/opening";
import { site, opening, context, ids } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The opening ("title card"). First screen: the real gate standing on the paving to the right;
 * the forum's name, the Theme, city and dates, and "See the programme" in the sky to the left.
 * Scrolling (pinned): the title fades, you turn towards the gate and walk through it, the ground
 * passing under you (lib/walk.ts); between the pillars the sky softens into the page and the story begins. From then on a slim bar (logo, navigation, Get in touch)
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
      const { walk, loaded, dispose } = mountGateWalk(el, { offset: 0.27, size: 0.86 });
      loaded.then(() => ScrollTrigger.refresh());

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
          // the adapter: scroll progress in, the Opening script's scene (lib/opening.ts) out onto the page
          const [title, scrim, paper, story] = [".opening__title", ".opening__scrim", ".opening__paper", ".opening__story"].map((s) => q(s)[0]);
          const photo = q(".site-header--photo")[0];
          let header: "photo" | "bar" | null = null;
          const apply = (p: number) => {
            const s = sceneAt(p);
            walk.render(p);
            gsap.set(title, { autoAlpha: s.title.opacity, y: s.title.y });
            gsap.set(scrim, { autoAlpha: s.scrim });
            gsap.set(paper, { autoAlpha: s.paper });
            gsap.set(story, { autoAlpha: s.story.opacity, y: s.story.y });
            if (s.header !== header) {
              // one header at a time: a short crossfade, or none on the first frame
              const v = { duration: header ? 0.2 : 0, ease: "power1.out", overwrite: true };
              header = s.header;
              if (bar) gsap.to(bar, { autoAlpha: header === "bar" ? 1 : 0, ...v });
              gsap.to(photo, { autoAlpha: header === "bar" ? 0 : 1, ...v });
            }
          };
          apply(0);
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top top", end: "+=260%", scrub: 1.2, pin: true, anticipatePin: 1 },
            onUpdate: () => apply(tl.progress()),
          });
          tl.to({}, { duration: 1 });
          return () => {
            header = null;
          };
        },
      );

      return dispose;
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
      <div className="opening__scrim" aria-hidden="true" />
      <div className="opening__paper" aria-hidden="true" />
      <SiteHeader variant="photo" />

      <div id="content" tabIndex={-1} className="opening__title">
        <h1 className="display">
          Harvard Undergraduate
          <br />
          India Forum
        </h1>
        <p className="opening__line">{opening.line}</p>
        <dl className="opening__facts">
          {opening.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
        <a className="button button--light" href={opening.action.href}>
          {opening.action.label}
        </a>
      </div>

      {/* after the title in reading order (it appears only once the title has gone): the Context section's title and first paragraph, centred on the page as it settles */}
      <div className="frame opening__story">
        <h2 id={ids.contextTitle} className="display">
          {context.heading}
        </h2>
        <p className="context__lead">
          {context.lead} <span>{context.rest}</span>
        </p>
      </div>
    </section>
  );
}
