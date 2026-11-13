"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Torana from "./Torana";
import SiteHeader from "./SiteHeader";
import { ScenePlate } from "./Scene";
import { mountGateWalk } from "@/lib/walk";
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
          if (bar) gsap.set(bar, { autoAlpha: 0 });

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
            // the title steps aside as you turn towards the gate
            .to(q(".opening__title"), { autoAlpha: 0, y: 40, duration: 0.12, ease: "power1.in" }, 0)
            .to(q(".opening__scrim"), { autoAlpha: 0, duration: 0.18 }, 0)
            // as you pass between the pillars the sky softens into the page, and the story begins
            .to(q(".opening__paper"), { autoAlpha: 1, duration: 0.2, ease: "sine.inOut" }, 0.6)
            // the story's first words come only once the page colour has covered the sky (and go first on the way
            // back up), so dark type never sits on the bare sky
            .fromTo(q(".opening__story"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.14, ease: "sine.out" }, 0.8);
          // as the sky softens, the slim bar takes over from the opening's header, and hands back on the way up.
          // One switch on the scroll position itself (not the eased timeline), so one header is always showing.
          const photo = q(".site-header--photo");
          const show = (pastGate: boolean, instant = false) => {
            const v = { duration: instant ? 0 : 0.2, ease: "power1.out", overwrite: true };
            gsap.to(bar, { autoAlpha: pastGate ? 1 : 0, ...v });
            gsap.to(photo, { autoAlpha: pastGate ? 0 : 1, ...v });
          };
          const walkST = tl.scrollTrigger!;
          if (bar)
            ScrollTrigger.create({
              // 70% of the way through the walk, measured on the walk's own trigger (a trigger on the pinned
              // section itself would be placed after the whole pin)
              start: () => walkST.start + (walkST.end - walkST.start) * 0.7,
              end: "max",
              onEnter: () => show(true),
              onLeaveBack: () => show(false),
              onRefresh: (self) => show(self.scroll() >= self.start, true),
            });
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
