"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { programme, type Slot } from "@/content/site";
import VariantPicker, { type VariantGroup } from "./VariantPicker";

/** "13:30" → "1:30 pm" */
function clock(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { text: `${h12}:${String(m).padStart(2, "0")}`, suffix }; // taste-skill-ignore: a clock, not index numbering
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

/**
 * Five structures for the same confirmed Schedule, while the team chooses (?__variant=…):
 * timetable: a time rail and the two rooms side by side, one day at a time (default)
 * calendar:  a calendar grid, each slot as tall as it is long, rooms as columns
 * agenda:    one column read top to bottom, each panel labelled with its room
 * overview:  both days side by side, the whole Programme on one screen
 * editorial: a printed programme, the hour set large beside each slot
 */
const VARIANTS = ["timetable", "calendar", "agenda", "overview", "editorial"] as const;
type Variant = (typeof VARIANTS)[number];
const GROUPS: VariantGroup[] = [
  {
    heading: "Structure",
    items: [
      { id: "timetable", label: "Timetable" },
      { id: "calendar", label: "Calendar grid" },
      { id: "agenda", label: "Agenda" },
      { id: "overview", label: "Both days" },
      { id: "editorial", label: "Editorial" },
    ],
  },
];

function Time({ slot }: { slot: Slot }) {
  return (
    <p className="slot__time">
      <time dateTime={slot.start}>{range(slot.start, slot.end)}</time>
    </p>
  );
}

/** One slot as a row: used by the timetable, agenda and overview structures. */
function SlotRow({ slot }: { slot: Slot }) {
  if (slot.kind === "panels") {
    return (
      <li className="slot slot--panels">
        <Time slot={slot} />
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
      <Time slot={slot} />
      <div className="slot__room slot__room--wide">
        <h4 className="slot__title">{slot.title}</h4>
        {slot.kind === "keynote" && slot.detail && <p className="slot__detail">{slot.detail}</p>}
        {slot.kind === "break" && slot.rooms && <p className="slot__detail">{slot.rooms.join(" · ")}</p>}
      </div>
    </li>
  );
}

function Rows({ day, rooms }: { day: Day; rooms: boolean }) {
  return (
    <>
      {rooms && (
        <div className="day__rooms" aria-hidden="true">
          <span />
          <p>Room 1</p>
          <p>Room 2</p>
        </div>
      )}
      <ol className="day__slots">
        {day.slots.map((s) => (
          <SlotRow key={s.start} slot={s} />
        ))}
      </ol>
    </>
  );
}

/** A calendar grid: the day's hours down the side, each slot placed and sized by its real times. */
function Calendar({ day }: { day: Day }) {
  const slots: readonly Slot[] = day.slots;
  const start = Math.floor(minutes(day.slots[0].start) / 60) * 60;
  const end = Math.ceil(minutes(day.slots[day.slots.length - 1].end) / 60) * 60;
  const hours = [];
  for (let m = start; m <= end; m += 60) hours.push(m);
  const row = (t: string) => (minutes(t) - start) / 15 + 1; // one grid row per quarter hour
  return (
    <div className="cal" style={{ ["--rows" as string]: (end - start) / 15 }}>
      <div className="cal__head" aria-hidden="true">
        <span />
        <p>Room 1</p>
        <p>Room 2</p>
      </div>
      <div className="cal__grid">
        {hours.map((m) => (
          <p key={m} className="cal__hour" style={{ gridRow: (m - start) / 15 + 1 }} aria-hidden="true">
            {clock(`${Math.floor(m / 60)}:00`).text.replace(":00", "")} {clock(`${Math.floor(m / 60)}:00`).suffix}
          </p>
        ))}
        <ol className="cal__slots">
          {slots.flatMap((s) => {
            const rows = { gridRowStart: row(s.start), gridRowEnd: row(s.end) };
            if (s.kind === "panels")
              return s.rooms.map((p, i) => (
                <li key={p.title} className="cal__block" style={{ ...rows, gridColumn: i + 1 }}>
                  <p className="cal__time">
                    <time dateTime={s.start}>{range(s.start, s.end)}</time>
                    <span className="sr-only">, Room {i + 1}</span>
                  </p>
                  <h4>{p.title}</h4>
                </li>
              ));
            return [
              <li key={s.start} className={`cal__block cal__block--${s.kind}`} style={{ ...rows, gridColumn: "1 / -1" }}>
                <p className="cal__time">
                  <time dateTime={s.start}>{range(s.start, s.end)}</time>
                </p>
                <h4>
                  {s.title}
                  {s.kind === "keynote" && s.detail ? <span> · {s.detail}</span> : null}
                  {s.kind === "break" && s.rooms ? <span> · {s.rooms.join(" · ")}</span> : null}
                </h4>
              </li>,
            ];
          })}
        </ol>
      </div>
    </div>
  );
}

/** A printed programme: the hour large, the slot beside it. */
function Editorial({ day }: { day: Day }) {
  const slots: readonly Slot[] = day.slots;
  return (
    <ol className="ed">
      {slots.map((s) => {
        const c = clock(s.start);
        return (
          <li key={s.start} className={`ed__slot ed__slot--${s.kind}`}>
            <p className="ed__hour">
              <time dateTime={s.start}>
                {c.text}
                <span>{c.suffix}</span>
              </time>
            </p>
            <div className="ed__body">
              {s.kind === "panels" ? (
                s.rooms.map((p, i) => (
                  <div key={p.title} className="ed__panel">
                    <h4>{p.title}</h4>
                    <p>
                      Room {i + 1} · until {range(s.start, s.end).split("–")[1]}
                    </p>
                  </div>
                ))
              ) : (
                <div className="ed__panel">
                  <h4>{s.title}</h4>
                  <p>
                    {s.kind === "keynote" && s.detail ? `${s.detail} · ` : ""}
                    {s.kind === "break" && s.rooms ? `${s.rooms.join(" · ")} · ` : ""}
                    until {range(s.start, s.end).split("–")[1]}
                  </p>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** The confirmed Schedule, every slot in both rooms. */
export default function Programme() {
  const [variant, setVariant] = useState<Variant>("timetable");
  const [picking, setPicking] = useState(false);
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const read = () => {
      const params = new URLSearchParams(window.location.search);
      const v = params.get("__variant");
      setPicking(v !== null);
      if (v && (VARIANTS as readonly string[]).includes(v)) setVariant(v as Variant);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const choose = (v: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("__variant", v);
    window.history.replaceState(null, "", url);
    setVariant(v as Variant);
  };

  // WAI-ARIA tabs: arrow keys move between days and select them; Home and End jump to the ends
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = programme.days.length;
    const next = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    e.stopPropagation();
    const i = (next + n) % n;
    setActive(i);
    tabs.current[i]?.focus();
  };

  const body = (day: Day) =>
    variant === "calendar" ? <Calendar day={day} /> : variant === "editorial" ? <Editorial day={day} /> : <Rows day={day} rooms={variant === "timetable"} />;

  return (
    <section id="programme" className={`programme programme--${variant}`} aria-labelledby="programme-title">
      {picking && <VariantPicker groups={GROUPS} active={variant} onChoose={choose} />}
      <div className="frame">
        <header className="programme__head">
          <h2 id="programme-title" className="head">
            {programme.heading}
          </h2>
          <p>{programme.intro}</p>
        </header>

        {variant === "overview" ? (
          <div className="programme__both">
            {programme.days.map((day) => (
              <section key={day.id} className="day" aria-labelledby={`${day.id}-title`}>
                <h3 id={`${day.id}-title`} className="day__title">
                  {day.label} <span>{day.date}</span>
                </h3>
                <Rows day={day} rooms={false} />
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
              <div key={day.id} role="tabpanel" id={`${day.id}-panel`} aria-labelledby={`${day.id}-tab`} hidden={active !== i} tabIndex={0} className="day">
                {body(day)}
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
