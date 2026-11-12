import { about } from "@/content/site";

/** The response: what the Forum is and who convenes it, with the confirmed facts. */
export default function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="frame">
        <div className="about__grid">
          <h2 id="about-title" className="about__title head" data-reveal>
            {about.heading}
          </h2>
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
      </div>
    </section>
  );
}
