const NAV = ["About", "Programme", "Speakers", "Get involved", "Attend", "FAQ"];

/** Top bar. "HUIF" is a stand-in until the real logo arrives. */
export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-header__mark" href="#top" aria-label="Harvard Undergraduate India Forum, home">
        HUIF
      </a>
      <nav aria-label="Main">
        <ul className="site-header__nav">
          {NAV.map((n) => (
            <li key={n}>
              <a href={`#${n.toLowerCase().replace(/\s+/g, "-")}`}>{n}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
