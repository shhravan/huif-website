import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";
import { contact, CONTACT_EMAIL, site } from "@/content/site";

export const metadata: Metadata = {
  title: `Get in touch, ${site.name}`,
  description: contact.lead,
};

/** Where every "Get in touch" leads: one form, sorted by topic. */
export default function ContactPage() {
  return (
    <>
      <SiteHeader variant="bar" home={false} />
      <main id="content" tabIndex={-1} className="page contact">
        <div className="frame contact__grid">
          <div className="contact__intro">
            <h1 className="head">{contact.title}</h1>
            <p className="contact__lead">{contact.lead}</p>
            <p className="contact__direct">
              {contact.direct}: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          </div>
          <ContactForm />
        </div>
      </main>
      <SiteFooter home={false} />
    </>
  );
}
