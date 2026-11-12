import GateIntro from "@/components/GateIntro";
import SiteHeader from "@/components/SiteHeader";
import SmoothScroll from "@/components/SmoothScroll";
import GateOutro from "@/components/GateOutro";
import SiteFooter from "@/components/SiteFooter";

// Placeholder sections between the entrance and the exit. Real content comes later.
const SECTIONS = [
  {
    id: "about",
    label: "About",
    text: "One line about what the Harvard Undergraduate India Forum is. Placeholder until the team sends the copy.",
  },
  {
    id: "programme",
    label: "Programme",
    text: "Two days of panels and conversations, 13–14 March. The full schedule will live here.",
  },
  {
    id: "speakers",
    label: "Speakers",
    text: "Speakers grouped by panel. Coming in a later round.",
  },
];

export default function Home() {
  return (
    <main id="top">
      <SmoothScroll />
      <SiteHeader variant="bar" />
      <GateIntro />
      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className="section">
          <div className="section__inner">
            <h2 className="section__label">{s.label}</h2>
            <p className="section__text">{s.text}</p>
          </div>
        </section>
      ))}
      <GateOutro />
      <SiteFooter />
    </main>
  );
}
