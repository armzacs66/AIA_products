"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import "./quiz.css"; // shared .chip / .quiz-topics styles

export type Doc = {
  kind: "page" | "quiz";
  locale: "th" | "en";
  href: string;
  title: string;
  tag: string;
  text: string;
};

type Filter = "all" | "page" | "quiz";
const FILTERS: [Filter, string][] = [["all", "ทั้งหมด"], ["page", "บทเรียน"], ["quiz", "ข้อสอบควิซ"]];
const TAGS: Record<string, string> = {
  products: "ผลิตภัณฑ์", comparisons: "เปรียบเทียบ", exam: "เตรียมสอบ", guides: "คู่มือ", quiz: "ควิซ",
};
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function mark(text: string, re: RegExp | null): ReactNode {
  if (!re) return text;
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}

/** ~170 chars of context starting just before the first matching term. */
function snippet(text: string, terms: string[]): string {
  const lower = text.toLowerCase();
  const at = Math.min(...terms.map((t) => lower.indexOf(t)).filter((i) => i >= 0), text.length);
  const start = Math.max(0, at - 50);
  return (start ? "…" : "") + text.slice(start, start + 170) + (start + 170 < text.length ? "…" : "");
}

export function SearchApp({ docs }: { docs: Doc[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get("q") ?? "");
  }, []);

  const terms = useMemo(() => query.toLowerCase().split(/\s+/).filter(Boolean), [query]);
  const re = useMemo(() => (terms.length ? new RegExp(`(${terms.map(esc).join("|")})`, "gi") : null), [terms]);

  const results = useMemo(() => {
    if (!terms.length) return [];
    return docs
      .filter((d) => filter === "all" || d.kind === filter)
      .map((d) => {
        const title = d.title.toLowerCase();
        const body = d.text.toLowerCase();
        if (!terms.every((t) => title.includes(t) || body.includes(t))) return null;
        return { d, score: terms.reduce((n, t) => n + (title.includes(t) ? 5 : 0) + (body.includes(t) ? 1 : 0), 0) };
      })
      .filter((r): r is { d: Doc; score: number } => r !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);
  }, [docs, terms, filter]);

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
        {results.map(({ d }) => (
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
