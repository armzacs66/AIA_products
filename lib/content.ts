import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

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

function contentDirectory(section: Section) {
  return path.join(process.cwd(), "content", section);
}

function toEntry(section: Section, filename: string, source: string): ContentEntry {
  const { data, content } = matter(source);
  const slug = path.basename(filename, ".mdx");

  if (typeof data.title !== "string" || data.slug !== slug) {
    throw new Error(`Invalid frontmatter in content/${section}/${filename}: title and matching slug are required.`);
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

export async function getEntries(section?: Section): Promise<ContentEntry[]> {
  const selectedSections = section ? [section] : sections.map((item) => item.slug);
  const entries = await Promise.all(
    selectedSections.map(async (item) => {
      const files = await fs.readdir(contentDirectory(item));
      return Promise.all(
        files
          .filter((file) => file.endsWith(".mdx"))
          .map(async (file) => toEntry(item, file, await fs.readFile(path.join(contentDirectory(item), file), "utf8"))),
      );
    }),
  );

  return entries.flat().sort((a, b) => a.title.localeCompare(b.title));
}

export async function getEntry(section: string, slug: string): Promise<ContentEntry | null> {
  if (!isSection(section) || !/^[a-z0-9-]+$/.test(slug)) return null;

  const filePath = path.join(contentDirectory(section), `${slug}.mdx`);
  try {
    const source = await fs.readFile(filePath, "utf8");
    return toEntry(section, `${slug}.mdx`, source);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return null;
    throw error;
  }
}
