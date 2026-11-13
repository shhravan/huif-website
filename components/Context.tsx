import { context } from "@/content/site";

/**
 * The context, on stone. Its heading appears at the end of the walk through the gate (GateIntro),
 * with its first paragraph, so this section carries on with the two reasons, each under its own heading.
 */
export default function Context() {
  return (
    <section className="context" aria-labelledby="context-title">
      <div className="frame context__inner">
        <div className="context__reasons">
          {context.reasons.map((r) => (
            <div key={r.lead}>
              <h3>{r.lead}</h3>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
