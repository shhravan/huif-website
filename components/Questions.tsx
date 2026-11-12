import Picture from "./Picture";
import { questions, programme, photos } from "@/content/site";

/** Find a panel's central question in the Schedule, so the words live in one place. */
function questionFor(title: string): string | undefined {
  for (const day of programme.days)
    for (const slot of day.slots)
      if (slot.kind === "panels") for (const p of slot.rooms) if (p.title === title && "question" in p) return p.question;
  return undefined;
}

/** The questions give the Forum its identity (see BRIEF.md): five of them, set large, before the timetable. */
export default function Questions() {
  return (
    <section className="questions" aria-labelledby="questions-title">
      <div className="frame">
        <header className="questions__head">
          <h2 id="questions-title">
            {questions.heading}
          </h2>
          <p className="questions__intro" data-reveal style={{ ["--i" as string]: 1 }}>
            {questions.intro}
          </p>
        </header>
        <div className="questions__grid">
        <figure className="questions__picture">
          <Picture photo={photos.coastalRoad} sizes="(max-width: 900px) 100vw, 40vw" />
          <figcaption>{photos.coastalRoad.caption}</figcaption>
        </figure>
        <div className="questions__body">
          <ol className="questions__list">
            {questions.items.map((q) => (
              <li key={q.panel} data-reveal>
                <p className="questions__q">{questionFor(q.panel)}</p>
                <p className="questions__meta">
                  {q.panel} · {q.when}
                </p>
              </li>
            ))}
          </ol>
        </div>
        </div>
      </div>
    </section>
  );
}
