import { context } from "@/content/site";

/**
 * The context, on Marine. Its heading is seen through the gate at the end of the walk (GateIntro),
 * so this section carries on from it with the paragraph.
 */
export default function Context() {
  return (
    <section className="context" aria-labelledby="context-title">
      <div className="frame context__inner">
        <p className="context__lead" data-reveal>
          {context.lead} <span>{context.rest}</span>
        </p>
      </div>
    </section>
  );
}
