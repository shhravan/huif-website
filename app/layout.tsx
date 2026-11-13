import type { Metadata } from "next";
import "./globals.css";

/** Where the site is published, so share previews get full addresses (the Pages workflow sets the base path). */
const SITE_URL = `https://shhravan.github.io${process.env.NEXT_PUBLIC_BASE_PATH || ""}/`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Harvard Undergraduate India Forum",
  description: "India Uncharted: A Nation of Multitudes. The first Harvard forum in India. Mumbai, 13–14 March 2027.",
  openGraph: { type: "website", siteName: "Harvard Undergraduate India Forum", images: [{ url: "og/site.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Eczar:wght@400;500&family=Mukta:wght@400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
