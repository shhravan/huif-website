"use client";

import { useEffect, useState } from "react";
import { contact as t, CONTACT_EMAIL, FORM_KEY } from "@/content/site";

type Field = "name" | "email" | "message";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** One form for every enquiry. With FORM_KEY set it posts to Web3Forms; otherwise, or if that fails, it opens the visitor's email app with the message filled in. */
export default function ContactForm() {
  const [topic, setTopic] = useState<string>("other");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "mailed">("idle");

  // a link like /contact/?type=press opens with that topic chosen
  useEffect(() => {
    const k = new URLSearchParams(window.location.search).get("type");
    if (k && t.topics.some((x) => x.key === k)) setTopic(k);
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const bad: Partial<Record<Field, string>> = {};
    if (!d.name?.trim()) bad.name = t.invalid.name;
    if (!EMAIL.test(d.email?.trim() ?? "")) bad.email = t.invalid.email;
    if (!d.message?.trim()) bad.message = t.invalid.message;
    setErrors(bad);
    const first = Object.keys(bad)[0];
    if (first) return (form.elements.namedItem(first) as HTMLElement).focus();

    const label = t.topics.find((x) => x.key === topic)!.label;
    const subject = `HUIF 2027: ${label}`;
    const lines = [`Name: ${d.name}`, `Email: ${d.email}`];
    if (d.org) lines.push(`Organisation: ${d.org}`);
    const body = [...lines, "", d.message].join("\n");

    if (FORM_KEY) {
      setState("sending");
      try {
        const r = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ access_key: FORM_KEY, subject, from_name: d.name, replyto: d.email, topic: label, ...d }),
        });
        if ((await r.json()).success) return setState("sent");
      } catch {}
    }
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setState("mailed");
  }

  if (state === "sent") return <p className="contact__done" role="status">{t.sent}</p>;

  const err = (f: Field) =>
    errors[f] ? (
      <p id={`${f}-error`} className="contact__error">
        {errors[f]}
      </p>
    ) : null;
  const aria = (f: Field) => ({ "aria-invalid": !!errors[f], "aria-describedby": errors[f] ? `${f}-error` : undefined });

  return (
    <form className="contact__form" noValidate onSubmit={submit}>
      <div className="contact__row">
        <label className="contact__field">
          <span>{t.fields.name}</span>
          <input name="name" autoComplete="name" placeholder={t.placeholders.name} {...aria("name")} />
          {err("name")}
        </label>
        <label className="contact__field">
          <span>{t.fields.email}</span>
          <input name="email" type="email" autoComplete="email" inputMode="email" spellCheck={false} placeholder={t.placeholders.email} {...aria("email")} />
          {err("email")}
        </label>
      </div>
      <div className="contact__row">
        <label className="contact__field">
          <span>{t.fields.org}</span>
          <input name="org" autoComplete="organization" />
        </label>
        <label className="contact__field">
          <span>{t.fields.topic}</span>
          <select name="topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
            {t.topics.map((x) => (
              <option key={x.key} value={x.key}>
                {x.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="contact__field">
        <span>{t.fields.message}</span>
        <textarea name="message" rows={6} {...aria("message")} />
        {err("message")}
      </label>

      <button className="button" type="submit" disabled={state === "sending"}>
        {state === "sending" ? t.sending : t.action}
      </button>
      <p className="contact__status" aria-live="polite">
        {state === "mailed" && (
          <>
            {t.mailed} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </>
        )}
      </p>
    </form>
  );
}
