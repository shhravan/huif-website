import GateIntro from "@/components/GateIntro";

export default function Home() {
  return (
    <main>
      <GateIntro />

      {/* Placeholder content — the regular homepage continues after the gate. */}
      <section className="content">
        <div className="content__inner">
          <h2>About</h2>
          <p>
            Placeholder copy. Once you've passed through the gate, the page scrolls like a normal
            site. Swap this out for the real HUIF sections.
          </p>
        </div>
      </section>
      <section className="content content--alt">
        <div className="content__inner">
          <h2>What we do</h2>
          <div className="cards">
            {["Programs", "Events", "Community"].map((t) => (
              <article key={t} className="card">
                <h3>{t}</h3>
                <p>Short placeholder description.</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <footer className="footer">© HUIF</footer>
    </main>
  );
}
