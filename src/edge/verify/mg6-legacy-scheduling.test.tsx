// @vitest-environment jsdom
/**
 * MG6 · 老数据 → 间隔重复的行为一致性（2026-09-22）
 *
 * 三条待验证的机制（都是「补默认值」最容易带来语义错误的地方）：
 *   A. `schedules` 完全缺失 → `normalizeSchedules` 会补 `intervalDays: 0 / nextReviewAt: now`
 *      （storage.ts:880-887）——这些卡会不会**立刻**涌进复习队列？
 *   B. `nextReviewAt` 是过去时间 / 非法字符串 / 缺失时，卡是否被正确视为「到期」？
 *   C. `reviews` 缺失时，依赖历史记录的功能（弱点统计、掌握判定、连击）会不会崩或误报？
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import { flushAsync } from "./drive";
import ReviewPage from "../../pages/ReviewPage";
import GrammarPathPage from "../../pages/GrammarPathPage";
import SpellingPage from "../../pages/SpellingPage";
import StatsPage from "../../pages/StatsPage";
import TodayPage from "../../pages/TodayPage";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import { buildSpellingQueue } from "../../services/spellingQueueService";
import {
  getDueCards,
  getLearningStats,
  getNewCardsForToday,
  getWeakCardInsights,
  getWeakCards,
  getWeakStats
} from "../../services/reviewService";
import { getMistakeGroupsByDate } from "../../services/mistakeBookService";
import { buildGrammarReviewSession, listDueGrammarReviewCards } from "../../services/grammarReviewService";
import { computeStreak } from "../../services/statsService";
import { seedAppData } from "./fixtures";
import { readAppData } from "./fixtures";
import { LEGACY_ISO, LESSON_ID, LESSON_SENTENCE, legacyBase, legacyCard, legacySchedule } from "./mgLegacy";

/**
 * jsdom 缺 matchMedia / ResizeObserver（StatsPage 与日记历史列表依赖它们）。
 * 与 a11y2-dom-scan.test.tsx 用同一份最小垫片——这是**环境缺失**，不是老数据缺陷。
 */
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

/** 页面文本里的占位词扫描（第 4 条全站红线）。 */
const PLACEHOLDER_PATTERN = /\bNaN\b|\bundefined\b|\bnull\b|Invalid Date/;

describe("MG6-A schedules 完全缺失", () => {
  beforeEach(() => resetStorage());

  const seedNoSchedules = (cardPatches: Array<Record<string, unknown>> = [{}]) =>
    seedAppData(
      legacyBase({
        cards: cardPatches.map((patch, index) =>
          legacyCard({ id: `c${index + 1}`, front: `word${index + 1}`, back: `词${index + 1}`, ...patch })
        )
        // 故意不写 schedules 键
      }) as never
    );

  it("迁移为每张缺计划的卡补一条默认计划（intervalDays 0 / 立即到期）", () => {
    const data = seedNoSchedules([{ status: "review" }, { status: "new" }]);
    expect(data.schedules.length, "每张卡都该有一条计划（storage.ts:914-918）").toBe(2);
    for (const schedule of data.schedules) {
      expect(schedule.intervalDays).toBe(0);
      expect(schedule.reviewCount).toBe(0);
      expect(new Date(schedule.nextReviewAt).getTime(), "nextReviewAt 应为「现在」").toBeLessThanOrEqual(Date.now());
    }
  });

  it("★ 复习轨道卡（status=review）缺计划 → 立刻计入「到期」，不是等明天", () => {
    const data = seedNoSchedules([{ status: "review" }, { status: "learning" }]);
    expect(
      getDueCards(data).map((card) => card.id),
      "补出来的 nextReviewAt=now 使这两张卡立刻到期（reviewService.ts:110-131）"
    ).toEqual(["c1", "c2"]);
    expect(getLearningStats(data).dueTotal, "首页/复习页的到期数会立刻变成 2").toBe(2);
  });

  it("新卡（status=new）缺计划 → 不进「到期」，只走每日新词配额（正确）", () => {
    const data = seedNoSchedules([{ status: "new" }, { status: "new" }]);
    expect(getDueCards(data), "新卡不该被算成到期（R1 口径）").toEqual([]);
    expect(getNewCardsForToday(data, { type: "word" }).length, "新卡走 New cards/day 配额").toBe(2);
    expect(getLearningStats(data).dueTotal, "到期数应为 0").toBe(0);
  });

  it("★ 语法复习队列与通用复习队列口径不一致：同一批卡一边进、一边不进", () => {
    const data = seedAppData(
      legacyBase({
        cards: [
          legacyCard({ id: "g1", type: "sentence", front: LESSON_SENTENCE, tags: ["语法"], status: "review" }),
          legacyCard({ id: "g2", type: "sentence", front: "I am reading a book.", tags: ["语法"], status: "review" })
        ]
      }) as never
    );
    expect(getDueCards(data).length, "通用复习队列：两张都被补成「立即到期」→ 进场").toBe(2);
    expect(
      listDueGrammarReviewCards(data).length,
      "语法复习队列：neverQueuedSchedule 把「三字段都是初始值」的卡排除 → 不进场（grammarReviewService.ts:58-59）"
    ).toBe(0);
    expect(buildGrammarReviewSession(data).length).toBe(0);
  });

  it("语法复习页在「schedule 全缺」的老数据上显示空态，且无占位词", () => {
    seedAppData(
      legacyBase({
        cards: [legacyCard({ id: "g1", type: "sentence", front: LESSON_SENTENCE, tags: ["语法"], status: "review" })]
      }) as never
    );
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    expect(page.has("今天没有到期的语法复习"), "应显示空态而不是假装有题").toBe(true);
    expect(PLACEHOLDER_PATTERN.test(page.text()), "空态文案不得出现占位词").toBe(false);
    page.unmount();
  });

  it("补出默认计划后卡不会「永远不进」复习：被复习过一次就回到队列", () => {
    const data = seedNoSchedules([{ status: "review" }]);
    const first = getDueCards(data);
    expect(first.length).toBe(1);
    // 复习一次后 reviewCount=1、intervalDays>0 → neverQueuedSchedule 不再成立
    const afterReview = { ...data, schedules: [{ ...data.schedules[0], reviewCount: 1, intervalDays: 1 }] };
    const grammarData = {
      ...afterReview,
      cards: afterReview.cards.map((card) => ({ ...card, type: "sentence" as const, tags: ["语法"] }))
    };
    expect(
      listDueGrammarReviewCards({ ...grammarData, schedules: [{ ...grammarData.schedules[0], nextReviewAt: LEGACY_ISO }] })
        .length,
      "复习过一次的卡会正常进入语法复习队列（不是永久排除）"
    ).toBe(1);
  });

  it("拼写队列在缺 schedules 的老数据上不崩，且按「到期优先」出词", () => {
    const data = seedNoSchedules([{ status: "review" }, { status: "review" }]);
    const queue = buildSpellingQueue(data, null, "standard", 30);
    expect(queue.length, "到期词应进场").toBe(2);
    expect(queue.every((card) => card.type === "word")).toBe(true);
  });
});

describe("MG6-B nextReviewAt 的三种老数据形态", () => {
  beforeEach(() => resetStorage());

  const seedWithNextReviewAt = (nextReviewAt: unknown, extra: Record<string, unknown> = {}) =>
    seedAppData(
      legacyBase({
        cards: [legacyCard({ id: "c1", front: "apple", back: "苹果", status: "review" })],
        schedules: [
          {
            cardId: "c1",
            easeFactor: 2.5,
            intervalDays: 4,
            reviewCount: 2,
            lapseCount: 0,
            ...(nextReviewAt === undefined ? {} : { nextReviewAt }),
            ...extra
          }
        ]
      }) as never
    );

  it("过去时间 → 视为到期（正确）", () => {
    const data = seedWithNextReviewAt(LEGACY_ISO);
    expect(new Date(data.schedules[0].nextReviewAt).getTime(), "过去的合法 ISO 应原样保留").toBe(
      new Date(LEGACY_ISO).getTime()
    );
    expect(getDueCards(data).length).toBe(1);
  });

  it("缺失 → 补成「现在」→ 立刻到期（把「未知排期」当成「今天该复习」）", () => {
    const data = seedWithNextReviewAt(undefined);
    expect(new Date(data.schedules[0].nextReviewAt).getTime(), "缺失时 validIsoOrNow 回退 now（storage.ts:129-132）").toBeLessThanOrEqual(
      Date.now()
    );
    expect(getDueCards(data).length, "立刻到期").toBe(1);
  });

  it("★ 非法字符串 → 被改写成「现在」→ 立刻到期（原本可能排在很远的未来）", () => {
    const data = seedWithNextReviewAt("2026-13-45T99:99:99Z");
    expect(
      Number.isNaN(new Date(data.schedules[0].nextReviewAt).getTime()),
      "脏值应被替换为合法 ISO（不把 Invalid Date 泄漏到页面）"
    ).toBe(false);
    expect(getDueCards(data).length, "脏值卡被提前拉进到期队列").toBe(1);
    // 记录实际行为：intervalDays 仍是 4（保留），但 nextReviewAt 被改写。
    expect(data.schedules[0].intervalDays, "其它字段不受影响").toBe(4);
    expect(data.schedules[0].reviewCount).toBe(2);
  });

  it("空字符串 / null / 数字时间戳 的形态同样落到「立刻到期」", () => {
    for (const value of ["", null, 0, 1700000000000]) {
      const data = seedWithNextReviewAt(value);
      expect(
        Number.isNaN(new Date(data.schedules[0].nextReviewAt).getTime()),
        `nextReviewAt=${JSON.stringify(value)} 迁移后应是合法时间`
      ).toBe(false);
      expect(getDueCards(data).length, `nextReviewAt=${JSON.stringify(value)} 应到期`).toBe(1);
    }
  });

  it("未来时间 → 不立刻到期（对照，证明上面的「到期」不是恒真断言）", () => {
    const future = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    const data = seedWithNextReviewAt(future);
    expect(getDueCards(data), "未来排期的卡不该进到期队列").toEqual([]);
    expect(getLearningStats(data).dueTotal).toBe(0);
  });

  it("复习页在「脏 nextRevewAt」数据下不显示 Invalid Date 等占位词", () => {
    seedWithNextReviewAt("garbage-date");
    const page = mountPage(<ReviewPage />, "/review", "/review");
    expect(PLACEHOLDER_PATTERN.test(page.text()), "复习页文本不得出现占位词").toBe(false);
    page.unmount();
  });
});

describe("MG6-C reviews 缺失", () => {
  beforeEach(() => resetStorage());

  const seedNoReviews = (extra: Record<string, unknown> = {}) =>
    seedAppData(
      legacyBase({
        cards: [
          legacyCard({ id: "w1", front: "apple", back: "苹果", status: "review" }),
          legacyCard({ id: "w2", front: "pear", back: "梨", status: "review", priority: true })
        ],
        schedules: [legacySchedule("w1"), legacySchedule("w2")],
        // 故意不写 reviews 键
        ...extra
      }) as never
    );

  it("迁移补空数组（不是 undefined），下游 .filter 不会崩", () => {
    const data = seedNoReviews();
    expect(Array.isArray(data.reviews), "reviews 应是数组").toBe(true);
    expect(data.reviews).toEqual([]);
  });

  it("弱点统计：不崩，且不把「无错记录」的卡误判为薄弱", () => {
    const data = seedNoReviews();
    const insights = getWeakCardInsights(data);
    expect(
      insights,
      "getWeakCardInsights 的口径是「有错记录或 lapse」（reviewService.ts:342），无历史记录时不产出条目"
    ).toEqual([]);
    // 对照：getWeakCards 的口径包含 priority（用户置位的卡）——两处口径不同，但都不崩、都不误报错题数。
    const weakCards = getWeakCards(data);
    expect(weakCards.map((card) => card.id), "置位卡按 priority 口径算薄弱").toEqual(["w2"]);
    const insightsWithPriority = getWeakCardInsights(data, { limit: 10 });
    expect(insightsWithPriority.every((item) => Number.isFinite(item.score)), "score 必须是有限数").toBe(true);
    expect(insightsWithPriority.every((item) => item.wrongCount === 0), "无历史记录时 wrongCount 应为 0").toBe(true);
    const weakStats = getWeakStats(data);
    expect(weakStats.consecutiveErrorWords, "没有历史错记录 → 0").toBe(0);
    expect(weakStats.recentErrorWords).toBe(0);
  });

  it("错词本：无 reviews → 空分组（不是崩溃、也不是凭空多出条目）", () => {
    const data = seedNoReviews();
    expect(getMistakeGroupsByDate(data)).toEqual([]);
  });

  it("连胜天数：无 reviews → 0（不是 NaN）", () => {
    const data = seedNoReviews();
    expect(computeStreak(data.reviews)).toBe(0);
  });

  it("掌握判定：无 reviews → 「已掌握 0」，不会凭空报已掌握", () => {
    const data = seedNoReviews();
    expect(getLearningStats(data).mastered, "没有 mastered 卡时已掌握应为 0").toBe(0);
  });

  it("stats / today / spelling 三个页面在缺 reviews 的老数据下都不出现占位词", () => {
    seedNoReviews();
    const pages = [
      mountPage(<StatsPage />, "/stats", "/stats"),
      mountPage(<TodayPage />, "/today", "/today"),
      mountPage(<SpellingPage />, "/spelling", "/spelling")
    ];
    for (const page of pages) {
      const text = page.text();
      expect(PLACEHOLDER_PATTERN.test(text), `页面文本出现占位词：${text.slice(0, 120)}`).toBe(false);
      expect(text.trim().length, "页面应有实际内容").toBeGreaterThan(20);
      page.unmount();
    }
  });

  it("★ 合法但为空的历史：掌握数不看旧数据，只由「已掌握的卡」决定（数字口径一致）", () => {
    const data = seedNoReviews({ cards: [
      legacyCard({ id: "w1", front: "apple", back: "苹果", status: "review" }),
      legacyCard({ id: "w2", front: "pear", back: "梨", status: "mastered" }),
      legacyCard({ id: "w3", front: "plum", back: "李子", status: "suspended" })
    ] });
    const stats = getLearningStats(data);
    expect(stats.mastered, "只有 status=mastered 的算已掌握").toBe(1);
    expect(stats.suspendedCards, "暂停卡应被排除在活跃卡之外").toBe(1);
    expect(stats.totalCards, "总卡数仍是 3").toBe(3);
    expect(stats.dueTotal, "只有 w1 在复习轨道且到期").toBe(1);
  });
});

describe("MG6-D 老句子卡 back 为空 → /review 题面等于答案本身", () => {
  beforeEach(() => resetStorage());

  /**
   * 2026-09-21 的修复（lessonService.ts:236-256）只补写 `sourceId` 以 `lesson:` 开头的卡，
   * 且只在**访问语法地图页**时触发。hunt: / diary: 来源的存量卡不在修复范围内。
   * 而 /review 对句子卡的题面是 `card.back || card.front`（ReviewPage.tsx:223）——
   * back 为空时题面就是答案，用户照着抄一遍就算满分。
   */
  const seedEmptyBackCards = () =>
    seedAppData(
      legacyBase({
        grammarLessonsDone: [LESSON_ID],
        cards: [
          legacyCard({
            id: "lesson_card",
            type: "sentence",
            front: LESSON_SENTENCE,
            back: "",
            sourceId: `lesson:${LESSON_ID}`,
            tags: ["语法"],
            status: "review"
          }),
          legacyCard({
            id: "hunt_card",
            type: "sentence",
            front: "He goes to school.",
            back: "",
            sourceId: "hunt:hunt-kitchen-note",
            tags: ["语法"],
            status: "review"
          }),
          legacyCard({
            id: "diary_card",
            type: "sentence",
            front: "I went to the park.",
            back: "",
            sourceId: "diary:legacy",
            tags: ["日记"],
            status: "review"
          })
        ],
        schedules: [
          legacySchedule("lesson_card", { nextReviewAt: LEGACY_ISO }),
          legacySchedule("hunt_card", { nextReviewAt: new Date(Date.now() + 60_000).toISOString() }),
          legacySchedule("diary_card", { nextReviewAt: new Date(Date.now() + 120_000).toISOString() })
        ]
      }) as never
    );

  it("★ hunt 来源的存量卡：题面就是答案（`看提示，回忆英文` 下方直接显示整句）", () => {
    // 只让 hunt 卡到期（lesson 卡排未来），确保它排第一
    seedAppData(
      legacyBase({
        cards: [
          legacyCard({
            id: "hunt_card",
            type: "sentence",
            front: "He goes to school.",
            back: "",
            sourceId: "hunt:hunt-kitchen-note",
            tags: ["语法"],
            status: "review"
          })
        ],
        schedules: [legacySchedule("hunt_card")]
      }) as never
    );
    const page = mountPage(<ReviewPage />, "/review", "/review");
    const prompt = page.container.querySelector("#review-prompt-title")?.textContent ?? "";
    const kicker = page.container.querySelector(".prompt-kicker")?.textContent ?? "";
    expect(kicker, "句子卡走的是「看提示，回忆英文」").toContain("回忆英文");
    expect(
      prompt,
      "题面 = back || front；back 为空时题面就是答案本身——这道题零检验力（ReviewPage.tsx:223）"
    ).toBe("He goes to school.");
    page.unmount();
  });

  it("lesson 来源的存量卡：访问语法地图后 back 被补写，题面恢复为中文意图", () => {
    seedEmptyBackCards();
    // 首次进入 /review：还没访问过语法地图 → 仍是空 back
    const before = mountPage(<ReviewPage />, "/review", "/review");
    const promptBefore = before.container.querySelector("#review-prompt-title")?.textContent ?? "";
    before.unmount();
    // 语法地图页挂载时会跑 repairLessonCoreSentenceTranslations（异步）
    const path = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    path.unmount();
    return flushAsync().then(() => {
      const after = mountPage(<ReviewPage />, "/review", "/review");
      const promptAfter = after.container.querySelector("#review-prompt-title")?.textContent ?? "";
      after.unmount();
      // 排序按 nextReviewAt：lesson 卡排未来了，但这里只关心 back 是否被补写
      expect(
        promptBefore === LESSON_SENTENCE || promptAfter === LESSON_SENTENCE,
        "至少有一侧题面等于答案（lesson 卡 back 为空）"
      ).toBe(true);
      // 用服务层直接验证补写结果（页面只显示排队第一张，不一定是 lesson 卡）
      const repaired = readAppData().cards.find((card) => card.id === "lesson_card");
      expect(repaired?.back, "lesson 来源卡被补上中文意图").toBe("我正在画一幅画。");
      const huntUntouched = readAppData().cards.find((card) => card.id === "hunt_card");
      expect(
        huntUntouched?.back,
        "★ hunt 来源卡不在修复范围内（repairLessonCoreSentenceTranslations 只认 lesson: 前缀）→ 题面永远等于答案"
      ).toBe("");
      const diaryUntouched = readAppData().cards.find((card) => card.id === "diary_card");
      expect(diaryUntouched?.back, "★ diary 来源卡同样不在修复范围内").toBe("");
    });
  });
});
