import { Close, p, strands, ways } from "./shared";

/** Ledger: a sticky heading beside rows. Each row reads across, label then detail. */
export default function Ledger() {
  return (
    <>
      <section className="frame pv-ledger" aria-labelledby="pv-proof">
        <h2 id="pv-proof" className="head pv-ledger__head">{p.proof.heading}</h2>
        <dl className="pv-ledger__rows">
          <div><dt>{p.proof.harvard.lead}</dt><dd>{p.proof.harvard.text}</dd></div>
          <div>
            <dt>{p.proof.strands.lead}</dt>
            <dd>
              <ul className="pv-ledger__strands">
                {strands.map((s) => <li key={s.id}><strong>{s.name}</strong> {s.line}</li>)}
              </ul>
              <span className="pv-muted">{p.proof.strands.text}</span>
            </dd>
          </div>
          <div><dt>{p.proof.speakers.lead}</dt><dd>{p.proof.speakers.text}</dd></div>
        </dl>
      </section>
      <section className="frame pv-ledger" aria-labelledby="pv-ways">
        <div className="pv-ledger__head">
          <h2 id="pv-ways" className="head">{p.ways.heading}</h2>
          <p className="pv-lead">{p.ways.lead}</p>
        </div>
        <dl className="pv-ledger__rows">
          {ways.map((w) => (
            <div key={w.lead}>
              <dt>{w.lead}</dt>
              <dd>{w.text}<span className="pv-muted"><strong>{p.ways.gets}:</strong> {w.gets}</span></dd>
            </div>
          ))}
        </dl>
      </section>
      <p className="frame pv-ledger__note pv-muted">{p.ways.note}</p>
      <Close className="pv-close--marine" />
    </>
  );
}
