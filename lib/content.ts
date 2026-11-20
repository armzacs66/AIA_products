import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "./i18n";

export const sections = [
  { slug: "products", title: "Products", description: "Understand core policies, health cover, and riders." },
  { slug: "comparisons", title: "Comparisons", description: "Compare plans and choose by protection goal." },
  { slug: "exam", title: "Exam prep", description: "Review key facts, waiting periods, and common traps." },
  { slug: "guides", title: "Study guides", description: "Build a study plan and navigate product choices." },
] as const;

export type Section = (typeof sections)[number]["slug"];

export type ContentEntry = {
  title: string;
  slug: string;
  section: Section;
  category?: string;
  description?: string;
  content: string;
};

export function isSection(value: string): value is Section {
  return sections.some((section) => section.slug === value);
}

function contentDirectory(section: Section, locale: Locale) {
  return path.join(process.cwd(), "content", ...(locale === "th" ? ["th"] : []), section);
}

function toEntry(section: Section, filename: string, source: string, locale: Locale): ContentEntry {
  const { data, content } = matter(source);
  const slug = path.basename(filename, ".mdx");

  if (typeof data.title !== "string" || data.slug !== slug) {
    const directory = locale === "th" ? `content/th/${section}` : `content/${section}`;
    throw new Error(`Invalid frontmatter in ${directory}/${filename}: title and matching slug are required.`);
  }

  return {
    title: data.title,
    slug,
    section,
    category: typeof data.category === "string" ? data.category : undefined,
    description: typeof data.description === "string" ? data.description : undefined,
    content,
  };
}

export async function getEntries(section?: Section, locale: Locale = "en"): Promise<ContentEntry[]> {
  const selectedSections = section ? [section] : sections.map((item) => item.slug);
  const entries = await Promise.all(
    selectedSections.map(async (item) => {
      const directory = contentDirectory(item, locale);
      const files = await fs.readdir(directory);
      return Promise.all(
        files
          .filter((file) => file.endsWith(".mdx"))
          .map(async (file) => toEntry(item, file, await fs.readFile(path.join(directory, file), "utf8"), locale)),
      );
    }),
  );

  return entries.flat().sort((a, b) => a.title.localeCompare(b.title));
}

export async function getEntry(section: string, slug: string, locale: Locale = "en"): Promise<ContentEntry | null> {
  if (!isSection(section) || !/^[a-z0-9-]+$/.test(slug)) return null;

  const filePath = path.join(contentDirectory(section, locale), `${slug}.mdx`);
  try {
    const source = await fs.readFile(filePath, "utf8");
    return toEntry(section, `${slug}.mdx`, source, locale);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return null;
    throw error;
  }
}
