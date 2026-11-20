import type { Metadata } from "next";
import { getEntries } from "@/lib/content";
import { ArticlePage, getArticleMetadata } from "@/app/components/article-page";

export async function generateStaticParams() {
  const entries = await getEntries(undefined, "th");
  return entries.map(({ section, slug }) => ({ section, slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string; slug: string }> }): Promise<Metadata> {
  const { section, slug } = await params;
  return getArticleMetadata(section, slug, "th");
}

export default function ThaiArticlePage({ params }: { params: Promise<{ section: string; slug: string }> }) {
  return <ArticlePage params={params} locale="th" />;
}
