"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type SearchEntry = {
  title: string;
  slug: string;
  section: string;
  category?: string;
  description?: string;
  searchText: string;
};

export function KnowledgeSearch({ entries }: { entries: SearchEntry[] }) {
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
        <span className="sr-only">Search the study notes</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, benefits, exam notes..." />
        {query && <button className="clear-search" type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
      </label>
      {query.trim() && (
        <div className="search-results" role="region" aria-label="Search results">
          {results.length ? results.map((entry) => (
            <Link href={`/${entry.section}/${entry.slug}`} className="search-result" key={`${entry.section}/${entry.slug}`} onClick={() => setQuery("")}>
              <span><strong>{entry.title}</strong><small>{entry.category ?? entry.section}</small></span>
              <span aria-hidden="true">↗</span>
            </Link>
          )) : <p className="no-results">No notes found. Try a product name or benefit.</p>}
        </div>
      )}
    </div>
  );
}
