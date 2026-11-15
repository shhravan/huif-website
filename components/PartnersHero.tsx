"use client";

import { useRef } from "react";
import SeaLink from "./SeaLink";
import { partners, site } from "@/content/site";

export const partnersMail = `${site.contact.href}?type=partnering`;

/** The top of the Partners page: the same Sea Link in points as the About section, the invitation in the sea beside it. */
export default function PartnersHero({ action = true }: { action?: boolean }) {
  const body = useRef<HTMLDivElement>(null);
  return (
    <section className="about partners__hero" aria-labelledby="partners-title">
      <SeaLink label="The Bandra–Worli Sea Link in Mumbai at night, drawn in points of light" text={body} />
      <div className="frame about__grid">
        <div ref={body} className="about__body">
          <h1 id="partners-title" className="head">
            {partners.title}
          </h1>
          <p className="partners__lead">{partners.lead}</p>
          {action && (
            <a className="button button--light" href={partnersMail}>
              {partners.close.action}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
