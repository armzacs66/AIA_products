"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import "./quiz.css";

export type Topic = "ethics" | "general" | "civil" | "act";
export type Question = {
  id: string;
  topic: Topic;
  q: string;
  choices: string[];
  answer: number;
  explain: string;
  src: string[];
};

type Mode = "practice" | "mock" | "review";
type Item = { q: Question; order: number[] };

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const STORE = "aia-quiz-wrong";
const TOPICS: Record<Topic | "all", string> = {
  all: "ทุกหมวด",
  ethics: "จรรยาบรรณ",
  general: "ความรู้ทั่วไปประกันชีวิต",
  civil: "ประมวลกฎหมายแพ่งฯ",
  act: "พ.ร.บ.ประกันชีวิต/ข้อสอบ",
};
const MOCK_SIZE = 30;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function build(qs: Question[]): Item[] {
  return shuffle(qs).map((q) => ({ q, order: shuffle(q.choices.map((_, i) => i)) }));
}

function loadWrong(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORE) ?? "[]");
  } catch {
    return [];
  }
}

function saveWrong(ids: string[]) {
  try {
    localStorage.setItem(STORE, JSON.stringify(ids));
  } catch {
    // storage unavailable: progress simply is not remembered
  }
}

export function QuizApp({ questions }: { questions: Question[] }) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [items, setItems] = useState<Item[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [showImg, setShowImg] = useState(false);
  const [wrong, setWrong] = useState<string[]>([]);

  useEffect(() => setWrong(loadWrong()), []);

  const start = useCallback(
    (m: Mode) => {
      let pool = topic === "all" ? questions : questions.filter((q) => q.topic === topic);
      if (m === "review") pool = questions.filter((q) => wrong.includes(q.id));
      if (m === "mock") pool = shuffle(questions).slice(0, MOCK_SIZE);
      if (!pool.length) return;
      setItems(build(pool));
      setMode(m);
      setIdx(0);
      setPicked({});
      setShowImg(false);
    },
    [questions, topic, wrong],
  );

  const finished = mode !== null && idx >= items.length;
  const score = useMemo(
    () => items.filter((it) => picked[it.q.id] === it.q.answer).length,
    [items, picked],
  );

  useEffect(() => {
    if (!finished) return;
    const missed = items.filter((it) => picked[it.q.id] !== it.q.answer).map((it) => it.q.id);
    const answered = items.map((it) => it.q.id);
    const next = [...new Set([...wrong.filter((id) => !answered.includes(id)), ...missed])];
    setWrong(next);
    saveWrong(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  if (mode === null) {
    return (
      <main className="quiz">
        <p className="eyebrow">QUIZ · {questions.length} ข้อ</p>
        <h1>ควิซตัวแทนประกันชีวิต</h1>
        <p className="quiz-lead">
          ข้อสอบสร้างจากสไลด์และเฉลยในชั้นอบรม 6 ชั่วโมง (ภาพสไลด์ต้นฉบับแนบในแต่ละข้อ)
          ตัวเลขภาษีเป็นตามสไลด์ที่อบรม โปรดตรวจกฎหมายปัจจุบันก่อนใช้จริง
        </p>
        <div className="quiz-topics" role="radiogroup" aria-label="เลือกหมวด">
          {(Object.keys(TOPICS) as (Topic | "all")[]).map((t) => (
            <button
              key={t}
              role="radio"
              aria-checked={topic === t}
              className={topic === t ? "chip on" : "chip"}
              onClick={() => setTopic(t)}
            >
              {TOPICS[t]}
            </button>
          ))}
        </div>
        <div className="quiz-modes">
          <button className="quiz-card" onClick={() => start("practice")}>
            <strong>ฝึกทำ</strong>
            <span>เฉลยและคำอธิบายทันทีทุกข้อ</span>
          </button>
          <button className="quiz-card" onClick={() => start("mock")}>
            <strong>จำลองสอบ {MOCK_SIZE} ข้อ</strong>
            <span>สุ่มทุกหมวด ดูเฉลยตอนจบ</span>
          </button>
          <button className="quiz-card" disabled={!wrong.length} onClick={() => start("review")}>
            <strong>ทบทวนข้อที่ผิด</strong>
            <span>{wrong.length} ข้อที่เคยตอบผิด</span>
          </button>
        </div>
      </main>
    );
  }

  if (finished) {
    const pct = Math.round((score / items.length) * 100);
    return (
      <main className="quiz">
        <p className="eyebrow">RESULT</p>
        <h1>
          {score} / {items.length} ({pct}%)
        </h1>
        <p className="quiz-lead">{pct >= 70 ? "ผ่านเกณฑ์ 70%" : "ยังไม่ถึงเกณฑ์ 70% ลองทบทวนข้อที่ผิดดู"}</p>
        <ol className="quiz-wrong">
          {items
            .filter((it) => picked[it.q.id] !== it.q.answer)
            .map((it) => (
              <li key={it.q.id}>
                <p>{it.q.q}</p>
                <p className="ok">เฉลย: {it.q.choices[it.q.answer]}</p>
                <p className="why">{it.q.explain}</p>
              </li>
            ))}
        </ol>
        <button className="quiz-btn" onClick={() => setMode(null)}>
          กลับหน้าหลัก
        </button>
      </main>
    );
  }

  const { q, order } = items[idx];
  const chosen = picked[q.id];
  const revealed = mode !== "mock" && chosen !== undefined;

  return (
    <main className="quiz">
      <p className="eyebrow">
        {TOPICS[q.topic]} · ข้อ {idx + 1}/{items.length}
      </p>
      <h2 className="quiz-q">{q.q}</h2>
      <div className="quiz-choices">
        {order.map((ci, pos) => {
          const state = revealed
            ? ci === q.answer
              ? "right"
              : ci === chosen
                ? "bad"
                : ""
            : ci === chosen
              ? "sel"
              : "";
          return (
            <button
              key={ci}
              className={`choice ${state}`}
              disabled={revealed}
              onClick={() => setPicked((p) => ({ ...p, [q.id]: ci }))}
            >
              <b>{["ก", "ข", "ค", "ง"][pos]}.</b> {q.choices[ci]}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className="quiz-explain">
          <p>{chosen === q.answer ? "✅ ถูกต้อง" : "❌ ยังไม่ถูก"}</p>
          <p>{q.explain}</p>
          <button className="quiz-link" onClick={() => setShowImg((s) => !s)}>
            {showImg ? "ซ่อนสไลด์ต้นฉบับ" : "ดูสไลด์ต้นฉบับ"}
          </button>
          {showImg &&
            q.src.map((s) => <img key={s} src={`${BASE}/quiz-img/${s}`} alt={`สไลด์ต้นฉบับ ${s}`} />)}
        </div>
      )}
      <div className="quiz-nav">
        <button className="quiz-link" onClick={() => setMode(null)}>
          ออก
        </button>
        <button
          className="quiz-btn"
          disabled={chosen === undefined}
          onClick={() => {
            setIdx((i) => i + 1);
            setShowImg(false);
          }}
        >
          {idx + 1 === items.length ? "ดูผล" : "ข้อต่อไป"}
        </button>
      </div>
    </main>
  );
}
