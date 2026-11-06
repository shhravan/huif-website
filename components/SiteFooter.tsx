const LINKS = ["About", "Programme", "Speakers", "Get involved", "Attend"];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__name">Harvard Undergraduate India Forum</p>
          <p className="site-footer__line">The first Harvard forum in India. 13–14 March.</p>
          <form className="site-footer__form">
            <label htmlFor="footer-email">Stay updated</label>
            <div className="site-footer__field">
              <input id="footer-email" type="email" placeholder="you@college.edu" autoComplete="email" />
              <button type="button">Sign up</button>
            </div>
          </form>
        </div>
        <div className="site-footer__cols">
          <div>
            <p className="site-footer__label">Resources</p>
            <ul>
              {LINKS.map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="site-footer__label">Follow</p>
            <ul>
              <li><a href="#">Instagram →</a></li>
              <li><a href="#">LinkedIn →</a></li>
            </ul>
          </div>
        </div>
      </div>
      <p className="site-footer__credit">
        Gateway photograph: “Front View of Gate”, Sanchi, by Photo Dharma,{" "}
        <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>, via{" "}
        <a href="https://commons.wikimedia.org/wiki/File:001_Front_View_of_Gate_(33682987101).jpg">Wikimedia Commons</a>.
        Background removed, perspective and colour adjusted. Sky and paving from{" "}
        <a href="https://polyhaven.com">Poly Haven</a> (CC0).
      </p>
    </footer>
  );
}
