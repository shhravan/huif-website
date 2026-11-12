import { panels, programme } from "@/content/site";

/** Every Panel title, read straight from the Schedule, grouped by day. */
export default function Panels() {
  return (
    <section id="panels" className="panels" aria-labelledby="panels-title">
      <div className="frame">
        <header className="panels__head">
          <h2 id="panels-title" className="head" data-reveal>
            {panels.heading}
          </h2>
          <p data-reveal style={{ ["--i" as string]: 1 }}>
            {panels.intro}
          </p>
        </header>
        {programme.days.map((day) => (
          <div key={day.id} className="panels__day">
            <p className="panels__label">
              {day.label} · {day.date}
            </p>
            <ul className="panels__list">
              {day.slots.flatMap((s) =>
                s.kind === "panels"
                  ? s.rooms.map((p) => (
                      <li key={p.title} data-reveal>
                        {p.title}
                      </li>
                    ))
                  : [],
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
