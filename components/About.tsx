import Picture from "./Picture";
import { about, photos } from "@/content/site";

/** Why the Forum exists: the Theme in a picture of many people, the team's words, the facts, and Mumbai. */
export default function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="frame">
        <h2 id="about-title" className="about__title" data-reveal>
          {about.heading}
        </h2>
        <div className="about__split">
          <figure className="about__picture" data-reveal="picture">
            <Picture photo={photos.carts} sizes="(max-width: 900px) 100vw, 56vw" />
          </figure>
          <div className="about__text" data-reveal style={{ ["--i" as string]: 1 }}>
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
        <dl className="about__facts">
          {about.facts.map((f, i) => (
            <div key={f.label} className="about__fact" data-reveal style={{ ["--i" as string]: i }}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
        <div className="city">
          {[photos.harbour, photos.municipal, photos.balconies].map((p, i) => (
            <figure key={p.name} className={`city__item city__item--${i + 1}`} data-reveal="picture" style={{ ["--i" as string]: i }}>
              <Picture photo={p} sizes={i === 0 ? "(max-width: 900px) 100vw, 58vw" : "(max-width: 900px) 100vw, 30vw"} />
              <figcaption>{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
