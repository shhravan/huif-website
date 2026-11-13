import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Picture from "@/components/Picture";
import { CONTACT_EMAIL, partners, photos, site } from "@/content/site";

export const metadata: Metadata = {
  title: `Partners · ${site.name}`,
  description: partners.lead,
};

type Item = { lead: string; text: string };

function List({ items }: { items: readonly Item[] }) {
  return (
    <ul className="partners__list">
      {items.map((i) => (
        <li key={i.lead}>
          <h3>{i.lead}</h3>
          <p>{i.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** For organisations thinking of supporting the Forum: who is in the room, what partners receive, how to start. */
export default function PartnersPage() {
  const mail = CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(partners.close.subject)}` : site.contact.href;
  return (
    <>
      <SiteHeader variant="bar" home={false} />
      <main className="page partners">
        <div className="frame partners__top">
          <div>
            <h1 className="display">{partners.title}</h1>
            <p className="partners__lead">{partners.lead}</p>
            <a className="button" href={mail}>
              {partners.close.action}
            </a>
          </div>
          <Picture photo={photos.taj} sizes="(max-width: 900px) 100vw, 40vw" className="partners__photo" priority />
        </div>

        <section className="frame partners__section" aria-labelledby="audience">
          <h2 id="audience" className="head">
            {partners.audience.heading}
          </h2>
          <div>
            <List items={partners.audience.items} />
            <p className="partners__note">{partners.audience.note}</p>
          </div>
        </section>

        <section className="partners__offer" aria-labelledby="offer">
          <div className="frame partners__section">
            <h2 id="offer" className="head">
              {partners.offer.heading}
            </h2>
            <List items={partners.offer.items} />
          </div>
        </section>

        <section className="frame partners__section" aria-labelledby="ways">
          <h2 id="ways" className="head">
            {partners.ways.heading}
          </h2>
          <div>
            <List items={partners.ways.items} />
            <p className="partners__note">{partners.ways.note}</p>
          </div>
        </section>

        <section className="partners__close" aria-labelledby="close">
          <div className="frame">
            <h2 id="close" className="head">
              {partners.close.heading}
            </h2>
            <p>{partners.close.line}</p>
            <a className="button" href={mail}>
              {partners.close.action}
            </a>
          </div>
        </section>
      </main>
      <SiteFooter home={false} />
    </>
  );
}
