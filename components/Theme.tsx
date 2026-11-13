import { theme } from "@/content/site";

/** The Theme: what each half of the Theme means. */
export default function Theme() {
  return (
    <section id="theme" className="theme" aria-labelledby="theme-title">
      <div className="frame">
        <h2 id="theme-title" className="display theme__title" data-reveal>
          {theme.heading}
        </h2>
        <div className="theme__parts">
          {theme.parts.map((p, i) => (
            <p key={p.lead} data-reveal style={{ ["--i" as string]: i + 1 }}>
              <strong>{p.lead}</strong> {p.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
