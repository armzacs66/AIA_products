import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntries, isSection, sections } from "@/lib/content";

export function generateStaticParams() {
  return sections.map(({ slug }) => ({ section: slug }));
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: slug } = await params;
  if (!isSection(slug)) notFound();

  const section = sections.find((item) => item.slug === slug)!;
  const entries = await getEntries(slug);

  return (
    <main className="page-shell">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>{section.title}</span></div>
      <div className="page-intro">
        <p className="eyebrow">THE LIBRARY / {section.title.toUpperCase()}</p>
        <h1>{section.title}</h1>
        <p>{section.description}</p>
      </div>
      <div className="article-grid">
        {entries.map((entry, index) => (
          <Link className="article-card" href={`/${entry.section}/${entry.slug}`} key={entry.slug}>
            <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="card-arrow" aria-hidden="true">↗</span>
            {entry.category && <span className="article-category">{entry.category}</span>}
            <h2>{entry.title}</h2>
            <p>{entry.description ?? `A concise reference from the ${section.title.toLowerCase()} library.`}</p>
            <span className="read-link">Read note <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </div>
    </main>
  );
}
