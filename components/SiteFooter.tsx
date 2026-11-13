import { site, footer, CONTACT_EMAIL } from "@/content/site";

/**
 * The close of the page, after the end of indiaconferenceharvard.com (not copied point for point):
 * an invitation with the pages and where to follow, then a Marine band holding the facts, a line on what
 * the Forum is and the name set across the full width. The one credit is the one its licence requires.
 */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="frame site-footer__top">
        <div className="site-footer__invite">
          <h2 className="site-footer__heading head">{footer.heading}</h2>
          <p className="site-footer__line">{footer.line}</p>
          <a className="button" href={site.instagram.href} rel="noopener">
            Follow {site.instagram.handle}
          </a>
        </div>
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
          {CONTACT_EMAIL && (
            <>
              <p className="site-footer__label site-footer__label--gap">{footer.reach}</p>
              <ul>
                <li>
                  <a href={site.contact.href}>{CONTACT_EMAIL}</a>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="site-footer__band">
        <div className="frame">
          <div className="site-footer__facts">
            {footer.band.map((b) => (
              <p key={b.value}>
                <span className="site-footer__value">{b.value}</span>
                <span>{b.note}</span>
              </p>
            ))}
            <p className="site-footer__about">{footer.about}</p>
          </div>
          <p className="site-footer__pre">Harvard Undergraduate</p>
          <p className="site-footer__name">
            India Forum
          </p>
        </div>
      </div>
      <div className="frame">
        <p className="site-footer__credit">
          Sanchi gateway photograph by Photo Dharma,{" "}
          <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>.
        </p>
      </div>
    </footer>
  );
}
