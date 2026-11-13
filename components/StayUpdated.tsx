"use client";

import { useState } from "react";
import { footer, CONTACT_EMAIL } from "@/content/site";

/**
 * Updates sign-up. There is no mailing list yet, so a valid address opens the visitor's email app
 * with a short request to the Forum's inbox; swap the submit for a list provider when there is one.
 */
export default function StayUpdated() {
  const [state, setState] = useState<"idle" | "sent" | "invalid">("idle");
  const t = footer.updates;

  return (
    <form
      className="updates"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setState("invalid");
          (e.currentTarget.elements.namedItem("email") as HTMLInputElement).focus();
          return;
        }
        const body = `Please add ${email} to the HUIF 2027 updates.`;
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(body)}`;
        setState("sent");
      }}
    >
      <label className="updates__label" htmlFor="updates-email">
        {t.label}
      </label>
      <div className="updates__row">
        <input
          id="updates-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          placeholder={t.placeholder}
          aria-invalid={state === "invalid"}
          aria-describedby="updates-status"
          onChange={() => state !== "idle" && setState("idle")}
        />
        <button className="button button--light" type="submit">
          {t.action}
        </button>
      </div>
      <p id="updates-status" className="updates__status" aria-live="polite">
        {state === "sent" ? t.sent : state === "invalid" ? t.invalid : ""}
      </p>
    </form>
  );
}
