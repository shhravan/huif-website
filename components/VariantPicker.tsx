"use client";

import { useEffect, useState } from "react";

/**
 * Design-review harness: switches between variants of one piece while the team chooses.
 * Shown only when the URL carries ?__variant=…; deliberately styled outside the design system.
 * Arrow keys step through the variants, H hides the picker. Delete with the variants once one is chosen.
 */
export type VariantGroup = { heading: string; items: { id: string; label: string }[] };

export default function VariantPicker({
  groups,
  active,
  onChoose,
}: {
  groups: VariantGroup[];
  active: string;
  onChoose: (id: string) => void;
}) {
  const [hidden, setHidden] = useState(false);
  const all = groups.flatMap((g) => g.items.map((i) => i.id));

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable], [role='tablist']")) return;
      if (e.key === "h" || e.key === "H") return setHidden((v) => !v);
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      onChoose(all[(all.indexOf(active) + step + all.length) % all.length]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, all, onChoose]);

  if (hidden) return null;
  return (
    <nav className="variant-picker" aria-label="Variants">
      {groups.map((g) => (
        <div key={g.heading} className="variant-picker-group" role="group" aria-labelledby={`variants-${g.heading}`}>
          <span className="variant-picker-heading" id={`variants-${g.heading}`}>
            <svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v4a3 3 0 0 0 3 3h7" />
              <path d="m10 7 3 3-3 3" />
            </svg>
            {g.heading}
          </span>
          {g.items.map((i) => (
            <button key={i.id} type="button" aria-pressed={i.id === active} onClick={() => onChoose(i.id)}>
              {i.label}
            </button>
          ))}
        </div>
      ))}
      <p className="variant-picker-hint">← → to switch · H to hide</p>
    </nav>
  );
}
