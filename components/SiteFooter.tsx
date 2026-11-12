import { site, footer } from "@/content/site";

/** The close of the page: the name at full width, the facts and the navigation. The one credit is the one its licence requires. */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="frame">
        <p className="site-footer__name">{site.name}</p>
        <div className="site-footer__row">
          <p className="site-footer__line">{footer.line}</p>
          <nav aria-label="Footer">
            <ul className="site-footer__nav">
              {site.nav.map((n) => (
                <li key={n.label}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
              <li>
                <a href={site.contact.href}>{site.contact.label}</a>
              </li>
            </ul>
          </nav>
        </div>
        <p className="site-footer__credit">
          Sanchi gateway photograph by Photo Dharma,{" "}
          <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>.
        </p>
      </div>
    </footer>
  );
}
