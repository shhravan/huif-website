"use client";

import { useEffect, useState, type ReactNode } from "react";
import "./picker.css";

const ORDER = ["ledger", "statement", "brief"] as const;
const LABEL: Record<string, string> = { ledger: "Ledger", statement: "Statement", brief: "Brief" };
type Key = (typeof ORDER)[number];

function read(): Key {
  const v = new URLSearchParams(window.location.search).get("__variant");
  return (ORDER as readonly string[]).includes(v ?? "") ? (v as Key) : "ledger";
}

/** Variant harness: delete on promotion. */
export default function Picker({ slots }: { slots: Record<Key, ReactNode> }) {
  const [active, setActive] = useState<Key>("ledger");
  const [hidden, setHidden] = useState(false);

  const go = (k: Key) => {
    const u = new URL(window.location.href);
    u.searchParams.set("__variant", k);
    window.history.replaceState(null, "", u);
    setActive(k);
  };

  useEffect(() => {
    setActive(read());
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "h" || e.key === "H") return setHidden((h) => !h);
      const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      const i = ORDER.indexOf(read());
      go(ORDER[(i + step + ORDER.length) % ORDER.length]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {slots[active]}
      <div className="variant-picker-select" hidden={hidden}>
        <select aria-label="Variant" value={active} onChange={(e) => go(e.target.value as Key)}>
          <optgroup label="Structure">
            {ORDER.map((k) => <option key={k} value={k}>{LABEL[k]}</option>)}
          </optgroup>
        </select>
        <svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4 6 4 4 4-4" /></svg>
      </div>
    </>
  );
}
