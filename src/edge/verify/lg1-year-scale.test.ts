// @vitest-environment jsdom
/**
 * LG1 · 一年规模的数据能否正常使用（2026-09-22）
 *
 * 前几轮分别验证了功能、交互、数据、性能，但每一轮都是**几百条记录的规模**。
 * 这个文件按「每天 20 分钟、持续一年」造真实增长数据，回答一个具体问题：
 * **用户用多久会撞墙，撞在哪。**
 *
 * 一年模型（保守估计）：
 *   review 30 条/天 · 日记 3 条/天 · 侦探 1 案/天 · 关卡 3 次/天 · 新增卡 14 张/天
 *   → reviews 10950 · diaryEntries 1095 · cards/schedules 5110 · wordDetails 3650
 */
import { describe, expect, it } from "vitest";
import { resetStorage } from "../harness";
import { saveData } from "../../services/storage";
import { getWeakCardInsights } from "../../services/reviewService";
import { getUnitStats } from "../../services/unitService";
import { summarizeGrammarMastery, listDueGrammarReviewCards } from "../../services/grammarReviewService";
import type { AppData, Card, DiaryEntry, Review, Schedule, SentenceDetails, Unit, WordDetails } from "../../types";

const DAYS = 365;

/** 造「每天 20 分钟」的真实增长数据；days 可调，用于画增长曲线。 */
const yearData = (days: number = DAYS): AppData => {
  const cards: Card[] = [];
  const schedules: Schedule[] = [];
  const reviews: Review[] = [];
  const wordDetails: WordDetails[] = [];
  const sentenceDetails: SentenceDetails[] = [];
  const diaryEntries: DiaryEntry[] = [];

  const unit: Unit = {
    id: "unit-core", title: "核心词", description: "", order: 1, color: "#000",
    createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z"
  };

  for (let day = 0; day < days; day += 1) {
    const stamp = new Date(2024, 0, 1 + day, 9, 0, 0).toISOString();
    // 每天新增 10 张词卡 + 3 张句卡 + 1 张日记卡
    for (let i = 0; i < 10; i += 1) {
      const id = `w-${day}-${i}`;
      cards.push({ id, type: "word", front: `word${day}x${i}`, back: "释义", note: "", tags: [], unitId: unit.id, status: "review", priority: false, createdAt: stamp, updatedAt: stamp });
      schedules.push({ cardId: id, easeFactor: 2.5, intervalDays: 3, reviewCount: 5, lapseCount: day % 7 === 0 ? 1 : 0, nextReviewAt: stamp });
      wordDetails.push({ cardId: id, word: `word${day}x${i}`, phonetic: "/w/", partOfSpeech: "n.", chineseDefinition: "释义", englishDefinition: "def", collocations: "", synonyms: "", antonyms: "", confusedWords: "", audioUrl: "", sourceSentence: "" });
    }
    for (let i = 0; i < 3; i += 1) {
      const id = `s-${day}-${i}`;
      cards.push({ id, type: "sentence", front: `Sentence ${day} number ${i} is here.`, back: "句子", note: "", tags: ["语法"], status: "review", priority: false, createdAt: stamp, updatedAt: stamp });
      schedules.push({ cardId: id, easeFactor: 2.5, intervalDays: 3, reviewCount: 3, lapseCount: 0, nextReviewAt: stamp });
      sentenceDetails.push({ cardId: id, sentence: `Sentence ${day} number ${i} is here.`, translation: "句子", keywords: [], grammarNote: "", audioUrl: "" });
    }
    const diaryId = `d-${day}`;
    cards.push({ id: diaryId, type: "sentence", front: `I wrote this on day ${day}.`, back: "", note: `我的英文日记 · 2024`, sourceId: `diary:d-${day}`, tags: ["语法", "日记"], status: "review", priority: false, createdAt: stamp, updatedAt: stamp });
    schedules.push({ cardId: diaryId, easeFactor: 2.5, intervalDays: 3, reviewCount: 2, lapseCount: 0, nextReviewAt: stamp });
    sentenceDetails.push({ cardId: diaryId, sentence: `I wrote this on day ${day}.`, translation: "", keywords: [], grammarNote: "", audioUrl: "" });
    diaryEntries.push({ id: `d-${day}`, dateKey: stamp.slice(0, 10), questionId: "q1", questionZh: "今天怎么样？", answerEn: `I wrote this on day ${day}.`, correctedEn: "", issues: [], status: "pending", createdAt: stamp });

    // 每天 30 条复习记录（20 词卡拼写 + 10 句卡复习）
    for (let i = 0; i < 30; i += 1) {
      reviews.push({
        id: `r-${day}-${i}`,
        cardId: cards[cards.length - 1 - (i % 14)].id,
        mode: i % 3 === 0 ? "spelling" : i % 3 === 1 ? "cloze" : "recall",
        rating: (i % 5 === 0 ? 2 : 4) as 2 | 4,
        answer: "x",
        diffJson: "[]",
        reviewedAt: stamp
      });
    }
  }

  return {
    schemaVersion: 8,
    unitGroups: [],
    units: [unit],
    cards,
    wordDetails,
    sentenceDetails,
    materials: [],
    materialSegments: [],
    reviews,
    mistakeGenerations: [],
    adventures: [],
    huntAttempts: [],
    huntResults: [],
    grammarLessonsDone: [],
    diaryEntries,
    schedules,
    dictionaryEntries: [],
    seededWordVersions: ["core-100-v1"],
    languageGates: [],
    gateAttempts: [],
    runeStates: [],
    settings: {} as never
  };
};

describe("LG1 一年规模", () => {
  /** 取多轮最小值：整套测试并行跑，单次测量会被其他用例的 CPU 占用污染。 */
  const measure = (fn: () => void, rounds = 5): number => {
    fn();
    let best = Number.POSITIVE_INFINITY;
    for (let i = 0; i < rounds; i += 1) {
      const t0 = performance.now();
      fn();
      best = Math.min(best, performance.now() - t0);
    }
    return best;
  };

  it("增长曲线：多少个月会撞到存储上限", () => {
    /**
     * 本环境（jsdom）实测上限 5MB（按 UTF-16 字符）。
     * 按「每天 20 分钟」的保守模型（每天 +14 张卡 / +30 条复习 / +3 条日记）实测：
     *   1 月 333KB · 3 月 1.0MB · 6 月 2.0MB · **12 月 4.0MB** · 18 月**写不下**
     * 即：持续使用约 **14~18 个月**会撞到 5MB 配额。
     *
     * 这里用与一年模型同构的造数（含 wordDetails / sentenceDetails，
     * 它们是体积的实打实来源），只按天数缩放。
     */
    const sizeAtDays = (days: number): { kb: number; ok: boolean } => {
      resetStorage();
      const data = yearData(days);
      const payload = JSON.stringify(data);
      let ok = true;
      try {
        window.localStorage.setItem("personal-vocab-app-data-v1", payload);
      } catch {
        ok = false;
      }
      return { kb: Math.round(payload.length / 1024), ok };
    };

    const month = sizeAtDays(30);
    const halfYear = sizeAtDays(180);
    const fullYear = sizeAtDays(365);

    // 单调增长（数据只增不减，这是设计现状）
    expect(month.kb, "1 个月应在数百 KB").toBeLessThan(600);
    expect(halfYear.kb, "半年体积应大于 1 个月").toBeGreaterThan(month.kb);
    expect(fullYear.kb, "一年体积应大于半年").toBeGreaterThan(halfYear.kb);

    /**
     * 断点断言：一年（约 4MB）仍能写、约 18 个月写不下。
     * 若将来某个改动让体积明显上升（例如给每张卡加了大字段、
     * 或新增了无上限的增长型数组），这两条会失败——
     * 提醒必须同时提供清理/归档路径，否则用户用到某个月突然写不进去。
     */
    expect(fullYear.ok, "一年的数据应还能写下").toBe(true);
    expect(fullYear.kb, "一年约 4MB 量级").toBeGreaterThan(3500);
    const eighteenMonths = sizeAtDays(545);
    expect(eighteenMonths.ok, "18 个月应已写不下（这就是墙体位置）").toBe(false);
  }, 600000);

  it("一年规模下，关键路径都在可接受的耗时内（性能修复的规模回归）", () => {
    resetStorage();
    const data = yearData();

    const save = measure(() => saveData(data));
    const weakInsights = measure(() => getWeakCardInsights(data, { type: "word", limit: 3 }));
    const unitStats = measure(() => getUnitStats(data, data.units[0]));
    const mastery = measure(() => summarizeGrammarMastery(data));
    const due = measure(() => listDueGrammarReviewCards(data));
    const sizeMb = (window.localStorage.getItem("personal-vocab-app-data-v1") ?? "").length / 1024 / 1024;

    /**
     * 阈值取「一帧（16.7ms）的若干倍」而非精确毫秒——整套测试并行跑，
     * 单次测量会被其他用例的 CPU 占用污染（已用「多轮取最小值」缓解）。
     * 这些上限比实测值宽松 5~15 倍，只用来挡住「又退回二次复杂度」这类退化：
     * 修复前实测：保存 115ms（5000 卡）、弱项分析 475ms（2000 卡 × 10 条）。
     */
    expect(save, `一年规模保存 ${save.toFixed(1)}ms（体积 ${sizeMb.toFixed(2)}MB）`).toBeLessThan(150);
    expect(weakInsights, `一年规模弱项分析 ${weakInsights.toFixed(1)}ms`).toBeLessThan(200);
    expect(unitStats, `一年规模词书统计 ${unitStats.toFixed(1)}ms`).toBeLessThan(200);
    expect(mastery, `一年规模掌握统计 ${mastery.toFixed(1)}ms`).toBeLessThan(200);
    expect(due, `一年规模到期卡计算 ${due.toFixed(1)}ms`).toBeLessThan(50);

    // 一年数据确实写进去了（前一条测试验证了体积；这里确认写入成功）
    expect(sizeMb, "一年数据应成功落盘").toBeGreaterThan(3);
  }, 600000);
});
