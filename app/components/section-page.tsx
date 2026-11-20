import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntries, isSection } from "@/lib/content";
import { localePath, messages, sectionMessages, type Locale } from "@/lib/i18n";

export async function SectionPage({ params, locale }: { params: Promise<{ section: string }>; locale: Locale }) {
  const { section: slug } = await params;
  if (!isSection(slug)) notFound();

  const copy = messages[locale];
  const section = sectionMessages[locale][slug];
  const entries = await getEntries(slug, locale);

  return (
    <main className="page-shell">
      <div className="breadcrumbs"><Link href={localePath(locale, "/")}>{copy.home}</Link><span>/</span><span>{section.title}</span></div>
      <div className="page-intro">
        <p className="eyebrow">{copy.libraryPrefix} / {section.title.toUpperCase()}</p>
        <h1>{section.title}</h1>
        <p>{section.description}</p>
      </div>
      <div className="article-grid">
        {entries.map((entry, index) => (
          <Link className="article-card" href={localePath(locale, `/${entry.section}/${entry.slug}`)} key={entry.slug}>
            <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="card-arrow" aria-hidden="true">↗</span>
            {entry.category && <span className="article-category">{entry.category}</span>}
            <h2>{entry.title}</h2>
            <p>{entry.description ?? `${section.title}`}</p>
            <span className="read-link">{copy.readNote} <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </div>
    </main>
  );
}
