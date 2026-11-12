import { context } from "@/content/site";

/** The context: why a single story about India is not enough (the narrative brief's first layer). */
export default function Context() {
  return (
    <section className="context" aria-labelledby="context-title">
      <div className="frame">
        <h2 id="context-title" className="context__title display" data-reveal>
          {context.heading}
        </h2>
        <div className="context__text">
          <div data-reveal style={{ ["--i" as string]: 1 }}>
            {context.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
