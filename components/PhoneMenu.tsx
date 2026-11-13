"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { navHref } from "@/lib/asset";

/**
 * Phones: the pages behind a Menu button. Native details, so it opens without script. Choosing a page or pressing
 * Escape closes it; Escape hands focus back to the button.
 */
export default function PhoneMenu({ home }: { home: boolean }) {
  const menu = useRef<HTMLDetailsElement>(null);
  return (
    <details
      ref={menu}
      className="site-header__menu"
      onKeyDown={(e) => {
        if (e.key !== "Escape" || !menu.current?.open) return;
        menu.current.removeAttribute("open");
        menu.current.querySelector("summary")?.focus();
      }}
    >
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
