import Picture from "./Picture";
import { site, footer, photos } from "@/content/site";

/** The close of the page: the name at full width, the facts, the navigation and the image credits. */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__band">
        <Picture photo={photos.dusk} sizes="100vw" />
      </div>
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
          Gateway photograph: “Front View of Gate”, Sanchi, by Photo Dharma,{" "}
          <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>, via{" "}
          <a href="https://commons.wikimedia.org/wiki/File:001_Front_View_of_Gate_(33682987101).jpg">Wikimedia Commons</a>.
          Background removed, perspective and colour adjusted. Sky and paving from{" "}
          <a href="https://polyhaven.com">Poly Haven</a> (CC0). Other photographs supplied by the organising team.
        </p>
      </div>
    </footer>
  );
}
