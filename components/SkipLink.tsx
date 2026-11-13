"use client";

/**
 * "Skip to content", the first thing a keyboard reaches. It moves focus itself, because smooth scrolling (Lenis)
 * takes over same-page links and would otherwise only scroll.
 */
export default function SkipLink() {
  return (
    <a
      className="skip-link"
      href="#content"
      onClick={(e) => {
        const target = document.getElementById("content");
        if (!target) return;
        e.preventDefault();
        e.stopPropagation();
        target.focus();
        target.scrollIntoView({ block: "start" });
      }}
    >
      Skip to content
    </a>
  );
}
