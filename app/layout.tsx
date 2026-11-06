import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HUIF",
  description: "Placeholder description — replace with the HUIF tagline.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
