import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getEntry } from "@/lib/content";
import { localePath, messages, sectionMessages, type Locale } from "@/lib/i18n";

const mdxComponents = (locale: Locale) => ({
  a: ({ href, ...props }: React.ComponentProps<"a">) =>
    href?.startsWith("/") ? <Link href={href} {...props} /> : <a href={href} {...props} />,
  table: ({ children, ...props }: React.ComponentProps<"table">) => (
    <div
      className="table-scroll"
      role="region"
      aria-label={locale === "th" ? "ตารางที่เลื่อนได้" : "Scrollable table"}
      tabIndex={0}
    >
      <table {...props}>{children}</table>
    </div>
  ),
});

export async function getArticleMetadata(section: string, slug: string, locale: Locale): Promise<Metadata> {
  const entry = await getEntry(section, slug, locale);
  return entry ? { title: `${entry.title} | AIA Study Desk`, description: entry.description ?? `Study notes for ${entry.title}.` } : {};
}

export async function ArticlePage({ params, locale }: { params: Promise<{ section: string; slug: string }>; locale: Locale }) {
  const { section: sectionSlug, slug } = await params;
  const entry = await getEntry(sectionSlug, slug, locale);
  if (!entry) notFound();

  const copy = messages[locale];
  const section = sectionMessages[locale][entry.section];

  return (
    <main className="page-shell article-shell">
      <div className="breadcrumbs">
        <Link href={localePath(locale, "/")}>{copy.home}</Link><span>/</span><Link href={localePath(locale, `/${entry.section}`)}>{section.title}</Link><span>/</span><span>{entry.title}</span>
      </div>
      <article className="article-layout">
        <aside className="article-aside">
          <span className="eyebrow">{section.title.toUpperCase()}</span>
          {entry.category && <span className="aside-category">{entry.category}</span>}
          <Link className="back-link" href={localePath(locale, `/${entry.section}`)}>← {locale === "th" ? `ทั้งหมด: ${section.title}` : `All ${section.title.toLowerCase()}`}</Link>
        </aside>
        <div className="prose">
          <h1 className="article-title">{entry.title}</h1>
          {entry.description && <p className="article-lede">{entry.description}</p>}
          <MDXRemote
            source={entry.content}
            components={mdxComponents(locale)}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
          <p className="source-note">{copy.articleDisclaimer}</p>
        </div>
      </article>
    </main>
  );
}
