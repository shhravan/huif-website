import { Close, p, strands, ways } from "./shared";

/** Brief: a facts band, then a comparison table. Everything fits on two screens. */
export default function Brief() {
  return (
    <>
      <section className="frame pv-brief" aria-labelledby="pv-proof">
        <h2 id="pv-proof" className="pv-title">{p.proof.heading}</h2>
        <div className="pv-brief__band">
          <div><h3>{p.proof.harvard.lead}</h3><p>{p.proof.harvard.text}</p></div>
          <div>
            <h3>{p.proof.strands.lead}</h3>
            <p>{strands.map((s) => s.name).join(", ")}. {p.proof.strands.text}</p>
          </div>
          <div><h3>{p.proof.speakers.lead}</h3><p>{p.proof.speakers.text}</p></div>
        </div>
      </section>
      <section className="frame pv-brief" aria-labelledby="pv-ways">
        <h2 id="pv-ways" className="pv-title">{p.ways.heading}</h2>
        <p className="pv-lead">{p.ways.lead}</p>
        <table className="pv-brief__table">
          <thead><tr><th scope="col">Way</th><th scope="col">What it makes possible</th><th scope="col">{p.ways.gets}</th></tr></thead>
          <tbody>
            {ways.map((w) => (
              <tr key={w.lead}><th scope="row">{w.lead}</th><td>{w.text}</td><td>{w.gets}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="pv-muted">{p.ways.note}</p>
      </section>
      <Close className="pv-close--marine" />
    </>
  );
}
