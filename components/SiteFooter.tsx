import { site, footer, CONTACT_EMAIL } from "@/content/site";

/**
 * The close of the page: the invitation, the pages, where to follow
 * and how to reach us, then the name at full width. The one credit is the one its licence requires.
 */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="frame">
        <div className="site-footer__top">
          <p className="site-footer__line">{footer.line}</p>
          <nav aria-label="Footer" className="site-footer__col">
            <p className="site-footer__label">Pages</p>
            <ul>
              {site.nav.map((n) => (
                <li key={n.label}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
              <li>
                <a href="#contact">{site.contact.label}</a>
              </li>
            </ul>
          </nav>
          <div className="site-footer__col">
            <p className="site-footer__label">Follow</p>
            <ul>
              <li>
                <a href={site.instagram.href} rel="noopener">
                  {site.instagram.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </div>
          {CONTACT_EMAIL && (
            <div className="site-footer__col">
              <p className="site-footer__label">{footer.reach}</p>
              <ul>
                <li>
                  <a href={site.contact.href}>{CONTACT_EMAIL}</a>
                </li>
              </ul>
            </div>
          )}
        </div>
        <p className="site-footer__name display">{site.name}</p>
        <p className="site-footer__credit">
          Sanchi gateway photograph by Photo Dharma,{" "}
          <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>.
        </p>
      </div>
    </footer>
  );
}
