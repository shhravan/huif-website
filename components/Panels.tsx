"use client";

import { useState } from "react";
import { panels, programme, type Slot } from "@/content/site";

/** "13:30" → "1:30 pm" */
function clock(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`; // taste-skill-ignore: a clock, not index numbering
}

type Entry = { id: string; title: string; question?: string; when: string };

/** Every Panel, read straight from the Schedule. */
const entries: Entry[] = programme.days.flatMap((day) =>
  (day.slots as readonly Slot[]).flatMap((s): Entry[] =>
    s.kind === "panels"
      ? s.rooms.map((p, i) => ({
          id: `panel-${day.id}-${s.start.replace(":", "")}-${i + 1}`,
          title: p.title,
          question: "question" in p ? p.question : undefined,
          when: `${day.label}, ${day.date} · ${clock(s.start)} · Room ${i + 1}`,
        }))
      : [],
  ),
);

/**
 * The sixteen panels as one large typographic index, set in a slow stagger after the "hardest questions"
 * list on indiaconferenceharvard.com. Each title opens to show where and when it is, and its central
 * question where the team has published one. The calendar below carries the full timetable.
 */
export default function Panels() {
  const [open, setOpen] = useState<string | null>(entries.find((e) => e.question)?.id ?? null);

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
        <ul className="panels__index">
          {entries.map((e) => {
            const isOpen = open === e.id;
            return (
              <li key={e.id} className="panels__entry">
                <h3 className="panels__title">
                  <button type="button" aria-expanded={isOpen} aria-controls={e.id} onClick={() => setOpen(isOpen ? null : e.id)}>
                    {e.title}
                  </button>
                </h3>
                <div id={e.id} className="panels__more" hidden={!isOpen}>
                  <p className="panels__when">{e.when}</p>
                  {e.question && <p className="panels__question">{e.question}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
