import type { Section } from "./content";

export type Locale = "en" | "th";

type Messages = {
  brand: string;
  home: string;
  navProducts: string;
  navCompare: string;
  navExam: string;
  navGuides: string;
  mainNav: string;
  switchLanguage: string;
  languageName: string;
  heroEyebrow: string;
  heroLead: string;
  heroEmphasis: string;
  heroDescription: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchHint: string;
  searchResults: string;
  noResults: string;
  libraryEyebrow: string;
  libraryTitle: string;
  noteCount: string;
  noteCountPlural: string;
  quickEyebrow: string;
  popularTitle: string;
  browseProducts: string;
  libraryPrefix: string;
  readNote: string;
  articleDisclaimer: string;
  footerDisclaimer: string;
  clearSearch: string;
  noteLabel: string;
  noteLead: string;
  noteEmphasis: string;
  noteFoot: string;
};

export const messages: Record<Locale, Messages> = {
  en: {
    brand: "STUDY DESK",
    home: "Home",
    navProducts: "Products",
    navCompare: "Compare",
    navExam: "Exam prep",
    navGuides: "Guides",
    mainNav: "Main navigation",
    switchLanguage: "Switch language to Thai",
    languageName: "ไทย",
    heroEyebrow: "YOUR PRODUCT KNOWLEDGE, IN ONE PLACE",
    heroLead: "Make the details",
    heroEmphasis: "make sense.",
    heroDescription: "A clear, searchable desk reference for AIA product features, comparisons, and exam prep.",
    searchLabel: "Search the study notes",
    searchPlaceholder: "Search products, benefits, exam notes...",
    searchHint: "Try “waiting period”, “cancer”, or “premium waiver”",
    searchResults: "Search results",
    noResults: "No notes found. Try a product name or benefit.",
    libraryEyebrow: "THE LIBRARY",
    libraryTitle: "Start with what you need",
    noteCount: "study note",
    noteCountPlural: "study notes",
    quickEyebrow: "QUICK LOOK",
    popularTitle: "Popular study notes",
    browseProducts: "Browse products",
    libraryPrefix: "THE LIBRARY",
    readNote: "Read note",
    articleDisclaimer: "Study aid only. Product terms and eligibility can change; verify against current official policy documents.",
    footerDisclaimer: "Study notes for learning purposes. Confirm current terms in official policy documents.",
    clearSearch: "Clear search",
    noteLabel: "STUDY NOTE 01",
    noteLead: "Know what",
    noteEmphasis: "you’re comparing.",
    noteFoot: "PRODUCTS · BENEFITS · EXAM",
  },
  th: {
    brand: "คลังความรู้",
    home: "หน้าแรก",
    navProducts: "ผลิตภัณฑ์",
    navCompare: "เปรียบเทียบ",
    navExam: "เตรียมสอบ",
    navGuides: "คู่มือ",
    mainNav: "เมนูหลัก",
    switchLanguage: "เปลี่ยนภาษาเป็นอังกฤษ",
    languageName: "English",
    heroEyebrow: "รวมความรู้ผลิตภัณฑ์ไว้ในที่เดียว",
    heroLead: "เข้าใจรายละเอียด",
    heroEmphasis: "ได้ง่ายขึ้น",
    heroDescription: "คู่มือค้นหาข้อมูลผลิตภัณฑ์ AIA เปรียบเทียบความคุ้มครอง และทบทวนเนื้อหาสำหรับสอบ",
    searchLabel: "ค้นหาโน้ตความรู้",
    searchPlaceholder: "ค้นหาผลิตภัณฑ์ ความคุ้มครอง หรือข้อสอบ...",
    searchHint: "ลองค้นหา “ระยะเวลารอคอย” “มะเร็ง” หรือ “ยกเว้นเบี้ย”",
    searchResults: "ผลการค้นหา",
    noResults: "ไม่พบโน้ตที่ตรงกัน ลองค้นหาชื่อผลิตภัณฑ์หรือความคุ้มครอง",
    libraryEyebrow: "คลังความรู้",
    libraryTitle: "เลือกหัวข้อที่ต้องการ",
    noteCount: "หัวข้อ",
    noteCountPlural: "หัวข้อ",
    quickEyebrow: "เนื้อหาที่น่าสนใจ",
    popularTitle: "โน้ตยอดนิยม",
    browseProducts: "ดูผลิตภัณฑ์ทั้งหมด",
    libraryPrefix: "คลังความรู้",
    readNote: "อ่านโน้ต",
    articleDisclaimer: "เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น รายละเอียดและเงื่อนไขอาจเปลี่ยนแปลง โปรดตรวจสอบกรมธรรม์และเอกสารทางการฉบับล่าสุด",
    footerDisclaimer: "เอกสารเพื่อการศึกษา โปรดตรวจสอบเงื่อนไขล่าสุดจากเอกสารกรมธรรม์ทางการ",
    clearSearch: "ล้างคำค้นหา",
    noteLabel: "โน้ตความรู้ 01",
    noteLead: "ทำความเข้าใจ",
    noteEmphasis: "ก่อนเปรียบเทียบ",
    noteFoot: "ผลิตภัณฑ์ · ผลประโยชน์ · เตรียมสอบ",
  },
};

export const sectionMessages: Record<Locale, Record<Section, { title: string; description: string }>> = {
  en: {
    products: { title: "Products", description: "Understand core policies, health cover, and riders." },
    comparisons: { title: "Comparisons", description: "Compare plans and choose by protection goal." },
    exam: { title: "Exam prep", description: "Review key facts, waiting periods, and common traps." },
    guides: { title: "Study guides", description: "Build a study plan and navigate product choices." },
  },
  th: {
    products: { title: "ผลิตภัณฑ์", description: "ทำความเข้าใจแบบประกันหลัก ความคุ้มครองสุขภาพ และสัญญาเพิ่มเติม" },
    comparisons: { title: "เปรียบเทียบ", description: "เปรียบเทียบแผนและเลือกตามเป้าหมายความคุ้มครอง" },
    exam: { title: "เตรียมสอบ", description: "ทบทวนข้อเท็จจริง ระยะเวลารอคอย และประเด็นที่มักสับสน" },
    guides: { title: "คู่มือการเรียน", description: "วางแผนการเรียนและทำความเข้าใจการเลือกผลิตภัณฑ์" },
  },
};

export function localePath(locale: Locale, pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (locale === "en") return path;
  return path === "/" ? "/th" : `/th${path}`;
}
