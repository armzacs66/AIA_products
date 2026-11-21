import type { ReactNode } from "react";

export type Doc = {
  kind: "page" | "quiz";
  locale: "th" | "en";
  href: string;
  title: string;
  tag: string;
  text: string;
};

export const TAGS: Record<string, string> = {
  products: "ผลิตภัณฑ์", comparisons: "เปรียบเทียบ", exam: "เตรียมสอบ", guides: "คู่มือ", quiz: "ควิซ",
};

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const toTerms = (q: string) => q.toLowerCase().split(/\s+/).filter(Boolean);

export const termRegex = (terms: string[]) =>
  terms.length ? new RegExp(`(${terms.map(esc).join("|")})`, "gi") : null;

export function mark(text: string, re: RegExp | null): ReactNode {
  if (!re) return text;
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}

/** ~170 chars of context starting just before the first matching term. */
export function snippet(text: string, terms: string[], len = 170): string {
  const lower = text.toLowerCase();
  const at = Math.min(...terms.map((t) => lower.indexOf(t)).filter((i) => i >= 0), text.length);
  const start = Math.max(0, at - 50);
  return (start ? "…" : "") + text.slice(start, start + len) + (start + len < text.length ? "…" : "");
}

/** AND-match every term in title or body; title hits rank higher. */
export function rank(docs: Doc[], terms: string[]): Doc[] {
  if (!terms.length) return [];
  return docs
    .map((d) => {
      const title = d.title.toLowerCase();
      const body = d.text.toLowerCase();
      if (!terms.every((t) => title.includes(t) || body.includes(t))) return null;
      return { d, score: terms.reduce((n, t) => n + (title.includes(t) ? 5 : 0) + (body.includes(t) ? 1 : 0), 0) };
    })
    .filter((r): r is { d: Doc; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.d);
}
