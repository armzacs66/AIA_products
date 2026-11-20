import Link from "next/link";
import { KnowledgeSearch } from "./components/knowledge-search";
import { getEntries, sections } from "@/lib/content";

export default async function HomePage() {
  const entries = await getEntries();
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
          <p className="eyebrow">YOUR PRODUCT KNOWLEDGE, IN ONE PLACE</p>
          <h1>Make the details <em>make sense.</em></h1>
          <p className="hero-description">A clear, searchable desk reference for AIA product features, comparisons, and exam prep.</p>
          <KnowledgeSearch entries={searchEntries} />
          <p className="search-hint">Try “waiting period”, “cancer”, or “premium waiver”</p>
        </div>
        <div className="hero-note" aria-hidden="true">
          <span className="note-label">STUDY NOTE 01</span>
          <span className="note-line note-line-short" />
          <span className="note-script">Know what<br />you&apos;re comparing.</span>
          <span className="note-line" />
          <span className="note-foot">PRODUCTS · BENEFITS · EXAM</span>
        </div>
      </section>

      <section className="library-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE LIBRARY</p>
            <h2>Start with what you need</h2>
          </div>
          <span className="entry-count">{entries.length} study notes</span>
        </div>
        <div className="library-grid">
          {sections.map((section, index) => {
            const count = entries.filter((entry) => entry.section === section.slug).length;
            return (
              <Link className="library-card" href={`/${section.slug}`} key={section.slug}>
                <span className="card-index">0{index + 1}</span>
                <span className="card-arrow" aria-hidden="true">↗</span>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
                <span className="card-count">{count} {count === 1 ? "note" : "notes"}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">QUICK LOOK</p>
            <h2>Popular study notes</h2>
          </div>
          <Link className="text-link" href="/products">Browse products <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="popular-list">
          {entries.filter((entry) => ["health-happy", "ci-plus", "20-pay-life", "endowment-15-25"].includes(entry.slug)).map((entry) => (
            <Link className="popular-item" href={`/${entry.section}/${entry.slug}`} key={`${entry.section}/${entry.slug}`}>
              <span className="popular-category">{entry.category ?? sections.find((section) => section.slug === entry.section)?.title}</span>
              <span className="popular-title">{entry.title}</span>
              <span className="popular-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
