"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { localePath, messages, type Locale } from "@/lib/i18n";

type SearchEntry = {
  title: string;
  slug: string;
  section: string;
  category?: string;
  description?: string;
  searchText: string;
};

export function KnowledgeSearch({ entries, locale }: { entries: SearchEntry[]; locale: Locale }) {
  const copy = messages[locale];
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return [];

    return entries
      .filter((entry) => `${entry.title} ${entry.category ?? ""} ${entry.description ?? ""} ${entry.section} ${entry.searchText}`.toLowerCase().includes(normalized))
      .slice(0, 6);
  }, [entries, query]);

  return (
    <div className="search-wrap">
      <label className="search-box">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></svg>
        <span className="sr-only">{copy.searchLabel}</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.searchPlaceholder} />
        {query && <button className="clear-search" type="button" onClick={() => setQuery("")} aria-label={copy.clearSearch}>×</button>}
      </label>
      {query.trim() && (
        <div className="search-results" role="region" aria-label={copy.searchResults}>
          {results.length ? results.map((entry) => (
            <Link href={localePath(locale, `/${entry.section}/${entry.slug}`)} className="search-result" key={`${entry.section}/${entry.slug}`} onClick={() => setQuery("")}>
              <span><strong>{entry.title}</strong><small>{entry.category ?? entry.section}</small></span>
              <span aria-hidden="true">↗</span>
            </Link>
          )) : <p className="no-results">{copy.noResults}</p>}
        </div>
      )}
    </div>
  );
}
