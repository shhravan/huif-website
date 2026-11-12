import { context } from "@/content/site";

/**
 * The context heading appears through the animated gate, or here when motion is disabled.
 */
export default function Context() {
  return (
    <section className="context" aria-labelledby="context-title">
      <div className="frame context__inner">
        <h2 id="context-title" className="display context__heading">{context.heading}</h2>
        <p className="context__lead" data-reveal>
          {context.lead} <span>{context.rest}</span>
        </p>
        <div className="context__reasons">
          {context.reasons.map((r, i) => (
            <p key={r.lead} data-reveal style={{ ["--i" as string]: i + 1 }}>
              <strong>{r.lead}</strong> {r.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
