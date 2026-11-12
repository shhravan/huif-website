"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { programme, type Slot } from "@/content/site";

/** "13:30" → "1:30 pm" */
function clock(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { text: `${h12}:${String(m).padStart(2, "0")}`, suffix }; // a clock, not index numbering
}

function range(start: string, end: string) {
  const a = clock(start);
  const b = clock(end);
  return a.suffix === b.suffix ? `${a.text}–${b.text} ${b.suffix}` : `${a.text} ${a.suffix}–${b.text} ${b.suffix}`;
}

/**
 * Three layouts of the same confirmed Schedule, chosen with ?programme=a|b|c while the team decides:
 * a: timetable, one day at a time, a time rail and the two rooms side by side (default)
 * b: agenda, one day at a time, one column read top to bottom, each panel with its room
 * c: both days side by side, the whole Programme on one screen
 */
type Layout = "a" | "b" | "c";

function SlotRow({ slot, layout }: { slot: Slot; layout: Layout }) {
  const time = (
    <p className="slot__time">
      <time dateTime={slot.start}>{range(slot.start, slot.end)}</time>
    </p>
  );
  if (slot.kind === "panels") {
    return (
      <li className="slot slot--panels">
        {time}
        {slot.rooms.map((p, i) => (
          <div key={p.title} className="slot__room">
            <h4 className="slot__title">{p.title}</h4>
            <p className="slot__where">Room {i + 1}</p>
          </div>
        ))}
      </li>
    );
  }
  return (
    <li className={`slot slot--${slot.kind}`}>
      {time}
      <div className="slot__room slot__room--wide">
        <h4 className="slot__title">{slot.title}</h4>
        {slot.kind === "keynote" && slot.detail && <p className="slot__detail">{slot.detail}</p>}
        {slot.kind === "break" && slot.rooms && <p className="slot__detail">{slot.rooms.join(" · ")}</p>}
      </div>
    </li>
  );
}

function DaySlots({ day, layout }: { day: (typeof programme.days)[number]; layout: Layout }) {
  return (
    <>
      {layout === "a" && (
        <div className="day__rooms" aria-hidden="true">
          <span />
          <p>Room 1</p>
          <p>Room 2</p>
        </div>
      )}
      <ol className="day__slots">
        {day.slots.map((s) => (
          <SlotRow key={s.start} slot={s} layout={layout} />
        ))}
      </ol>
    </>
  );
}

/** The confirmed Schedule, every slot in both rooms. */
export default function Programme() {
  const [layout, setLayout] = useState<Layout>("a");
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("programme");
    if (v === "b" || v === "c") setLayout(v);
  }, []);

  // WAI-ARIA tabs: arrow keys move between days and select them; Home and End jump to the ends
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = programme.days.length;
    const next = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const i = (next + n) % n;
    setActive(i);
    tabs.current[i]?.focus();
  };

  return (
    <section id="programme" className={`programme programme--${layout}`} aria-labelledby="programme-title">
      <div className="frame">
        <header className="programme__head">
          <h2 id="programme-title" className="head">
            {programme.heading}
          </h2>
          <p>{programme.intro}</p>
        </header>

        {layout === "c" ? (
          <div className="programme__both">
            {programme.days.map((day) => (
              <section key={day.id} className="day" aria-labelledby={`${day.id}-title`}>
                <h3 id={`${day.id}-title`} className="day__title">
                  {day.label} <span>{day.date}</span>
                </h3>
                <DaySlots day={day} layout={layout} />
              </section>
            ))}
          </div>
        ) : (
          <>
            <div className="tabs" role="tablist" aria-label="Day" onKeyDown={onKey}>
              {programme.days.map((day, i) => (
                <button
                  key={day.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${day.id}-tab`}
                  aria-selected={active === i}
                  aria-controls={`${day.id}-panel`}
                  tabIndex={active === i ? 0 : -1}
                  className="tabs__tab"
                  onClick={() => setActive(i)}
                >
                  <span className="tabs__label">{day.label}</span>
                  <span className="tabs__date">{day.date}</span>
                </button>
              ))}
            </div>
            {programme.days.map((day, i) => (
              <div
                key={day.id}
                role="tabpanel"
                id={`${day.id}-panel`}
                aria-labelledby={`${day.id}-tab`}
                hidden={active !== i}
                tabIndex={0}
                className="day"
              >
                <DaySlots day={day} layout={layout} />
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
