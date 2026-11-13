import StayUpdated from "./StayUpdated";
import { site, footer, CONTACT_EMAIL } from "@/content/site";

/**
 * The close of the page: one Marine band. The name and date with the updates sign-up on the left, the pages
 * and where to follow on the right, then the name set across the full width. The one credit is the one
 * its licence requires.
 */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="frame">
        <div className="site-footer__top">
          <div className="site-footer__lead">
            <h2 className="site-footer__title">{footer.title}</h2>
            <p className="site-footer__line">{footer.line}</p>
            <StayUpdated />
          </div>
          <nav aria-label="Footer" className="site-footer__col">
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
            <p className="site-footer__label">{footer.follow}</p>
            <ul>
              <li>
                <a href={site.instagram.href} rel="noopener">
                  {site.instagram.label} <span aria-hidden="true">→</span>
                </a>
              </li>
            </ul>
            {CONTACT_EMAIL && (
              <>
                <p className="site-footer__label site-footer__label--gap">{footer.reach}</p>
                <ul>
                  <li>
                    <a className="site-footer__email" href={site.contact.href}>
                      {CONTACT_EMAIL.split("@")[0]}
                      <wbr />@{CONTACT_EMAIL.split("@")[1]}
                    </a>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
        <p className="site-footer__pre">Harvard Undergraduate</p>
        <p className="site-footer__name">India Forum</p>
      </div>
      <div className="site-footer__base">
        <p className="frame site-footer__credit">
          Sanchi gateway photograph by Photo Dharma, <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>.
        </p>
      </div>
    </footer>
  );
}
