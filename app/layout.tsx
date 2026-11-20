import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "./components/site-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIA Study Desk",
  description: "A searchable study guide to AIA products, comparisons, and exam notes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
