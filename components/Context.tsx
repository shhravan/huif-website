import { context } from "@/content/site";

/** The context: the page's one centred moment, a statement on Marine (the narrative brief's first layer). */
export default function Context() {
  return (
    <section className="context" aria-labelledby="context-title">
      <div className="frame context__inner">
        <h2 id="context-title" className="display" data-reveal>
          {context.heading}
        </h2>
        <p className="context__lead" data-reveal style={{ ["--i" as string]: 1 }}>
          {context.paragraphs[0]}
        </p>
        <p className="context__close" data-reveal style={{ ["--i" as string]: 2 }}>
          {context.paragraphs[1]}
        </p>
      </div>
    </section>
  );
}
