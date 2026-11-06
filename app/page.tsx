import GateIntro from "@/components/GateIntro";
import GateOutro from "@/components/GateOutro";
import SiteFooter from "@/components/SiteFooter";

// Middle of the page, between the entrance and the exit. Structure is final;
// every string marked TODO is placeholder copy to replace with the team's.

const THEMES = [
  { title: "Technology & AI", text: "TODO: one line on this theme." },
  { title: "Economy & Enterprise", text: "TODO: one line on this theme." },
  { title: "Policy & Governance", text: "TODO: one line on this theme." },
  { title: "Society & Culture", text: "TODO: one line on this theme." },
];

const FORMATS = [
  { title: "Keynotes", text: "TODO" },
  { title: "Panels", text: "TODO" },
  { title: "Fireside chats", text: "TODO" },
  { title: "Workshops", text: "TODO" },
];

const DAYS = [
  {
    label: "Day 1 · 13 March",
    items: [
      ["09:00", "Registration"],
      ["10:00", "Opening keynote"],
      ["11:30", "Panel: TODO"],
      ["13:00", "Lunch"],
      ["14:30", "Workshops"],
      ["18:30", "Evening reception"],
    ],
  },
  {
    label: "Day 2 · 14 March",
    items: [
      ["09:30", "Panel: TODO"],
      ["11:00", "Fireside chat: TODO"],
      ["13:00", "Lunch"],
      ["14:30", "Panel: TODO"],
      ["16:30", "Closing"],
    ],
  },
];

const INVOLVED = [
  { title: "Speak", text: "TODO: who we're looking for.", cta: "Nominate a speaker" },
  { title: "Partner", text: "TODO: what partners get.", cta: "Partner with us" },
  { title: "Volunteer", text: "TODO: roles on the day.", cta: "Volunteer" },
  { title: "Join the team", text: "TODO: open organiser roles.", cta: "Apply" },
];

const TEAM = [
  ["Name", "Co-President"],
  ["Name", "Co-President"],
  ["Name", "Programming"],
  ["Name", "Partnerships"],
  ["Name", "Operations"],
  ["Name", "Marketing"],
];

const FAQ = [
  "Who can attend?",
  "How much does a ticket cost?",
  "Where is the venue, and how do I get there?",
  "Is there financial aid or accommodation support?",
  "Do I need to be a Harvard student?",
  "How is HUIF related to Harvard University?",
];

function Section({ id, label, title, children }: { id: string; label: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="section">
      <div className="section__inner">
        <h2 className="section__label">{label}</h2>
        <div>
          <p className="section__text">{title}</p>
          <div className="section__body">{children}</div>
        </div>
      </div>
    </section>
  );
}

function Cards({ items }: { items: { title: string; text: string; cta?: string }[] }) {
  return (
    <ul className="cards">
      {items.map((c) => (
        <li key={c.title} className="card">
          <h3>{c.title}</h3>
          <p>{c.text}</p>
          {/* TODO: link each CTA to its form */}
          {c.cta && <a className="card__cta" href="#">{c.cta} →</a>}
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main id="top">
      <GateIntro />

      <Section id="about" label="About" title="TODO: one line on what HUIF is and why it exists.">
        <p>TODO: a short paragraph. The first forum run by Harvard undergraduates, held in India: why now, and why students.</p>
        <ul className="stats">
          <li><b>2</b><span>days</span></li>
          <li><b>TODO</b><span>speakers</span></li>
          <li><b>TODO</b><span>attendees</span></li>
          <li><b>1st</b><span>edition</span></li>
        </ul>
        <h3 className="sub">Themes</h3>
        <Cards items={THEMES} />
      </Section>

      <Section id="programme" label="Programme" title="Two days of conversations, 13–14 March.">
        <Cards items={FORMATS} />
        <div className="days">
          {DAYS.map((d) => (
            <div key={d.label}>
              <h3 className="sub">{d.label}</h3>
              <ol className="agenda">
                {d.items.map(([t, s]) => (
                  <li key={t}><time>{t}</time><span>{s}</span></li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <p className="note">Draft schedule. Sessions will be announced in stages.</p>
      </Section>

      <Section id="speakers" label="Speakers" title="Speakers will be announced in stages.">
        <ul className="people">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i}><div className="avatar" aria-hidden="true" /><h3>To be announced</h3><p>Title, Organisation</p></li>
          ))}
        </ul>
      </Section>

      <Section id="get-involved" label="Get involved" title="Help build the first edition.">
        <Cards items={INVOLVED} />
      </Section>

      <Section id="attend" label="Attend" title="Join us in India this March.">
        <div className="attend">
          <div><h3>Who it&rsquo;s for</h3><p>TODO: students, young professionals, founders.</p></div>
          <div><h3>Tickets</h3><p>TODO: price and how to register.</p></div>
          <div><h3>Venue</h3><p>TODO: venue, city, how to get there.</p></div>
          <div><h3>Travelling in</h3><p>TODO: stays nearby, visas, airport.</p></div>
        </div>
        {/* TODO: registration link */}
        <a className="button" href="#">Register interest →</a>
      </Section>

      <Section id="team" label="Team" title="Organised by Harvard undergraduates.">
        <ul className="people">
          {TEAM.map(([n, r], i) => (
            <li key={i}><div className="avatar" aria-hidden="true" /><h3>{n}</h3><p>{r}</p></li>
          ))}
        </ul>
      </Section>

      <Section id="partners" label="Partners" title="Partners announced soon.">
        <ul className="logos">
          {Array.from({ length: 4 }, (_, i) => <li key={i}>Partner logo</li>)}
        </ul>
      </Section>

      <Section id="faq" label="FAQ" title="Questions">
        {FAQ.map((q) => (
          <details key={q} className="faq">
            <summary>{q}</summary>
            <p>TODO</p>
          </details>
        ))}
      </Section>

      <GateOutro />
      <SiteFooter />
    </main>
  );
}
