import type { Metadata } from "next";
import questions from "@/content/quiz/questions.json";
import { QuizApp, type Question } from "../components/quiz-app";

export const metadata: Metadata = {
  title: "ควิซตัวแทนประกันชีวิต | AIA Study Desk",
  description: "แบบฝึกหัดและจำลองสอบหลักสูตรขอรับใบอนุญาตตัวแทนประกันชีวิต 6 ชั่วโมง",
};

export default function QuizPage() {
  return <QuizApp questions={questions as Question[]} />;
}
