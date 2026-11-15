"use client";

import { useRef } from "react";
import SeaLink from "./SeaLink";
import ContactForm from "./ContactForm";
import { contact, CONTACT_EMAIL } from "@/content/site";

/** The contact page at sea: the words and the form share one top line, and the Sea Link runs below the words, beside the form. */
export default function ContactLayout() {
  const form = useRef<HTMLDivElement>(null);
  return (
    <section className="contact-sea" aria-labelledby="contact-title">
      <div className="frame contact__grid">
        <div className="contact__intro">
          <h1 id="contact-title" className="head">
            {contact.title}
          </h1>
          <p className="contact__lead">{contact.lead}</p>
          <p className="contact__direct">
            {contact.direct} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </div>
        <div ref={form} className="contact__panel">
          <ContactForm />
        </div>
      </div>
      <div className="contact-sea__bridge">
        <SeaLink label="The Bandra–Worli Sea Link in Mumbai at night, drawn in points of light" text={form} />
      </div>
    </section>
  );
}
