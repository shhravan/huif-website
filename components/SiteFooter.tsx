import StayUpdated from "./StayUpdated";
import { navHref } from "@/lib/asset";
import { site, footer, CONTACT_EMAIL } from "@/content/site";

/**
 * The close of the page: one Marine band. The name and date with the updates sign-up on the left, the pages
 * and where to follow on the right, then the name set across the full width. The one credit is the one
 * its licence requires.
 */
export default function SiteFooter({ home = true }: { home?: boolean }) {
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
                  <a href={navHref(n.href, home)}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="site-footer__col">
            <p className="site-footer__label">{footer.follow}</p>
            <ul>
              <li>
                <a href={site.instagram.href} rel="noopener">
                  {site.instagram.label}
                </a>
              </li>
            </ul>
            {CONTACT_EMAIL && (
              <>
                <p className="site-footer__label site-footer__label--gap">{footer.reach}</p>
                <ul>
                  <li>
                    <a className="site-footer__email" href={site.contact.href}>
                      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
                      </svg>
                      {CONTACT_EMAIL}
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
