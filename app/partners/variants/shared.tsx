import { partners, strands } from "@/content/site";
import { partnersMail } from "@/components/PartnersHero";

export const p = partners;
export const ways = partners.ways.items;
export { strands, partnersMail };

/** The one call to action on the page. */
export function Close({ className = "" }: { className?: string }) {
  return (
    <section className={`pv-close ${className}`} aria-labelledby="pv-close">
      <div className="frame">
        <h2 id="pv-close" className="head">{partners.close.heading}</h2>
        <p>{partners.close.line}</p>
        <a className="button button--light" href={partnersMail}>Get in touch</a>
      </div>
    </section>
  );
}
