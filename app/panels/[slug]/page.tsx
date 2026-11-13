import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Picture from "@/components/Picture";
import { lineup, panelPage, panels, site } from "@/content/site";
import { allPanels, panelHref, panelsOf, photoOf } from "@/lib/panels";
import { navHref } from "@/lib/asset";

export const dynamicParams = false;
export const generateStaticParams = () => allPanels.map((p) => ({ slug: p.slug }));

const find = async (params: Promise<{ slug: string }>) => {
  const { slug } = await params;
  return allPanels.find((p) => p.slug === slug);
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await find(params);
  if (!p) return {};
  return {
    title: `${p.title}, ${site.name}`,
    description: p.question ?? `${p.title}: a panel at the ${site.name}, ${p.date} 2027, Mumbai.`,
  };
}

/** One Panel's own page: its question first, when and where it meets, then its speakers once the line-up is announced. */
export default async function PanelPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await find(params);
  if (!p) notFound();
  const others = panelsOf(p.strand).filter((o) => o.slug !== p.slug);
  const speakers = lineup.announced ? (p.speakers ?? []) : [];

  return (
    <>
      <SiteHeader variant="bar" home={false} />
      <main className="page">
        <div className="frame">
          <p className="page__back">
            <a href={navHref("#panels", false)}>{panelPage.back}</a>
          </p>
          <div className="panel-page__top">
            <div className="panel-page__text">
              <h1 className="head">{p.title}</h1>
              <p className="panel-page__question">{p.question ?? panels.noQuestion}</p>
              <dl className="panel-page__facts">
                <div>
                  <dt>{panelPage.when}</dt>
                  <dd>
                    {p.day}, {p.date}
                    <br />
                    {p.time}
                  </dd>
                </div>
                <div>
                  <dt>{panelPage.where}</dt>
                  <dd>
                    Room {p.room}
                    <br />
                    {panelPage.venue}
                  </dd>
                </div>
                <div>
                  <dt>Strand</dt>
                  <dd>{p.strand.name}</dd>
                </div>
              </dl>
            </div>
            <Picture photo={photoOf(p.strand)} sizes="(max-width: 900px) 100vw, 40vw" className="panel-page__photo" priority />
          </div>

          {p.intro && <p className="panel-page__intro">{p.intro}</p>}
        </div>

        <section className="panel-page__speakers" aria-labelledby="speakers-title">
          <div className="frame">
            <h2 id="speakers-title" className="panel-page__label">
              {panelPage.speakers}
            </h2>
            {speakers.length ? (
              <ul className="speakers">
                {speakers.map((s) => (
                  <li key={s.name}>
                    <p className="speakers__name">{s.name}</p>
                    <p className="speakers__role">
                      {s.moderator ? `${panelPage.moderator}, ` : ""}
                      {s.role}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <p className="panel-page__pending">{panelPage.pending}</p>
                <p className="panel-page__pending-note">
                  {panelPage.pendingDate}{" "}
                  <a href={site.instagram.href} rel="noopener">
                    {panelPage.follow}
                  </a>
                </p>
              </>
            )}
          </div>
        </section>

        <section className="frame panel-page__more" aria-labelledby="more-title">
          <h2 id="more-title" className="panel-page__label">
            {panelPage.more(p.strand.name)}
          </h2>
          <ul>
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={panelHref(o.slug)}>
                  <span className="panel-page__other">{o.title}</span>
                  <span className="panel-page__other-meta">
                    {o.day}, {o.time}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter home={false} />
    </>
  );
}
