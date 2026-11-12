import Picture from "./Picture";
import { about, photos } from "@/content/site";

/** The response: what the Forum is, beside one of Mumbai's civic buildings seen through an arch. */
export default function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="frame about__grid">
        <figure className="about__picture" data-reveal style={{ ["--i" as string]: 0 }}>
          <Picture photo={photos.taj} sizes="(max-width: 900px) 100vw, 42vw" />
        </figure>
        <div className="about__body">
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
