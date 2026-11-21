"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { localePath, messages, type Locale } from "@/lib/i18n";
import { HeaderSearch } from "./header-search";

function getLocale(pathname: string): Locale {
  const route = pathname.replace(/^\/AIA_products(?=\/|$)/, "") || "/";
  return route === "/th" || route.startsWith("/th/") ? "th" : "en";
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const route = pathname.replace(/^\/AIA_products(?=\/|$)/, "") || "/";
  const locale = getLocale(pathname);
  const copy = messages[locale];
  const isThai = locale === "th";
  const englishPath = isThai ? route.slice(3) || "/" : route;
  const switchPath = isThai ? englishPath : localePath("th", route);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <header className="site-header">
      <Link className="brand" href={localePath(locale, "/")} aria-label={`${copy.home} - AIA ${copy.brand}`}>
        <span className="brand-mark">A</span>
        <span>AIA <span className="brand-muted">{copy.brand.toUpperCase()}</span></span>
      </Link>
      {!route.startsWith("/search") && <HeaderSearch locale={locale} />}
      <nav aria-label={copy.mainNav}>
        <Link href={localePath(locale, "/products")}>{copy.navProducts}</Link>
        <Link href={localePath(locale, "/comparisons")}>{copy.navCompare}</Link>
        <Link href={localePath(locale, "/exam")}>{copy.navExam}</Link>
        <Link href={localePath(locale, "/guides")}>{copy.navGuides}</Link>
        <Link href="/quiz">ควิซ</Link>
        {!/^\/(quiz|search)(\/|$)/.test(route) && (
          <Link className="language-toggle" href={switchPath} aria-label={copy.switchLanguage}>{copy.languageName}</Link>
        )}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const pathname = usePathname() ?? "/";
  const copy = messages[getLocale(pathname)];

  return (
    <footer className="site-footer">
      <span>{copy.brand === "STUDY DESK" ? "AIA Study Desk" : "AIA คลังความรู้"}</span>
      <span>{copy.footerDisclaimer}</span>
    </footer>
  );
}
