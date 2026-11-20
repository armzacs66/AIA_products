import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getEntries, getEntry, sections } from "@/lib/content";

const mdxComponents = {
  a: ({ href, ...props }: React.ComponentProps<"a">) =>
    href?.startsWith("/") ? <Link href={href} {...props} /> : <a href={href} {...props} />,
};

export async function generateStaticParams() {
  const entries = await getEntries();
  return entries.map(({ section, slug }) => ({ section, slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string; slug: string }> }): Promise<Metadata> {
  const { section, slug } = await params;
  const entry = await getEntry(section, slug);
  return entry ? { title: `${entry.title} | AIA Study Desk`, description: entry.description ?? `Study notes for ${entry.title}.` } : {};
}

export default async function EntryPage({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section: sectionSlug, slug } = await params;
  const entry = await getEntry(sectionSlug, slug);
  if (!entry) notFound();

  const section = sections.find((item) => item.slug === entry.section)!;

  return (
    <main className="page-shell article-shell">
      <div className="breadcrumbs">
        <Link href="/">Home</Link><span>/</span><Link href={`/${entry.section}`}>{section.title}</Link><span>/</span><span>{entry.title}</span>
      </div>
      <article className="article-layout">
        <aside className="article-aside">
          <span className="eyebrow">{section.title.toUpperCase()}</span>
          {entry.category && <span className="aside-category">{entry.category}</span>}
          <Link className="back-link" href={`/${entry.section}`}>← All {section.title.toLowerCase()}</Link>
        </aside>
        <div className="prose">
          <h1 className="article-title">{entry.title}</h1>
          {entry.description && <p className="article-lede">{entry.description}</p>}
          <MDXRemote source={entry.content} components={mdxComponents} />
          <p className="source-note">Study aid only. Product terms and eligibility can change; verify against current official policy documents.</p>
        </div>
      </article>
    </main>
  );
}
