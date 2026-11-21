import type { Metadata } from "next";
import { getEntries } from "@/lib/content";
import quiz from "@/content/quiz/questions.json";
import { SearchApp, type Doc } from "../components/search-app";

export const metadata: Metadata = {
  title: "ค้นหา | AIA Study Desk",
  description: "ค้นหาในบทเรียน ตารางเปรียบเทียบ ข้อสอบ และคลังข้อสอบควิซ",
};

/** Drop MDX tags but keep the readable attribute text (labels, notes, tooltip text). */
function toPlain(src: string): string {
  return src
    .replace(/<[^>]+>/g, (tag) =>
      [...tag.matchAll(/(?:label|note|text|title)="([^"]*)"/g)].map((m) => m[1]).join(" ") + " ",
    )
    .replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, " ")
    .replace(/[#*`|>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function SearchPage() {
  const [en, th] = await Promise.all([getEntries(undefined, "en"), getEntries(undefined, "th")]);
  const docs: Doc[] = [
    ...th.map((e) => ({ kind: "page" as const, locale: "th" as const, href: `/th/${e.section}/${e.slug}`, title: e.title, tag: e.section, text: toPlain(`${e.description ?? ""} ${e.content}`) })),
    ...en.map((e) => ({ kind: "page" as const, locale: "en" as const, href: `/${e.section}/${e.slug}`, title: e.title, tag: e.section, text: toPlain(`${e.description ?? ""} ${e.content}`) })),
    ...quiz.map((q) => ({
      kind: "quiz" as const,
      locale: "th" as const,
      href: "/quiz",
      title: q.q,
      tag: "quiz",
      text: toPlain(`เฉลย: ${q.choices[q.answer]} ${q.explain}`),
    })),
  ];
  return <SearchApp docs={docs} />;
}
