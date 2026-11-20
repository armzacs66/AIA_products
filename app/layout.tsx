import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIA Study Desk",
  description: "A searchable study guide to AIA products, comparisons, and exam notes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="AIA Study Desk home">
            <span className="brand-mark">A</span>
            <span>AIA <span className="brand-muted">STUDY DESK</span></span>
          </Link>
          <nav aria-label="Main navigation">
            <Link href="/products">Products</Link>
            <Link href="/comparisons">Compare</Link>
            <Link href="/exam">Exam prep</Link>
            <Link href="/guides">Guides</Link>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <span>AIA Study Desk</span>
          <span>Study notes for learning purposes. Confirm current terms in official policy documents.</span>
        </footer>
      </body>
    </html>
  );
}
