import { Close, p, strands, ways } from "./shared";

/** Statement: one centred column, one idea per screen, the strands set as display type. */
export default function Statement() {
  return (
    <>
      <section className="pv-stmt" aria-labelledby="pv-proof">
        <div className="frame pv-stmt__col">
          <h2 id="pv-proof" className="pv-stmt__kicker">{p.proof.heading}</h2>
          <p className="head">{p.proof.harvard.text}</p>
        </div>
        <ul className="frame pv-stmt__strands" aria-label={p.proof.strands.lead}>
          {strands.map((s) => (
            <li key={s.id}><span className="display">{s.name}</span><span>{s.line}</span></li>
          ))}
        </ul>
        <div className="frame pv-stmt__col">
          <p className="pv-lead">{p.proof.strands.lead}. {p.proof.strands.text} {p.proof.speakers.text}</p>
        </div>
      </section>
      <section className="pv-stmt pv-stmt--marine" aria-labelledby="pv-ways">
        <div className="frame pv-stmt__col">
          <h2 id="pv-ways" className="head">{p.ways.heading}</h2>
          <p className="pv-lead">{p.ways.lead}</p>
        </div>
        <ul className="frame pv-stmt__ways">
          {ways.map((w) => (
            <li key={w.lead}>
              <h3 className="pv-title">{w.lead}</h3>
              <p>{w.text}</p>
              <p className="pv-muted">{w.gets}</p>
            </li>
          ))}
        </ul>
        <p className="frame pv-stmt__col pv-muted">{p.ways.note}</p>
      </section>
      <Close className="pv-close--centre" />
    </>
  );
}
