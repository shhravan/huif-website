import { questions, programme } from "@/content/site";

/** Find a panel's central question in the Schedule, so the words live in one place. */
function questionFor(title: string): string | undefined {
  for (const day of programme.days)
    for (const slot of day.slots)
      if (slot.kind === "panels") for (const p of slot.rooms) if (p.title === title && "question" in p) return p.question;
  return undefined;
}

/** The questions give the Forum its identity (see BRIEF.md): five of them, set as a ledger. */
export default function Questions() {
  return (
    <section className="questions" aria-labelledby="questions-title">
      <div className="frame">
        <header className="questions__head">
          <h2 id="questions-title">{questions.heading}</h2>
          <p>{questions.intro}</p>
        </header>
        <ol className="questions__list">
          {questions.items.map((q) => (
            <li key={q.panel} className="questions__item" data-reveal>
              <p className="questions__q">{questionFor(q.panel)}</p>
              <p className="questions__meta">
                {q.panel}
                <br />
                {q.when}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
