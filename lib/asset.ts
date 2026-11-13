/** Prefix a /public path with the base path (needed for GitHub Pages). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;

/** A nav link: "#about" stays a jump on the home page and points home from other pages; "/partners/" gets the base path. */
export const navHref = (href: string, home: boolean) => (href.startsWith("#") ? (home ? href : `${asset("/")}${href}`) : asset(href));
