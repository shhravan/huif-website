import { asset } from "@/lib/asset";
import { site } from "@/content/site";

/**
 * The top of the site.
 * - `variant="photo"`: on the opening screen, directly on the photograph, in cream.
 * - `variant="bar"`: the slim pale bar that appears after the walk-through and stays
 *   while reading the rest of the site, with "Register interest" always in reach.
 */
export default function SiteHeader({ variant }: { variant: "photo" | "bar" }) {
  const logo = asset(variant === "photo" ? "/brand/logo-cream.webp" : "/brand/logo-marine.webp");
  return (
    <header className={`site-header site-header--${variant}`}>
      <a className="site-header__logo" href="#top">
        <img src={logo} alt={`${site.name}, home`} width={480} height={437} />
      </a>
      <nav aria-label={variant === "bar" ? "Main" : "Main (opening)"}>
        <ul className="site-header__nav">
          {site.nav.map((n) => (
            <li key={n.label}>
              <a href={n.href}>{n.label}</a>
            </li>
          ))}
          {variant === "bar" && (
            <li>
              <a className="button-line" href={site.register.href}>
                {site.register.label}
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
