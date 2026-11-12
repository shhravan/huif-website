import { context } from "@/content/site";

/**
 * The context, on stone. Its heading appears at the end of the walk through the gate (GateIntro),
 * so this section carries on from it: the paragraph, then the two reasons, each under its own heading.
 */
export default function Context() {
  return (
    <section className="context" aria-labelledby="context-title">
      <div className="frame context__inner">
        <p className="context__lead" data-reveal>
          {context.lead} <span>{context.rest}</span>
        </p>
        <div className="context__reasons">
          {context.reasons.map((r, i) => (
            <div key={r.lead} data-reveal style={{ ["--i" as string]: i + 1 }}>
              <h3>{r.lead}</h3>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
