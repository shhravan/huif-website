import Picture from "./Picture";
import { site, closing, photos, CONTACT_EMAIL } from "@/content/site";

/** The invitation (the narrative brief's last layer): Mumbai at dusk, the closing line, the address. */
export default function Invitation() {
  return (
    <section id="contact" className="invitation" aria-labelledby="invitation-title">
      <Picture photo={photos.dusk} sizes="100vw" className="invitation__photo" />
      <div className="frame invitation__text">
        <h2 id="invitation-title" className="head" data-reveal>
          {closing.heading}
        </h2>
        <div className="invitation__row" data-reveal style={{ ["--i" as string]: 1 }}>
          {CONTACT_EMAIL ? (
            <>
              <a className="button" href={site.contact.href}>
                {closing.action}
              </a>
              <p>
                {closing.line} · {CONTACT_EMAIL}
              </p>
            </>
          ) : (
            <p>{closing.pending}</p>
          )}
        </div>
      </div>
    </section>
  );
}
