"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { programme, type Slot } from "@/content/site";

/** "13:30" → { text: "1:30", suffix: "pm" } */
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
const minutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

type Day = (typeof programme.days)[number];

/** One block in the grid: a slot, or one room's half of a slot. */
type Block = { key: string; slot: Slot; column: 1 | 2 | "both"; title: string; detail?: string; room?: number };

/** Lay a day's slots out as blocks: panels and room-specific breaks per room, keynotes and plain breaks across both. */
function blocksFor(slots: readonly Slot[]): Block[] {
  return slots.flatMap((s): Block[] => {
    if (s.kind === "panels") return s.rooms.map((p, i) => ({ key: p.title, slot: s, column: i === 0 ? 1 : 2, title: p.title, room: i + 1 }));
    if (s.kind === "break" && s.rooms)
      return s.rooms.map((r, i) => ({ key: `${s.start}-${i}`, slot: s, column: i === 0 ? 1 : 2, title: s.title, detail: r, room: i + 1 }));
    return [{ key: s.start, slot: s, column: "both", title: s.title, detail: s.kind === "keynote" ? s.detail : undefined }];
  });
}

/** A calendar grid: the day's hours down the side, each block placed and sized by its real times. */
function Calendar({ day }: { day: Day }) {
  const slots: readonly Slot[] = day.slots;
  const start = Math.floor(minutes(slots[0].start) / 60) * 60;
  const end = Math.ceil(minutes(slots[slots.length - 1].end) / 30) * 30;
  const hours: number[] = [];
  for (let m = start; m < end; m += 60) hours.push(m);
  const row = (t: string) => (minutes(t) - start) / 15 + 1; // one grid row per quarter hour

  return (
    <div className="cal" style={{ ["--rows" as string]: (end - start) / 15 }}>
      <div className="cal__head" aria-hidden="true">
        <span />
        <p>Room 1</p>
        <p>Room 2</p>
      </div>
      <div className="cal__grid">
        {hours.map((m) => {
          const c = clock(`${m / 60}:00`);
          return (
            <p key={m} className="cal__hour" style={{ gridRow: (m - start) / 15 + 1 }} aria-hidden="true">
              {c.text.replace(":00", "")} {c.suffix}
            </p>
          );
        })}
        <ol className="cal__slots">
          {blocksFor(slots).map((b) => (
            <li
              key={b.key}
              className={`cal__block cal__block--${b.slot.kind}`}
              style={{ gridRowStart: row(b.slot.start), gridRowEnd: row(b.slot.end), gridColumn: b.column === "both" ? "1 / -1" : b.column }}
            >
              <p className="cal__time">
                <time dateTime={b.slot.start}>{range(b.slot.start, b.slot.end)}</time>
                {b.room && <span className="sr-only">, Room {b.room}</span>}
              </p>
              <h4>{b.title}</h4>
              {b.detail && <p className="cal__detail">{b.detail}</p>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** The confirmed Schedule as a calendar, one day at a time. */
export default function Programme() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

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
    <section id="programme" className="programme" aria-labelledby="programme-title">
      <div className="frame">
        <header className="programme__head">
          <h2 id="programme-title" className="head">
            {programme.heading}
          </h2>
        </header>
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
          <div key={day.id} role="tabpanel" id={`${day.id}-panel`} aria-labelledby={`${day.id}-tab`} hidden={active !== i} tabIndex={0}>
            <Calendar day={day} />
          </div>
        ))}
      </div>
    </section>
  );
}
