"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { navHref } from "@/lib/asset";

/** Phones: the pages behind a Menu button. Native details, so it opens without script; choosing a page closes it. */
export default function PhoneMenu({ home }: { home: boolean }) {
  const menu = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={menu} className="site-header__menu">
      <summary>Menu</summary>
      <nav aria-label="Main (phone)">
        <ul>
          {site.nav.map((n) => (
            <li key={n.label}>
              <a href={navHref(n.href, home)} onClick={() => menu.current?.removeAttribute("open")}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
