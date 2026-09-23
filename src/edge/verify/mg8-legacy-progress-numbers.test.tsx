// @vitest-environment jsdom
/**
 * MG8 · 用户可见进度是否被误报（2026-09-22）
 *
 * 第 5 条要求：老数据升级后，页面上的**数字**必须与老数据的实际内容一致——
 * 补默认值时最容易出现「凭空多出 / 少掉若干」。
 *
 * 本文件把「页面文本里的数字」与「老数据实际内容」逐项对照：
 *   1. 课程进度 `X / N 课`
 *   2. 掌握数 `已掌握 N / 共 M 句`
 *   3. 复习到期数 `N 张到期`
 *   4. 词书 / 词库的卡数
 *   5. 侦探页 `已破案 N / M`
 *   6. 日记页 `已写 N 条 / 覆盖 N 天 / 已批改 N`
 *   7. 首页「到期 N 个单词」
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarPathPage from "../../pages/GrammarPathPage";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import GrammarDiaryPage from "../../pages/GrammarDiaryPage";
import GrammarHuntPage from "../../pages/GrammarHuntPage";
import TodayPage from "../../pages/TodayPage";
import LibraryPage from "../../pages/LibraryPage";
import { grammarLessons } from "../../data/grammarLessons";
import { huntCases } from "../../data/huntCases";
import { getDueCards, getLearningStats } from "../../services/reviewService";
import { summarizeGrammarMastery } from "../../services/grammarReviewService";
import { summarizeLessonProgress } from "../../services/lessonService";
import { summarizeDiaryProgress } from "../../services/diaryService";
import { summarizeHuntProgress } from "../../services/huntService";
import { seedAppData } from "./fixtures";
import { LEGACY_ISO, LESSON_ID, LESSON_SENTENCE, legacyBase, legacyCard, legacySchedule } from "./mgLegacy";

if (typeof window !== "undefined" && !window.matchMedia) {
  (window as unknown as { matchMedia: unknown }).matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false
  });
}
if (typeof window !== "undefined" && !(window as unknown as { ResizeObserver?: unknown }).ResizeObserver) {
  class NoopResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = NoopResizeObserver;
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = NoopResizeObserver;
}

const textOf = (page: ReturnType<typeof mountPage>): string => page.text().replace(/\s+/g, " ");

describe("MG8-1 课程进度 X / N 课", () => {
  beforeEach(() => resetStorage());

  it("老数据完成 3 课 → 页头显示 3 / 197（与 grammarLessonsDone 长度一致）", () => {
    const done = grammarLessons.slice(0, 3).map((lesson) => lesson.id);
    const data = seedAppData(legacyBase({ grammarLessonsDone: done }) as never);
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const pill = page.container.querySelector('[aria-label="课程进度"]')?.textContent ?? "";
    expect(pill.replace(/\s+/g, " ").trim()).toBe(`3 / ${grammarLessons.length} 课`);
    expect(summarizeLessonProgress(data).done, "服务层与页面口径一致").toBe(3);
    page.unmount();
  });

  it("★ 老数据里含一条已消失的课 id → 数字按「现有课程」算，不虚高", () => {
    const data = seedAppData(
      legacyBase({
        grammarLessonsDone: [grammarLessons[0].id, "lesson-已经删除的课"]
      }) as never
    );
    const summary = summarizeLessonProgress(data);
    expect(summary.done, "只数得到真实存在的课程（lessonService.ts:471）").toBe(1);
    expect(summary.total).toBe(grammarLessons.length);
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const pill = page.container.querySelector('[aria-label="课程进度"]')?.textContent ?? "";
    expect(pill.replace(/\s+/g, " ").trim()).toBe(`1 / ${grammarLessons.length} 课`);
    page.unmount();
  });

  it("★ 全部 204 课完成的老数据：页头显示 197 / 197，不出现 198 或溢出", () => {
    const data = seedAppData(
      legacyBase({ grammarLessonsDone: grammarLessons.map((lesson) => lesson.id) }) as never
    );
    expect(summarizeLessonProgress(data).done).toBe(grammarLessons.length);
    expect(summarizeLessonProgress(data).nextLesson, "全部完成时应没有下一课").toBeNull();
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const pill = page.container.querySelector('[aria-label="课程进度"]')?.textContent ?? "";
    expect(pill.replace(/\s+/g, " ").trim()).toBe(`${grammarLessons.length} / ${grammarLessons.length} 课`);
    expect(page.text(), "全部完成时应给「去复习巩固」而不是空白").toContain("全部课程已完成");
    page.unmount();
  });

  it("★ 老数据 grammarLessonsDone 含重复 id → 页头数字被虚报（未去重）", () => {
    const duplicated = [grammarLessons[0].id, grammarLessons[0].id, grammarLessons[1].id];
    const data = seedAppData(legacyBase({ grammarLessonsDone: duplicated }) as never);
    const summary = summarizeLessonProgress(data);
    // summarizeLessonProgress 用 filter(存在于 Done 集合) 计数，所以重复不会翻倍——先记录实际结论。
    expect(summary.done, "filter 口径天然去重，重复 id 不会让数字虚高").toBe(2);
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const pill = page.container.querySelector('[aria-label="课程进度"]')?.textContent ?? "";
    expect(pill.replace(/\s+/g, " ").trim()).toBe(`2 / ${grammarLessons.length} 课`);
    page.unmount();
  });

  it("季内进度 X / Y 课只在「非当前季且未完成」时显示（数字不越界）", () => {
    const done = grammarLessons.slice(0, 3).map((lesson) => lesson.id);
    seedAppData(legacyBase({ grammarLessonsDone: done }) as never);
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const metas = Array.from(page.container.querySelectorAll(".season-card-meta")).map((node) =>
      (node.textContent ?? "").trim()
    );
    expect(metas.length, "28 个季卡都应有状态文案").toBe(28);
    // 每个季的「X / Y 课」里 X <= Y
    for (const meta of metas) {
      const match = /^(\d+) \/ (\d+) 课$/.exec(meta);
      if (!match) continue;
      expect(Number(match[1]), `季进度 ${meta} 的分子不该大于分母`).toBeLessThanOrEqual(Number(match[2]));
    }
    page.unmount();
  });
});

describe("MG8-2 语法掌握数 已掌握 N / 共 M 句", () => {
  beforeEach(() => resetStorage());

  const seedGrammarCards = (cards: Array<Record<string, unknown>>, schedules: Array<Record<string, unknown>>) =>
    seedAppData(
      legacyBase({ cards, schedules, sentenceDetails: cards.map((card) => ({
        cardId: card.id,
        sentence: card.front,
        translation: "",
        keywords: [],
        grammarNote: "",
        audioUrl: ""
      })) }) as never
    );

  it("3 张语法卡（1 mastered / 1 复习轨道 / 1 新）→ 已掌握 1 / 共 3 句", () => {
    const data = seedGrammarCards(
      [
        legacyCard({ id: "g1", type: "sentence", front: LESSON_SENTENCE, tags: ["语法"], status: "mastered" }),
        legacyCard({ id: "g2", type: "sentence", front: "I am reading a book.", tags: ["语法"], status: "review" }),
        legacyCard({ id: "g3", type: "sentence", front: "I am eating lunch.", tags: ["语法"], status: "new" })
      ],
      [legacySchedule("g2"), legacySchedule("g3", { reviewCount: 0, intervalDays: 0 })]
    );
    const mastery = summarizeGrammarMastery(data);
    expect(mastery).toMatchObject({ mastered: 1, total: 3, inProgress: 1, notStarted: 1 });
    seedGrammarCards(
      [
        legacyCard({ id: "g1", type: "sentence", front: LESSON_SENTENCE, tags: ["语法"], status: "mastered" }),
        legacyCard({ id: "g2", type: "sentence", front: "I am reading a book.", tags: ["语法"], status: "review" }),
        legacyCard({ id: "g3", type: "sentence", front: "I am eating lunch.", tags: ["语法"], status: "new" })
      ],
      [legacySchedule("g2"), legacySchedule("g3", { reviewCount: 0, intervalDays: 0 })]
    );
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    const text = textOf(page);
    expect(text, "页头掌握条应显示真实数字").toContain("已掌握 1");
    expect(text).toContain("共 3 句");
    expect(text).toContain("进行中 1");
    expect(text).toContain("未开始 1");
    page.unmount();
  });

  it("★ 暂停的语法卡不计入「共 M 句」（与总数口径一致，不虚高）", () => {
    const data = seedGrammarCards(
      [
        legacyCard({ id: "g1", type: "sentence", front: LESSON_SENTENCE, tags: ["语法"], status: "mastered" }),
        legacyCard({
          id: "g2",
          type: "sentence",
          front: "I am reading a book.",
          tags: ["语法"],
          status: "suspended",
          suspendedFrom: "review"
        })
      ],
      [legacySchedule("g2")]
    );
    expect(summarizeGrammarMastery(data).total, "suspended 被排除（grammarReviewService.ts:203）").toBe(1);
    expect(getLearningStats(data).suspendedCards, "学习统计里暂停卡单独计数").toBe(1);
  });

  it("★ 无 tags 语法卡不计入「共 M 句」→ 掌握进度条分母偏小（与 MG5-B 同源）", () => {
    const data = seedGrammarCards(
      [
        legacyCard({ id: "g1", type: "sentence", front: LESSON_SENTENCE, tags: ["语法"], status: "mastered" }),
        legacyCard({ id: "g2", type: "sentence", front: "I am reading a book.", status: "review" })
      ],
      [legacySchedule("g2")]
    );
    const mastery = summarizeGrammarMastery(data);
    expect(mastery.total, "分母只算带标签的 1 张").toBe(1);
    expect(mastery.mastered, "分子 1").toBe(1);
    // 实际库里 2 张语法来源句子卡 → 页面显示「已掌握 1 / 共 1 句」（100%），而真实是 1/2。
    const realSentenceCards = data.cards.filter((card) => card.type === "sentence").length;
    expect(realSentenceCards, "库里实际有 2 张句子卡").toBe(2);
  });

  it("零语法卡 → 不渲染掌握条（不显示 0 / 0）", () => {
    seedAppData(legacyBase({}) as never);
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    expect(page.container.querySelector(".grammar-mastery-bar"), "mastery.total === 0 时整块不渲染").toBeNull();
    expect(textOf(page), "不该出现 0 / 0 之类的空比率").not.toContain("共 0 句");
    page.unmount();
  });
});

describe("MG8-3 复习到期数", () => {
  beforeEach(() => resetStorage());

  it("到期数与 getDueCards 实际结果一致（页头「N 张到期」== 队列长度）", () => {
    const data = seedAppData(
      legacyBase({
        // 需要至少完成 1 课，地图页才会渲染「语法复习 · N 张到期」入口
        // （首访分支 summary.done === 0 只给「从第 1 课开始」，见 GrammarPathPage.tsx:893-931）
        grammarLessonsDone: [grammarLessons[0].id],
        cards: [
          legacyCard({ id: "g1", type: "sentence", front: LESSON_SENTENCE, tags: ["语法"], status: "review" }),
          legacyCard({ id: "g2", type: "sentence", front: "I am reading a book.", tags: ["语法"], status: "review" }),
          legacyCard({ id: "g3", type: "sentence", front: "I am eating lunch.", tags: ["语法"], status: "review" })
        ],
        schedules: [
          legacySchedule("g1"),
          legacySchedule("g2"),
          // g3 排在未来 → 不到期
          legacySchedule("g3", { nextReviewAt: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString() })
        ]
      }) as never
    );
    const due = getDueCards(data);
    expect(due.map((card) => card.id)).toEqual(["g1", "g2"]);
    expect(getLearningStats(data).dueTotal, "到期总数").toBe(2);
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    /**
     * 措辞已从「N 张到期」改为「N 句到期」（2026-09-22 走查修复）：
     * 这里的队列装的是**句子**，量词用「句」比「张」准确（「张」用于卡片）。
     */
    expect(textOf(page), "地图页的到期提示").toContain("2 句到期");
    page.unmount();
  });

  it("★ 零进度老用户：地图页不显示「N 张到期」入口（有到期卡也看不到）", () => {
    // 首访分支（grammarLessonsDone 为空）不渲染该入口——如果老数据里只有
    // 「复习轨道卡 + 0 完成课」，到期卡在语法地图上没有任何提示。
    seedAppData(
      legacyBase({
        grammarLessonsDone: [],
        cards: [
          legacyCard({ id: "g1", type: "sentence", front: LESSON_SENTENCE, tags: ["语法"], status: "review" })
        ],
        schedules: [legacySchedule("g1")]
      }) as never
    );
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const text = textOf(page);
    expect(text, "首访分支只给「从第 1 课开始」").toContain("从第 1 课开始");
    expect(text, "到期卡数量不会出现在地图页（入口整体缺席）").not.toContain("张到期");
    page.unmount();
  });

  it("★ 会话上限生效时，页头到期数与会话长度不同（两者口径不同，需分别显示）", () => {
    const cards = Array.from({ length: 15 }, (_, index) =>
      legacyCard({
        id: `g${index + 1}`,
        type: "sentence",
        front: `I am drawing picture number ${index + 1}.`,
        tags: ["语法"],
        status: "review"
      })
    );
    const data = seedAppData(
      legacyBase({ cards, schedules: cards.map((card) => legacySchedule(String(card.id))) }) as never
    );
    expect(getLearningStats(data).dueTotal, "15 张卡全部到期（地图页会显示 15 张到期）").toBe(15);
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    expect(textOf(page), "复习页会话上限 10 张（第 1 / 10 张）").toContain("第 1 / 10 张");
    page.unmount();
  });

  it("新卡不计入到期数（不把「还没开始学」误报成「今天要复习」）", () => {
    const data = seedAppData(
      legacyBase({
        cards: [
          legacyCard({ id: "n1", front: "apple", back: "苹果", status: "new" }),
          legacyCard({ id: "n2", front: "pear", back: "梨", status: "new" })
        ]
      }) as never
    );
    expect(getLearningStats(data).dueTotal, "到期 0").toBe(0);
    expect(getLearningStats(data).newCards, "新卡另有计数").toBe(2);
    expect(getLearningStats(data).availableNewWords).toBe(2);
    const page = mountPage(<TodayPage />, "/today", "/today");
    expect(textOf(page), "首页应把新词与到期分开说").toContain("2 个新词还在队列里");
    page.unmount();
  });

  it("★ 缺 schedules 的老数据里 status=review 的卡被补成「立即到期」→ 首页到期数凭空变大", () => {
    const data = seedAppData(
      legacyBase({
        cards: [
          legacyCard({ id: "r1", front: "apple", back: "苹果", status: "review" }),
          legacyCard({ id: "r2", front: "pear", back: "梨", status: "review" }),
          legacyCard({ id: "r3", front: "plum", back: "李子", status: "review" })
        ]
      }) as never
    );
    expect(
      getLearningStats(data).dueTotal,
      "老数据原本没有排期，迁移补的 nextReviewAt=now 让 3 张卡一次性到期"
    ).toBe(3);
    const page = mountPage(<TodayPage />, "/today", "/today");
    expect(textOf(page), "首页把 3 个词报成今天到期").toContain("3 个单词");
    page.unmount();
  });
});

describe("MG8-4 词书 / 词库卡数", () => {
  beforeEach(() => resetStorage());

  it("词库的卡数与老数据 cards 实际条数一致（不做隐式补种）", () => {
    const data = seedAppData(
      legacyBase({
        seededWordVersions: ["core-100-v1"],
        cards: [
          legacyCard({ id: "w1", front: "apple", back: "苹果", status: "review" }),
          legacyCard({ id: "w2", front: "pear", back: "梨", status: "review" }),
          legacyCard({ id: "s1", type: "sentence", front: LESSON_SENTENCE, tags: ["语法"], status: "review" })
        ]
      }) as never
    );
    expect(data.cards.length, "已有 core-100-v1 标记 → 不再补种 100 张卡").toBe(3);
    const page = mountPage(<LibraryPage />, "/library", "/library");
    expect(textOf(page).length, "词库页应正常渲染").toBeGreaterThan(100);
    page.unmount();
  });

  it("★ 无 seededWordVersions 的老数据 → 被补种 100 张内置核心词（卡数凭空多 100）", () => {
    // seededWordVersions 是较晚引入的字段；缺失时 seedCoreWords 会真的插卡（storage.ts:1027-1084）。
    const seedNoVersions = seedAppData(
      legacyBase({
        seededWordVersions: [],
        cards: [legacyCard({ id: "w1", front: "apple", back: "苹果", status: "review" })]
      }) as never
    );
    expect(
      seedNoVersions.cards.length,
      "原有 1 张卡 + 补种的核心词卡（100 个词里与 apple 重复的会被跳过）"
    ).toBeGreaterThan(90);
    expect(seedNoVersions.schedules.length, "补种的卡也各有一条计划").toBe(seedNoVersions.cards.length);
    expect(
      seedNoVersions.cards.some((card) => card.note === "内置核心词"),
      "补种卡的标记"
    ).toBe(true);
  });

  it("★ 补种的核心词卡会立刻进入拼写队列候选（新词配额内），是老用户没建过的内容", () => {
    const data = seedAppData(
      legacyBase({
        seededWordVersions: [],
        cards: [legacyCard({ id: "w1", front: "zzz-not-a-core-word", back: "自定义", status: "review" })]
      }) as never
    );
    const injected = data.cards.filter((card) => card.note === "内置核心词");
    expect(injected.length, "补种数量 = 核心词表里与已有卡不重复的词数").toBeGreaterThan(90);
    for (const card of injected) {
      expect(card.status, "补种卡是 new（不直接进到期队列）").toBe("new");
      expect(card.tags, "带「核心100」标签").toEqual(["核心100"]);
    }
    const stats = getLearningStats(data);
    expect(stats.dueTotal, "补种卡不进到期数").toBe(1);
    expect(stats.availableNewWords, "但会占满今日新词队列").toBe(injected.length);
  });
});

describe("MG8-5 侦探页 已破案 N / M", () => {
  beforeEach(() => resetStorage());

  it("无记录 → 0 / 案件总数（与 huntCases 实际条数一致）", () => {
    seedAppData(legacyBase({}) as never);
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    const text = textOf(page);
    expect(text, `应显示 0 / ${huntCases.length}`).toContain(`0 / ${huntCases.length}`);
    page.unmount();
  });

  it("有 2 条完案记录 → 2 / 案件总数", () => {
    const seeded = huntCases.slice(0, 2).map((caseItem, index) => ({
      id: `hr${index}`,
      caseId: caseItem.id,
      found: caseItem.errors.length,
      total: caseItem.errors.length,
      misses: 0,
      stars: 3,
      durationMs: 30000,
      finishedAt: LEGACY_ISO
    }));
    seedAppData(legacyBase({ huntResults: seeded }) as never);
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    expect(textOf(page)).toContain(`2 / ${huntCases.length}`);
    page.unmount();
  });

  it("已破案数不会因同一案件多条结算而重复计数", () => {
    const caseItem = huntCases[0];
    const data = seedAppData(
      legacyBase({
        huntResults: [
          {
            id: "hr1",
            caseId: caseItem.id,
            found: caseItem.errors.length,
            total: caseItem.errors.length,
            misses: 2,
            stars: 1,
            durationMs: 30000,
            finishedAt: LEGACY_ISO
          },
          {
            id: "hr2",
            caseId: caseItem.id,
            found: caseItem.errors.length,
            total: caseItem.errors.length,
            misses: 0,
            stars: 3,
            durationMs: 20000,
            finishedAt: LEGACY_ISO
          }
        ]
      }) as never
    );
    expect(summarizeHuntProgress(data).solvedCaseIds, "solvedCaseIds 按案件去重").toEqual([caseItem.id]);
    expect(summarizeHuntProgress(data).totalMisses, "但误判数是累计的（2 + 0）").toBe(2);
  });
});

describe("MG8-6 日记页 已写 N 条 / 覆盖 N 天 / 已批改 N", () => {
  beforeEach(() => resetStorage());

  it("老数据 3 条（2 天、1 条 done）→ 数字与内容一致", () => {
    const data = seedAppData(
      legacyBase({
        diaryEntries: [
          legacyDiaryEntryWith({ id: "d1", dateKey: "2024-01-01", status: "done", issues: [{ original: "go", correction: "went", explanation: "" }] }),
          legacyDiaryEntryWith({ id: "d2", dateKey: "2024-01-01", status: "pending", issues: [] }),
          legacyDiaryEntryWith({ id: "d3", dateKey: "2024-01-02", status: "done", issues: [] })
        ]
      }) as never
    );
    const summary = summarizeDiaryProgress(data);
    expect(summary).toMatchObject({ totalEntries: 3, days: 2, correctedCount: 2 });
    seedAppData(
      legacyBase({
        diaryEntries: [
          legacyDiaryEntryWith({ id: "d1", dateKey: "2024-01-01", status: "done", issues: [{ original: "go", correction: "went", explanation: "" }] }),
          legacyDiaryEntryWith({ id: "d2", dateKey: "2024-01-01", status: "pending", issues: [] }),
          legacyDiaryEntryWith({ id: "d3", dateKey: "2024-01-02", status: "done", issues: [] })
        ]
      }) as never
    );
    const page = mountPage(<GrammarDiaryPage />, "/grammar/diary", "/grammar/diary");
    const bar = page.container.querySelector('[aria-label="日记进度"]')?.textContent ?? "";
    const normalized = bar.replace(/\s+/g, "");
    expect(normalized, "已写条数 / 覆盖天数 / 已批改").toBe("3已写条数2覆盖天数2已批改");
    page.unmount();
  });

  it("★ 缺 status 的老日记全部落为 pending → 「已批改」显示 0（数字低于用户直觉）", () => {
    const entry = { ...legacyDiaryEntryWithout("status") };
    const data = seedAppData(legacyBase({ diaryEntries: [entry] }) as never);
    expect(summarizeDiaryProgress(data).correctedCount, "缺 status 一律 pending").toBe(0);
    expect(summarizeDiaryProgress(data).totalEntries, "但条目本身还在").toBe(1);
  });
});

/** 造一条字段可裁剪的日记。 */
const legacyDiaryEntryWith = (patch: Record<string, unknown>): Record<string, unknown> => ({
  id: "diary_x",
  dateKey: "2024-01-01",
  questionId: "q_x",
  questionZh: "今天你做了什么？",
  answerEn: "I go to park yesterday.",
  correctedEn: "",
  issues: [],
  status: "pending",
  createdAt: LEGACY_ISO,
  ...patch
});

const legacyDiaryEntryWithout = (key: string): Record<string, unknown> => {
  const entry = legacyDiaryEntryWith({});
  delete entry[key];
  return entry;
};
