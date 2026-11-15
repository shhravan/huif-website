"use client";

import { useEffect, useRef, useState } from "react";
import SeaLink from "./SeaLink";
import ContactForm from "./ContactForm";
import { contact, CONTACT_EMAIL } from "@/content/site";

const SEA = "The Bandra–Worli Sea Link in Mumbai at night, drawn in points of light";

// TEMP: ?v=a|b|c switches between three layouts for review; one stays.
export default function ContactLayout() {
  const [v, setV] = useState("a");
  useEffect(() => setV(new URLSearchParams(location.search).get("v") ?? "a"), []);
  const text = useRef<HTMLDivElement>(null);
  const intro = (
    <>
      <h1 className="head">{contact.title}</h1>
      <p className="contact__lead">{contact.lead}</p>
      <p className="contact__direct">
        {contact.direct} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </>
  );
  if (v === "b")
    return (
      <section className="contact-b">
        <SeaLink label={SEA} text={text} />
        <div className="frame contact__grid">
          <div className="contact__intro">{intro}</div>
          <div ref={text} className="contact__panel">
            <ContactForm />
          </div>
        </div>
      </section>
    );
  if (v === "c")
    return (
      <div className="contact-c">
        <section className="contact-c__sea">
          <SeaLink label={SEA} text={text} />
          <div ref={text} className="contact-c__intro">{intro}</div>
        </section>
        <div className="contact-c__form">
          <ContactForm />
        </div>
      </div>
    );
  return (
    <>
      <section className="about contact-a">
        <SeaLink label={SEA} text={text} />
        <div className="frame about__grid">
          <div ref={text} className="about__body">{intro}</div>
        </div>
      </section>
      <div className="frame contact__grid contact-a__form">
        <h2 className="head">Write to the team</h2>
        <ContactForm />
      </div>
    </>
  );
}
