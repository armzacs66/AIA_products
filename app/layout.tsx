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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700&amp;display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
