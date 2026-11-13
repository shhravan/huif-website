"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Picture from "./Picture";
import { panelPage, panels, photos, strands } from "@/content/site";
import { allPanels, panelHref, panelsOf, photoOf } from "@/lib/panels";

/**
 * The sixteen Panels in four strands. On wide screens a picture box stays beside the list as it scrolls and shows the
 * question of the panel being read (the one at the middle of the screen, or the one under the pointer or focus),
 * over its strand's photograph. On phones each strand opens with its photograph instead. Every title links to the
 * panel's own page.
 */
export default function Panels() {
  const [active, setActive] = useState(allPanels.find((p) => p.question)?.slug ?? allPanels[0].slug);
  const list = useRef<HTMLDivElement>(null);
  const current = allPanels.find((p) => p.slug === active)!;

  // the panel crossing the middle of the screen becomes the one in the box
  useEffect(() => {
    const items = list.current?.querySelectorAll<HTMLElement>("[data-slug]");
    if (!items) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.getAttribute("data-slug")!);
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="panels" className="panels" aria-labelledby="panels-title">
      <div className="frame">
        <header className="panels__head">
          <h2 id="panels-title" className="head" data-reveal>
            {panels.heading}
          </h2>
        </header>

        <div className="panels__body">
          {/* the box that follows the list; decorative for screen readers, which get the same words on each panel's page */}
          <Link href={panelHref(current.slug)} className="panels__box" aria-hidden="true" tabIndex={-1}>
            {strands.map((s) => (
              <Picture
                key={s.id}
                photo={photos[s.photo]}
                sizes="40vw"
                className={`panels__photo panels__photo--${s.id}${s.id === current.strand.id ? " is-on" : ""}`}
              />
            ))}
            <div key={current.slug} className="panels__card">
              <p className="panels__strand">{current.strand.name}</p>
              <p className="panels__name">{current.title}</p>
              {current.question && <p className="panels__question">{current.question}</p>}
              <dl className="panels__facts">
                <div>
                  <dt>When</dt>
                  <dd>
                    {current.date}
                    <br />
                    {current.time}
                  </dd>
                </div>
                <div>
                  <dt>Where</dt>
                  <dd>
                    Room {current.room}
                    <br />
                    {panelPage.venue}
                  </dd>
                </div>
              </dl>
              <span className="panels__open">{panels.open}</span>
            </div>
          </Link>

          <div ref={list} className="panels__strands">
            {strands.map((s) => (
              <section key={s.id} className="strand" aria-labelledby={`strand-${s.id}`}>
                <Picture photo={photoOf(s)} sizes="100vw" className="strand__photo" />
                <h3 id={`strand-${s.id}`} className="strand__name">
                  {s.name}
                </h3>
                <p className="strand__line">{s.line}</p>
                <ul className="strand__panels">
                  {panelsOf(s).map((p) => (
                    <li key={p.slug} data-slug={p.slug}>
                      <Link
                        href={panelHref(p.slug)}
                        className={`strand__panel${p.slug === active ? " is-on" : ""}`}
                        onMouseEnter={() => setActive(p.slug)}
                        onFocus={() => setActive(p.slug)}
                      >
                        <span className="strand__title">{p.title}</span>
                        <span className="strand__meta">
                          {p.day}, {p.time}, Room {p.room}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
