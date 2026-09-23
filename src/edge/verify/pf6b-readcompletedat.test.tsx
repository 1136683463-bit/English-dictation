// @vitest-environment jsdom
/**
 * PF6b · `readCompletedAt` 逐课卡重解析遥测 —— 放大系数与「已完课数」的关系
 *
 * GrammarPathPage.tsx:742-745
 *   const readCompletedAt = (lessonId) => {
 *     const events = listGrammarEventsByKind("grammar_lesson_completed")...  // ← 全量 JSON.parse
 *   }
 * 该函数在 renderStageChain(lesson)（:760）里被每个 stage（共 3 个）调一次 getLessonStageLock，
 * 而 renderStageChain 对**每张已完成课卡**都执行。
 *
 * 本文件把「已完课数」做自变量，测挂载期遥测解析次数，验证线性关系与最坏值。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { act } from "react";
import { mountPage, resetStorage } from "../harness";
import { seedAppData, cardsToData, makeSentenceCard, PAST_ISO } from "./fixtures";
import GrammarPathPage from "../../pages/GrammarPathPage";
import { grammarLessons } from "../../data/grammarLessons";

const TELEMETRY_KEY = "grammar-telemetry-events-v1";
const settle = async () => { await act(async () => { await new Promise((r) => setTimeout(r, 0)); }); };

const seedTelemetry = (count: number, lessonIds: string[]) => {
  const events = Array.from({ length: count }, (_, i) => ({
    kind: "grammar_lesson_completed",
    lessonId: lessonIds[i % Math.max(1, lessonIds.length)] ?? "lesson-1",
    completedAt: new Date(Date.now() - i * 600_000).toISOString(),
    ts: new Date(Date.now() - i * 600_000).toISOString()
  }));
  window.localStorage.setItem(TELEMETRY_KEY, JSON.stringify({ version: 1, events }));
};

const countReads = () => {
  let count = 0, bytes = 0, parseMs = 0;
  const orig = Storage.prototype.getItem;
  Storage.prototype.getItem = function (k: string) {
    const v = orig.call(this, k);
    if (k === TELEMETRY_KEY && v) {
      count += 1; bytes += v.length;
      const t = performance.now(); JSON.parse(v); parseMs += performance.now() - t;
    }
    return v;
  };
  return { get: () => ({ count, bytes, parseMs }), reset: () => { count = 0; bytes = 0; parseMs = 0; }, restore: () => { Storage.prototype.getItem = orig; } };
};

describe("PF6b · readCompletedAt 放大系数 vs 已完课数", () => {
  beforeEach(() => resetStorage());

  it("已完课数 0 / 12 / 60 / 197 → 挂载期遥测解析次数", async () => {
    const cards = cardsToData(Array.from({ length: 150 }, (_, i) =>
      makeSentenceCard({ id: `card-${i}`, sentence: `Sentence number ${i}.`, schedule: { nextReviewAt: PAST_ISO } })));
    const allIds = grammarLessons.map((l) => l.id);
    const rows: Array<{ done: number; reads: number; kb: number; ms: number }> = [];

    for (const doneCount of [0, 12, 60, 197]) {
      resetStorage();
      const doneIds = allIds.slice(0, doneCount);
      seedAppData({ grammarLessonsDone: doneIds, ...cards });
      seedTelemetry(1500, doneIds.length ? doneIds : allIds);
      const counter = countReads();
      try {
        const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
        await settle();
        const s = counter.get();
        const lessonCards = page.container.querySelectorAll(".lesson-path-card").length;
        rows.push({ done: doneCount, reads: s.count, kb: s.bytes / 1024, ms: s.parseMs });
        console.log(
          `  已完课 ${String(doneCount).padStart(3)} 课 → 挂载期遥测解析 ${String(s.count).padStart(3)} 次（${(s.bytes / 1024).toFixed(0)}KB，纯解析 ${s.parseMs.toFixed(1)}ms）；当屏渲染课卡 ${lessonCards} 张`
        );
        page.unmount();
      } finally {
        counter.restore();
      }
    }
    console.log("【线性验证】已完课数 → 遥测解析次数");
    for (let i = 1; i < rows.length; i += 1) {
      const prev = rows[i - 1], cur = rows[i];
      const dReads = cur.reads - prev.reads, dDone = cur.done - prev.done;
      if (dDone > 0) console.log(`  ${prev.done}→${cur.done} 课：解析次数 ${prev.reads}→${cur.reads}（每课 +${(dReads / dDone).toFixed(2)} 次）`);
    }
    expect(rows[rows.length - 1].reads).toBeGreaterThan(rows[0].reads);
  });

  it("常驻内存的遥测上限（3000 条 / 419KB）下单张课卡的边际成本", async () => {
    const allIds = grammarLessons.map((l) => l.id);
    const cards = cardsToData(Array.from({ length: 150 }, (_, i) =>
      makeSentenceCard({ id: `card-${i}`, sentence: `Sentence number ${i}.`, schedule: { nextReviewAt: PAST_ISO } })));
    seedAppData({ grammarLessonsDone: allIds, ...cards });
    seedTelemetry(1500, allIds);
    const raw = window.localStorage.getItem(TELEMETRY_KEY)!;
    JSON.parse(raw);
    const t0 = performance.now();
    for (let i = 0; i < 20; i += 1) JSON.parse(raw);
    const perParse = (performance.now() - t0) / 20;
    console.log(`【满容量】单次 JSON.parse ${perParse.toFixed(2)}ms（jsdom，20 次均值，${(raw.length / 1024).toFixed(0)}KB）`);

    const counter = countReads();
    try {
      const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
      await settle();
      const s = counter.get();
      const cards16 = page.container.querySelectorAll(".lesson-path-card").length;
      console.log(`  挂载 + 落定：遥测解析 ${s.count} 次，折合 ${(s.count * perParse).toFixed(0)}ms 纯解析（jsdom）`);
      console.log(`  → 平均每张当屏课卡 ${(s.count / Math.max(1, cards16)).toFixed(1)} 次解析 ≈ ${((s.count * perParse) / Math.max(1, cards16)).toFixed(1)}ms/课卡`);
      page.unmount();
    } finally {
      counter.restore();
    }
    expect(perParse).toBeGreaterThan(0);
  });
});
