import { programme, type Slot } from "@/content/site";

/** "13:30" → "1:30 pm" */
function clock(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { text: `${h12}:${String(m).padStart(2, "0")}`, suffix }; // a clock, not index numbering
}

function Time({ start, end }: { start: string; end: string }) {
  const a = clock(start);
  const b = clock(end);
  const label = a.suffix === b.suffix ? `${a.text}–${b.text} ${b.suffix}` : `${a.text} ${a.suffix}–${b.text} ${b.suffix}`;
  return (
    <p className="slot__time">
      <time dateTime={start}>{label}</time>
    </p>
  );
}

function SlotRow({ slot }: { slot: Slot }) {
  if (slot.kind === "panels") {
    return (
      <li className="slot">
        <Time start={slot.start} end={slot.end} />
        {slot.rooms.map((p, i) => (
          <div key={p.title} className="slot__room">
            <h4 className="slot__title">{p.title}</h4>
            <p className="slot__where">Room {i + 1}</p>
          </div>
        ))}
      </li>
    );
  }
  if (slot.kind === "keynote") {
    return (
      <li className="slot slot--keynote">
        <Time start={slot.start} end={slot.end} />
        <div className="slot__room slot__room--wide">
          <h4 className="slot__title">{slot.title}</h4>
          {slot.detail && <p className="slot__detail">{slot.detail}</p>}
        </div>
      </li>
    );
  }
  return (
    <li className="slot slot--break">
      <Time start={slot.start} end={slot.end} />
      <p className="slot__room slot__room--wide slot__plain">
        {slot.title}
        {slot.rooms && <span>{slot.rooms.join(" · ")}</span>}
      </p>
    </li>
  );
}

/** The confirmed Schedule as a printed timetable: a time rail, the two rooms named once per day, every slot. */
export default function Programme() {
  return (
    <section id="programme" className="programme" aria-labelledby="programme-title">
      <div className="frame">
        <header className="programme__head" data-reveal>
          <h2 id="programme-title">{programme.heading}</h2>
          <p>{programme.intro}</p>
        </header>
        {programme.days.map((day) => (
          <section key={day.id} className="day" aria-labelledby={`${day.id}-title`}>
            <div className="day__head" data-reveal>
              <h3 id={`${day.id}-title`} className="day__title">
                {day.label}
              </h3>
              <p className="day__date">{day.date}</p>
            </div>
            <div className="day__rooms" aria-hidden="true">
              <span />
              <p>Room 1</p>
              <p>Room 2</p>
            </div>
            <ol className="day__slots">
              {day.slots.map((s) => (
                <SlotRow key={s.start} slot={s} />
              ))}
            </ol>
          </section>
        ))}
      </div>
    </section>
  );
}
