// @vitest-environment jsdom
/**
 * PF6c · 遥测解析次数的来源归因
 *
 * 两个问题：
 *  A. 零进度挂载就有 ~36 次遥测解析，它们来自哪几个 useMemo？
 *  B. `readCompletedAt`（每张已完成课卡的每个 stage 各调一次）贡献了多少？
 *     —— 把「展开同一个季、只改该季里已完成课数」做对照，隔离出每张已完成课卡的边际成本。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { act } from "react";
import { mountPage, resetStorage } from "../harness";
import { clickElement } from "./drive";
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

const cards = () => cardsToData(Array.from({ length: 150 }, (_, i) =>
  makeSentenceCard({ id: `card-${i}`, sentence: `Sentence number ${i}.`, schedule: { nextReviewAt: PAST_ISO } })));

describe("PF6c · 遥测解析来源归因", () => {
  beforeEach(() => resetStorage());

  it("A. 零进度挂载：哪几个统计消费遥测（16 种 kind 各 1 次 + 其他）", async () => {
    const allIds = grammarLessons.map((l) => l.id);
    seedAppData({ grammarLessonsDone: [], ...cards() });
    seedTelemetry(1500, allIds);
    const counter = countReads();
    try {
      const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
      await settle();
      const s = counter.get();
      console.log(`【零进度挂载】遥测解析 ${s.count} 次（${(s.bytes / 1024).toFixed(0)}KB，纯解析 ${s.parseMs.toFixed(1)}ms）`);
      console.log("  来源（源码位置）：");
      console.log("    GrammarPathPage.tsx:637 computeWeakSpotsReport  → 6 种 kind × 1 次 = 6");
      console.log("    GrammarPathPage.tsx:639 buildWeakSpotNarrative → 内部再算一次 report（+6）+ 2 种 kind 再各 1 次（+2）");
      console.log("    GrammarPathPage.tsx:641 findActiveIntervention → 2 种 kind（+2）");
      console.log("    grammarOutputService.buildLastWeekReport（:720 useState 初值）→ computeWeeklyEffectiveOutput + weeklyErrorTagCounts×2");
      console.log("    GrammarPathPage.tsx:634 summarizeLessonProgress → 不读遥测");
      console.log("    GrammarPathPage.tsx:636 buildGrammarReviewSession → 不读遥测");
      console.log("    GrammarPathPage.tsx:611 appendGrammarEvent（进入埋点）→ readEvents 1 次 + writeEvents");
      console.log("    GrammarReplayPage 的 replayAvailable → buildReplayLesson 不读遥测");
      page.unmount();
    } finally {
      counter.restore();
    }
    expect(true).toBe(true);
  });

  it("B. 固定展开同一季，只改该季已完成课数 → 每张已完成课卡的边际遥测解析次数", async () => {
    const allIds = grammarLessons.map((l) => l.id);
    // 第 1 季（1–12 课，12 张课卡）固定为展开的季；只改这一季里已完成几课
    const rows: Array<{ doneInSeason: number; reads: number; ms: number }> = [];
    for (const doneInSeason of [0, 3, 6, 9, 12]) {
      resetStorage();
      seedAppData({ grammarLessonsDone: allIds.slice(0, doneInSeason), ...cards() });
      seedTelemetry(1500, allIds);
      const counter = countReads();
      try {
        const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
        await settle();
        // 默认展开「下一课」所在季；已完课数变化会让默认季漂移 → 显式展开第 1 季
        const seasonCards = Array.from(page.container.querySelectorAll(".season-card"));
        const first = seasonCards[0];
        if (!first?.className.includes("is-open")) clickElement(first?.querySelector(".season-card-head"));
        counter.reset();
        // 再切一次，确保「展开第 1 季」这一次交互被完整计量
        const s2 = Array.from(page.container.querySelectorAll(".season-card"))[0];
        if (s2?.className.includes("is-open")) clickElement(s2.querySelector(".season-card-head"));
        const s3 = Array.from(page.container.querySelectorAll(".season-card"))[0];
        if (!s3?.className.includes("is-open")) clickElement(s3.querySelector(".season-card-head"));
        const s = counter.get();
        const cardCount = page.container.querySelectorAll(".lesson-path-card").length;
        rows.push({ doneInSeason, reads: s.count, ms: s.parseMs });
        console.log(
          `  第 1 季内已完成 ${String(doneInSeason).padStart(2)} 课（该季共 ${cardCount} 张课卡）→ 展开该季的交互触发遥测解析 ${String(s.count).padStart(2)} 次（纯解析 ${s.parseMs.toFixed(1)}ms）`
        );
        page.unmount();
      } finally {
        counter.restore();
      }
    }
    console.log("【边际成本】同一季内每多一张已完成课卡：");
    for (let i = 1; i < rows.length; i += 1) {
      const d = rows[i].doneInSeason - rows[i - 1].doneInSeason;
      const dReads = rows[i].reads - rows[i - 1].reads;
      if (d > 0) console.log(`  +${d} 张已完成课卡 → +${dReads} 次遥测解析（${(dReads / d).toFixed(2)} 次/张）`);
    }
    expect(rows[rows.length - 1].reads).toBeGreaterThanOrEqual(rows[0].reads);
  });
});
