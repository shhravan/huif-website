import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PartnersHero from "@/components/PartnersHero";
import { partners, site } from "@/content/site";
import Picker from "./variants/Picker";
import Ledger from "./variants/Ledger";
import Statement from "./variants/Statement";
import Brief from "./variants/Brief";
import "./variants/variants.css";

export const metadata: Metadata = {
  title: `Partners, ${site.name}`,
  description: partners.lead,
};

/** For organisations thinking of supporting the Forum: who is in the room, what partners receive, how to start. */
export default function PartnersPage() {
  return (
    <>
      <SiteHeader variant="bar" home={false} />
      <main id="content" tabIndex={-1} className="page partners">
        <PartnersHero action={false} />

        <Picker slots={{ ledger: <Ledger />, statement: <Statement />, brief: <Brief /> }} />
      </main>
      <SiteFooter home={false} />
    </>
  );
}
