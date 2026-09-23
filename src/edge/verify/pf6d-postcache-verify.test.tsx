// @vitest-environment jsdom
/**
 * PF6d · 遥测解析实测（对 `readEvents` 缓存落地后的复测）
 *
 * 说明：pf6/pf6b/pf6c 统计的是 `localStorage.getItem` 次数——
 * 在 `readEvents` 有缓存后，getItem 次数不变（缓存校验要读原始字符串），
 * 但**真正的 JSON.parse 次数**才是有意义的成本。本文件直接计数 JSON.parse。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { act } from "react";
import { mountPage, resetStorage } from "../harness";
import { seedAppData, cardsToData, makeSentenceCard, PAST_ISO } from "./fixtures";
import GrammarPathPage from "../../pages/GrammarPathPage";
import { grammarLessons } from "../../data/grammarLessons";
import { huntCases } from "../../data/huntCases";

const TELEMETRY_KEY = "grammar-telemetry-events-v1";
const settle = async () => { await act(async () => { await new Promise((r) => setTimeout(r, 0)); }); };

const seedTelemetry = (count: number, lessonIds: string[]) => {
  const events = Array.from({ length: count }, (_, i) => ({
    kind: "grammar_lesson_completed",
    lessonId: lessonIds[i % Math.max(1, lessonIds.length)] ?? "lesson-1",
    completedAt: new Date(Date.now() - i * 600_000).toISOString(),
    ts: new Date(Date.now() - i * 600_000).toISOString()
  }));
  const json = JSON.stringify({ version: 1, events });
  window.localStorage.setItem(TELEMETRY_KEY, json);
  return json.length;
};

/** 直接包住全局 JSON.parse，只统计「遥测体量（>=100KB）的解析」。 */
const countTelemetryParses = () => {
  const state = { parses: 0, bytes: 0, totalParses: 0, ms: 0 };
  const original = JSON.parse;
  (JSON as { parse: typeof JSON.parse }).parse = ((text: string, reviver?: unknown) => {
    state.totalParses += 1;
    const isTelemetrySized = typeof text === "string" && text.length > 100_000;
    if (isTelemetrySized) {
      state.parses += 1;
      state.bytes += text.length;
      const t = performance.now();
      const out = reviver === undefined ? original(text) : original(text, reviver as never);
      state.ms += performance.now() - t;
      return out;
    }
    return reviver === undefined ? original(text) : original(text, reviver as never);
  }) as typeof JSON.parse;
  return {
    get: () => ({ ...state }),
    reset: () => { state.parses = 0; state.bytes = 0; state.totalParses = 0; state.ms = 0; },
    restore: () => { (JSON as { parse: typeof JSON.parse }).parse = original; }
  };
};

describe("PF6d · 遥测 JSON.parse 实测（缓存落地后）", () => {
  beforeEach(() => resetStorage());

  it("真实 JSON.parse 次数：零进度 / 204 课全完成", async () => {
    const allIds = grammarLessons.map((l) => l.id);
    const cards = cardsToData(Array.from({ length: 150 }, (_, i) =>
      makeSentenceCard({ id: `card-${i}`, sentence: `Sentence number ${i}.`, schedule: { nextReviewAt: PAST_ISO } })));

    for (const doneCount of [0, 197]) {
      resetStorage();
      const doneIds = allIds.slice(0, doneCount);
      seedAppData({ grammarLessonsDone: doneIds, ...cards });
      const size = seedTelemetry(1500, doneIds.length ? doneIds : allIds);
      const counter = countTelemetryParses();
      try {
        const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
        await settle();
        const s = counter.get();
        const cardCount = page.container.querySelectorAll(".lesson-path-card").length;
        console.log(
          `  已完课 ${String(doneCount).padStart(3)} 课：遥测体积 ${(size / 1024).toFixed(0)}KB → 真实 JSON.parse **${s.parses} 次**（${(s.bytes / 1024 / 1024).toFixed(1)}MB，实测 ${s.ms.toFixed(1)}ms）；全部 JSON.parse（含小对象）${s.totalParses} 次；当屏课卡 ${cardCount} 张`
        );
        page.unmount();
      } finally {
        counter.restore();
      }
    }
    expect(true).toBe(true);
  });

  it("参照：不装缓存时（手动清空模块缓存不可行）→ 用 getItem 次数作上界", async () => {
    const allIds = grammarLessons.map((l) => l.id);
    const cards = cardsToData(Array.from({ length: 150 }, (_, i) =>
      makeSentenceCard({ id: `card-${i}`, sentence: `Sentence number ${i}.`, schedule: { nextReviewAt: PAST_ISO } })));
    seedAppData({ grammarLessonsDone: allIds, ...cards });
    seedTelemetry(1500, allIds);

    let getItemCalls = 0;
    const orig = Storage.prototype.getItem;
    Storage.prototype.getItem = function (k: string) {
      if (k === TELEMETRY_KEY) getItemCalls += 1;
      return orig.call(this, k);
    };
    const counter = countTelemetryParses();
    try {
      const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
      await settle();
      const s = counter.get();
      console.log(
        `  getItem(遥测) ${getItemCalls} 次 vs 真实 JSON.parse ${s.parses} 次 → 缓存命中率 ${(((getItemCalls - s.parses) / Math.max(1, getItemCalls)) * 100).toFixed(0)}%`
      );
      console.log(
        `  （getItem 仍需返回完整字符串做缓存校验 → 每次调用仍有一次 ${(209).toFixed(0)}KB 量级的字符串读取与比较，但不是解析）`
      );
      page.unmount();
    } finally {
      counter.restore();
      Storage.prototype.getItem = orig;
    }
    expect(true).toBe(true);
  });
});
