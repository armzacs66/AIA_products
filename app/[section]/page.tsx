import { sections } from "@/lib/content";
import { SectionPage } from "@/app/components/section-page";

export function generateStaticParams() {
  return sections.map(({ slug }) => ({ section: slug }));
}

export default function EnglishSectionPage({ params }: { params: Promise<{ section: string }> }) {
  return <SectionPage params={params} locale="en" />;
}
