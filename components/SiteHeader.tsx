import { asset, navHref } from "@/lib/asset";
import { site } from "@/content/site";
import PhoneMenu from "./PhoneMenu";

/**
 * The top of the site.
 * - `variant="photo"`: on the opening screen, directly on the photograph, in the paper colour.
 * - `variant="bar"`: the slim bar that appears after the walk-through and stays while reading,
 *   with "Get in touch" always in reach.
 */
export default function SiteHeader({ variant, home = true }: { variant: "photo" | "bar"; home?: boolean }) {
  const logo = asset(variant === "photo" ? "/brand/logo-cream.webp" : "/brand/logo-marine.webp");
  return (
    <header className={`site-header site-header--${variant}${home ? "" : " site-header--page"}`}>
      <a className="site-header__logo" href={home ? "#top" : asset("/")}>
        <img src={logo} alt={`${site.name}, home`} width={1149} height={1045} />
      </a>
      <nav aria-label={variant === "bar" ? "Main" : "Main (opening)"}>
        <ul className="site-header__nav">
          {site.nav.map((n) => (
            <li key={n.label}>
              <a href={navHref(n.href, home)}>{n.label}</a>
            </li>
          ))}
          <li>
            <a className="button button--small" href={site.contact.href}>
              {site.contact.label}
            </a>
          </li>
        </ul>
      </nav>
      {variant === "bar" && <PhoneMenu home={home} />}
    </header>
  );
}
