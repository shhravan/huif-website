"use client";

import { useState } from "react";
import { panels, programme, type Slot } from "@/content/site";

/** "13:30" → "1:30 pm" */
function clock(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`; // a clock, not index numbering
}

type Entry = { title: string; question?: string; day: string; date: string; time: string; room: number };

/** Every Panel, read straight from the Schedule, with where and when it happens. */
const entries = programme.days.map((day) => ({
  day,
  items: (day.slots as readonly Slot[]).flatMap((s): Entry[] =>
    s.kind === "panels"
      ? s.rooms.map((p, i) => ({
          title: p.title,
          question: "question" in p ? p.question : undefined,
          day: day.label,
          date: day.date,
          time: `${clock(s.start)}–${clock(s.end)}`,
          room: i + 1,
        }))
      : [],
  ),
}));

function Detail({ e, title = true }: { e: Entry; title?: boolean }) {
  return (
    <>
      <p className="panel-card__when">
        {e.day} · {e.date} · {e.time} · Room {e.room}
      </p>
      {title && <p className="panel-card__title">{e.title}</p>}
      {e.question && <p className="panel-card__question">{e.question}</p>}
    </>
  );
}

/**
 * All sixteen panels as one large list:
 * select a title to see its central question, day, time and room. On wide screens the details sit in a
 * card beside the list; on phones they open under the selected title.
 */
export default function Panels() {
  const first = entries[0].items.find((e) => e.question) ?? entries[0].items[0];
  const [active, setActive] = useState(first.title);
  const current = entries.flatMap((d) => d.items).find((e) => e.title === active) ?? first;

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
        <div className="panels__grid">
          <aside className="panel-card" aria-live="polite">
            <Detail e={current} />
          </aside>
          <div className="panels__days">
            {entries.map(({ day, items }) => (
              <div key={day.id} className="panels__day">
                <p className="panels__label">
                  {day.label} · {day.date}
                </p>
                <ul className="panels__list">
                  {items.map((e) => (
                    <li key={e.title}>
                      <button
                        type="button"
                        className="panels__item"
                        aria-pressed={e.title === active}
                        onClick={() => setActive(e.title)}
                        onMouseEnter={() => setActive(e.title)}
                        onFocus={() => setActive(e.title)}
                      >
                        {e.title}
                      </button>
                      {e.title === active && (
                        <div className="panels__inline">
                          <Detail e={e} title={false} />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
