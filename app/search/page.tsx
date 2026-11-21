import type { Metadata } from "next";
import { getSearchDocs } from "@/lib/search-index";
import { SearchApp } from "../components/search-app";

export const metadata: Metadata = {
  title: "ค้นหา | AIA Study Desk",
  description: "ค้นหาในบทเรียน ตารางเปรียบเทียบ ข้อสอบ และคลังข้อสอบควิซ",
};

export default async function SearchPage() {
  return <SearchApp docs={await getSearchDocs()} />;
}
