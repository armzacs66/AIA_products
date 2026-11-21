"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { type Doc, TAGS, mark, rank, snippet, termRegex, toTerms } from "./search-utils";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Header search box: type, pick a suggestion (mouse or arrows+Enter) to jump to that page. */
export function HeaderSearch({ locale }: { locale: "th" | "en" }) {
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const load = () => {
    if (docs || failed) return;
    fetch(`${BASE}/search-index.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setDocs)
      .catch(() => setFailed(true));
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const terms = useMemo(() => toTerms(query), [query]);
  const re = useMemo(() => termRegex(terms), [terms]);
  const results = useMemo(
    () => rank((docs ?? []).filter((d) => d.kind === "quiz" || d.locale === locale), terms).slice(0, 6),
    [docs, locale, terms],
  );

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter" && terms.length) {
      go(active >= 0 ? results[active].href : `/search/?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="header-search" ref={box}>
      <label className="header-search-box">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></svg>
        <span className="sr-only">ค้นหา</span>
        <input
          role="combobox"
          aria-expanded={open && terms.length > 0}
          aria-controls="header-search-list"
          aria-autocomplete="list"
          value={query}
          placeholder="ค้นหา เช่น free look"
          onFocus={() => { load(); setOpen(true); }}
          onChange={(e) => { setQuery(e.target.value); setActive(-1); setOpen(true); }}
          onKeyDown={onKey}
        />
      </label>
      {open && terms.length > 0 && (
        <ul id="header-search-list" className="header-search-list" role="listbox">
          {failed && <li className="header-search-msg">โหลดดัชนีค้นหาไม่ได้ ลองรีเฟรชหน้านี้</li>}
          {!failed && !docs && <li className="header-search-msg">กำลังโหลด…</li>}
          {docs && results.length === 0 && <li className="header-search-msg">ไม่พบผลลัพธ์</li>}
          {results.map((d, i) => (
            <li key={d.href + d.title} role="option" aria-selected={i === active}>
              <button type="button" className={i === active ? "on" : ""} onMouseEnter={() => setActive(i)} onClick={() => go(d.href)}>
                <span className="search-tag">{TAGS[d.tag] ?? d.tag}</span>
                <strong>{mark(d.title, re)}</strong>
                <span className="search-snippet">{mark(snippet(d.text, terms, 90), re)}</span>
              </button>
            </li>
          ))}
          {docs && results.length > 0 && (
            <li className="header-search-all">
              <button type="button" onClick={() => go(`/search/?q=${encodeURIComponent(query.trim())}`)}>ดูผลลัพธ์ทั้งหมด</button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
