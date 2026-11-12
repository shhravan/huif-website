import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harvard Undergraduate India Forum",
  description: "India Uncharted: A Nation of Multitudes. Mumbai, 13–14 March 2027.",
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
