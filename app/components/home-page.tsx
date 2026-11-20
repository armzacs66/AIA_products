import Link from "next/link";
import { getEntries, sections } from "@/lib/content";
import { localePath, messages, sectionMessages, type Locale } from "@/lib/i18n";
import { KnowledgeSearch } from "./knowledge-search";

export async function HomePage({ locale }: { locale: Locale }) {
  const copy = messages[locale];
  const entries = await getEntries(undefined, locale);
  const searchEntries = entries.map(({ title, slug, section, category, description, content }) => ({
    title,
    slug,
    section,
    category,
    description,
    searchText: content.toLowerCase(),
  }));

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{copy.heroEyebrow}</p>
          <h1>{copy.heroLead} <em>{copy.heroEmphasis}</em></h1>
          <p className="hero-description">{copy.heroDescription}</p>
          <KnowledgeSearch entries={searchEntries} locale={locale} />
          <p className="search-hint">{copy.searchHint}</p>
        </div>
        <div className="hero-note" aria-hidden="true">
          <span className="note-label">{copy.noteLabel}</span>
          <span className="note-line note-line-short" />
          <span className="note-script">{copy.noteLead}<br />{copy.noteEmphasis}</span>
          <span className="note-line" />
          <span className="note-foot">{copy.noteFoot}</span>
        </div>
      </section>

      <section className="library-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.libraryEyebrow}</p>
            <h2>{copy.libraryTitle}</h2>
          </div>
          <span className="entry-count">{entries.length} {copy.noteCountPlural}</span>
        </div>
        <div className="library-grid">
          {sections.map((section, index) => {
            const sectionCopy = sectionMessages[locale][section.slug];
            const count = entries.filter((entry) => entry.section === section.slug).length;
            return (
              <Link className="library-card" href={localePath(locale, `/${section.slug}`)} key={section.slug}>
                <span className="card-index">0{index + 1}</span>
                <span className="card-arrow" aria-hidden="true">↗</span>
                <h3>{sectionCopy.title}</h3>
                <p>{sectionCopy.description}</p>
                <span className="card-count">{count} {locale === "th" ? copy.noteCountPlural : count === 1 ? copy.noteCount : copy.noteCountPlural}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.quickEyebrow}</p>
            <h2>{copy.popularTitle}</h2>
          </div>
          <Link className="text-link" href={localePath(locale, "/products")}>{copy.browseProducts} <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="popular-list">
          {entries.filter((entry) => ["health-happy", "ci-plus", "20-pay-life", "endowment-15-25"].includes(entry.slug)).map((entry) => (
            <Link className="popular-item" href={localePath(locale, `/${entry.section}/${entry.slug}`)} key={`${entry.section}/${entry.slug}`}>
              <span className="popular-category">{entry.category ?? sectionMessages[locale][entry.section].title}</span>
              <span className="popular-title">{entry.title}</span>
              <span className="popular-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
