import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactLayout from "@/components/ContactLayout";
import { contact, site } from "@/content/site";

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
        <ContactLayout />
      </main>
      <SiteFooter home={false} />
    </>
  );
}
