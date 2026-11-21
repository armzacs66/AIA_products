"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import "./quiz.css"; // shared .chip / .quiz-topics styles
import { type Doc, TAGS, mark, rank, snippet, termRegex, toTerms } from "./search-utils";

type Filter = "all" | "page" | "quiz";
const FILTERS: [Filter, string][] = [["all", "ทั้งหมด"], ["page", "บทเรียน"], ["quiz", "ข้อสอบควิซ"]];

export function SearchApp({ docs }: { docs: Doc[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get("q") ?? "");
  }, []);

  const terms = useMemo(() => toTerms(query), [query]);
  const re = useMemo(() => termRegex(terms), [terms]);
  const results = useMemo(
    () => rank(docs.filter((d) => filter === "all" || d.kind === filter), terms).slice(0, 40),
    [docs, terms, filter],
  );

  return (
    <main className="search-page">
      <h1>ค้นหา</h1>
      <label className="search-box">
        <span className="sr-only">ค้นหาในบทเรียนและข้อสอบ</span>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="เช่น free look, โมฆียะ, ระยะผ่อนผัน, 180 วัน"
        />
        {query && <button className="clear-search" type="button" onClick={() => setQuery("")} aria-label="ล้างคำค้น">×</button>}
      </label>
      <div className="quiz-topics" role="radiogroup" aria-label="ประเภทผลลัพธ์">
        {FILTERS.map(([f, label]) => (
          <button key={f} role="radio" aria-checked={filter === f} className={filter === f ? "chip on" : "chip"} onClick={() => setFilter(f)}>
            {label}
          </button>
        ))}
      </div>
      {terms.length > 0 && <p className="search-count" aria-live="polite">พบ {results.length} รายการ</p>}
      <ul className="search-list">
        {results.map((d) => (
          <li key={d.href + d.title}>
            <Link href={d.href}>
              <span className="search-tag">{TAGS[d.tag] ?? d.tag}{d.locale === "en" ? " · EN" : ""}</span>
              <strong>{mark(d.title, re)}</strong>
              <span className="search-snippet">{mark(snippet(d.text, terms), re)}</span>
            </Link>
          </li>
        ))}
      </ul>
      {terms.length > 0 && results.length === 0 && <p className="no-results">ไม่พบผลลัพธ์ ลองคำที่สั้นลงหรือเปลี่ยนตัวกรอง</p>}
    </main>
  );
}
