// @vitest-environment jsdom
/**
 * MG7 · 老数据 → 日记 / 侦探 / 词汇的行为一致性（2026-09-22）
 *
 *   A. `diaryEntries` 缺 `status` / `issues`：日记页能否正常渲染、能否入复习队列？
 *   B. `huntResults` / `huntAttempts` 缺失：侦探页的进度、解锁、错词本是否正常？
 *   C. 词卡没有 `wordDetails`（`fillMissingDetails` 会补）：拼写页 / 词库显示是否正常？
 *   D. 全站文本红线：整页文本不得出现 NaN / undefined / null / Invalid Date。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarDiaryPage from "../../pages/GrammarDiaryPage";
import GrammarHuntPage from "../../pages/GrammarHuntPage";
import SpellingPage from "../../pages/SpellingPage";
import LibraryPage from "../../pages/LibraryPage";
import GrammarPathPage from "../../pages/GrammarPathPage";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import GrammarRevisitPage from "../../pages/GrammarRevisitPage";
import TodayPage from "../../pages/TodayPage";
import ReviewPage from "../../pages/ReviewPage";
import SentencesPage from "../../pages/SentencesPage";
import WordsPage from "../../pages/WordsPage";
import UnitsPage from "../../pages/UnitsPage";
import StatsPage from "../../pages/StatsPage";
import MistakeBookPage from "../../pages/MistakeBookPage";
import { summarizeDiaryProgress } from "../../services/diaryService";
import { addDiarySentenceToReview } from "../../services/diaryService";
import { hasUnlockedHuntCase, listHuntCasesWithLock, summarizeHuntProgress } from "../../services/huntService";
import { huntCases } from "../../data/huntCases";
import { getMistakeGroupsByDate } from "../../services/mistakeBookService";
import { buildSpellingQueue } from "../../services/spellingQueueService";
import { getDueCards, getLearningStats } from "../../services/reviewService";
import { listDueGrammarReviewCards } from "../../services/grammarReviewService";
import { seedAppData } from "./fixtures";
import { clickElement, setInputValue } from "./drive";
import { LEGACY_ISO, LESSON_ID, legacyBase, legacyCard, legacyDiaryEntry, legacySchedule } from "./mgLegacy";

/** 全站文本红线（第 4 条）：整页文本不得出现这些占位词。 */
const PLACEHOLDER_PATTERN = /\bNaN\b|\bundefined\b|\bnull\b|Invalid Date/;

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

describe("MG7-A diaryEntries 缺 status / issues", () => {
  beforeEach(() => resetStorage());

  /** 最早期形态：整条日记只有 id/dateKey/questionId/questionZh/answerEn/correctedEn/createdAt。 */
  const seedFieldlessDiary = () => {
    const entry = legacyDiaryEntry();
    delete entry.status;
    delete entry.issues;
    return seedAppData(legacyBase({ diaryEntries: [entry] }) as never);
  };

  it("迁移补默认值：status → pending、issues → []（不是 undefined）", () => {
    const data = seedFieldlessDiary();
    expect(data.diaryEntries[0].status, "缺失 status 应降级为 pending（storage.ts:754）").toBe("pending");
    expect(data.diaryEntries[0].issues, "缺失 issues 应补空数组").toEqual([]);
  });

  it("日记页正常渲染历史条目，且不出现占位词", () => {
    seedFieldlessDiary();
    const page = mountPage(<GrammarDiaryPage />, "/grammar/diary", "/grammar/diary");
    expect(page.has("I go to park yesterday."), "历史条目应渲染出用户原句").toBe(true);
    expect(page.has("待批改"), "status 缺失 → 显示待批改").toBe(true);
    expect(PLACEHOLDER_PATTERN.test(page.text()), `日记页出现占位词：${page.text().slice(0, 200)}`).toBe(false);
    page.unmount();
  });

  it("进度条数字与老数据一致：已写 1 条 / 覆盖 1 天 / 已批改 0", () => {
    const data = seedFieldlessDiary();
    const summary = summarizeDiaryProgress(data);
    expect(summary.totalEntries, "1 条日记").toBe(1);
    expect(summary.days, "1 天").toBe(1);
    expect(
      summary.correctedCount,
      "status 缺失被降级为 pending → 已批改 0（与「这条只写了没批改」的老数据实际内容一致）"
    ).toBe(0);
  });

  it("★ 缺 issues 的老日记无法入复习队列（「加入复习队列」按钮不渲染）", () => {
    const data = seedFieldlessDiary();
    const entry = data.diaryEntries[0];
    const after = addDiarySentenceToReview(data, entry);
    expect(
      after.cards.length,
      "addDiarySentenceToReview 对 issues.length === 0 的条目直接返回（diaryService.ts:353）→ 卡数不变"
    ).toBe(data.cards.length);
    seedFieldlessDiary();
    const page = mountPage(<GrammarDiaryPage />, "/grammar/diary", "/grammar/diary");
    expect(
      page.has("加入复习队列"),
      "按钮只在 issues.length > 0 时渲染（GrammarDiaryPage.tsx:508）——缺 issues 的老日记看不到入口"
    ).toBe(false);
    page.unmount();
  });

  it("负向对照：issues 有内容的老日记能正常入队，且带上「语法」标签", () => {
    const data = seedAppData(
      legacyBase({
        diaryEntries: [
          legacyDiaryEntry({
            issues: [{ original: "go", correction: "went", explanation: "昨天的事换说法。" }]
          })
        ]
      }) as never
    );
    const after = addDiarySentenceToReview(data, data.diaryEntries[0]);
    expect(after.cards.length, "有问题的日记应产出 1 张句子卡").toBe(data.cards.length + 1);
    const card = after.cards[after.cards.length - 1];
    expect(card.tags, "必须带「语法」标签才能进语法复习队列（diaryService.ts:367）").toContain("语法");
    expect(card.sourceId, "sourceId 用于幂等与弱点归因").toBe(`diary:${data.diaryEntries[0].id}`);
  });

  it("★ 历史「只有日记标签」的语法卡进不了语法复习队列（已确认的旧代码口径）", () => {
    // 2026-09-19 之前 addDiarySentenceToReview 只写 tags: "日记"（见 diaryService.ts 注释里的口径修正①②）。
    // 那批卡在今天的 grammarReviewService.isGrammarSentenceCard（tags.includes("语法")）下永远不进场。
    const data = seedAppData(
      legacyBase({
        cards: [
          legacyCard({
            id: "old_diary_card",
            type: "sentence",
            front: "I went to the park yesterday.",
            tags: ["日记"],
            sourceId: "diary:legacy",
            status: "review"
          })
        ],
        schedules: [legacySchedule("old_diary_card")]
      }) as never
    );
    expect(
      listDueGrammarReviewCards(data).length,
      "只有「日记」标签的存量卡被语法复习队列排除（排查线索：tags 是否含「语法」）"
    ).toBe(0);
    // 对照：通用复习队列（不筛标签）仍能看到它——缺陷只发生在语法复习这一条链路。
    expect(getDueCards(data).length, "通用复习队列仍包含这张卡").toBe(1);
  });

  it("日记页在「issues 缺失」的条目上不渲染半截列表", () => {
    seedFieldlessDiary();
    const page = mountPage(<GrammarDiaryPage />, "/grammar/diary", "/grammar/diary");
    expect(
      page.container.querySelectorAll(".diary-issue-list").length,
      "issues 补成空数组后不该渲染空的调整列表"
    ).toBe(0);
    page.unmount();
  });

  it("缺 questionZh 的老日记条目会整条被过滤掉（用户内容静默减少）", () => {
    const entry = legacyDiaryEntry();
    delete (entry as Record<string, unknown>).issues;
    delete (entry as Record<string, unknown>).status;
    (entry as Record<string, unknown>).questionId = "";
    const data = seedAppData(legacyBase({ diaryEntries: [entry] }) as never);
    expect(
      data.diaryEntries.length,
      "normalizeDiaryEntries 末段 filter 要求 answerEn && questionId（storage.ts:760）→ 缺 questionId 被静默丢弃"
    ).toBe(0);
  });
});

describe("MG7-B huntResults / huntAttempts 缺失", () => {
  beforeEach(() => resetStorage());

  const seedNoHunt = () => seedAppData(legacyBase({}) as never);

  it("迁移补空数组，进度汇总为 0（不崩、不误报）", () => {
    const data = seedNoHunt();
    expect(data.huntResults).toEqual([]);
    expect(data.huntAttempts).toEqual([]);
    const summary = summarizeHuntProgress(data);
    expect(summary.solvedCaseIds).toEqual([]);
    expect(summary.totalCases, "总案数来自内置案件库，与老数据无关").toBe(huntCases.length);
    expect(summary.totalMisses).toBe(0);
    expect(summary.hitCount).toBe(0);
    expect(summary.guessCount).toBe(0);
    expect(summary.tagStats.length, "罪名统计表应完整（11 项），全为 0").toBe(11);
    expect(summary.tagStats.every((stat) => stat.found === 0 && stat.wrong === 0)).toBe(true);
  });

  it("零进度老用户：全部案件锁定（第 1 案也未解锁），入口判定为 false", () => {
    const data = seedNoHunt();
    const infos = listHuntCasesWithLock(data);
    expect(infos.every((info) => !info.unlocked), "没学过任何课时所有案件都该锁定").toBe(true);
    expect(hasUnlockedHuntCase(data), "路径页「去侦探找错」入口应判为不可用").toBe(false);
  });

  it("侦探页在零进度老数据上正常渲染统计条与锁定案海，无占位词", () => {
    seedNoHunt();
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    const text = page.text();
    expect(PLACEHOLDER_PATTERN.test(text), `侦探页出现占位词：${text.slice(0, 200)}`).toBe(false);
    expect(text, "应显示 0 已破案").toContain("已破案");
    page.unmount();
  });

  it("错词本在「无侦探记录」时为空分组（不凭空多出条目）", () => {
    const data = seedNoHunt();
    expect(getMistakeGroupsByDate(data)).toEqual([]);
  });

  it("有过破案记录的旧数据：已破案数 / 解锁态与 huntResults 实际内容一致", () => {
    const firstCase = huntCases[0];
    const data = seedAppData(
      legacyBase({
        huntResults: [
          {
            id: "hr1",
            caseId: firstCase.id,
            found: firstCase.errors.length,
            total: firstCase.errors.length,
            misses: 1,
            stars: 1,
            durationMs: 120000,
            finishedAt: LEGACY_ISO
          }
        ],
        huntAttempts: [
          { id: "ha1", caseId: firstCase.id, tokenIndex: 0, guessedTag: "tense", hit: true, createdAt: LEGACY_ISO },
          { id: "ha2", caseId: firstCase.id, tokenIndex: 1, guessedTag: "article", hit: false, createdAt: LEGACY_ISO }
        ]
      }) as never
    );
    const summary = summarizeHuntProgress(data);
    expect(summary.solvedCaseIds, "found === total 判定为已破案").toEqual([firstCase.id]);
    expect(summary.totalMisses, "累计误判取 huntResults.misses 之和").toBe(1);
    expect(summary.hitCount, "命中数取 attempts.hit").toBe(1);
    expect(summary.guessCount).toBe(2);
  });

  it("★ huntResults 里 total 与当前案件实际错数不一致时，已破案数会少算（口径不一致）", () => {
    // 老数据可能记着旧版案件的错误数（案件内容被改过：现在 2 处错、当年记的是 1 处）。
    const target = huntCases.find((item) => item.errors.length !== 1);
    if (!target) return;
    const data = seedAppData(
      legacyBase({
        huntResults: [
          {
            id: "hr_old",
            caseId: target.id,
            found: 1,
            total: 1,
            misses: 0,
            stars: 3,
            durationMs: 60000,
            finishedAt: LEGACY_ISO
          }
        ]
      }) as never
    );
    const summary = summarizeHuntProgress(data);
    expect(
      summary.solvedCaseIds,
      `案件 ${target.id} 实际有 ${target.errors.length} 处错，老记录 total=1 → found(1) !== 实际总错数(${target.errors.length})，因而不算已破案（huntService.ts:429-434）`
    ).toEqual([]);
  });

  it("侦探页在「案件引用了已删除卡片」的老数据下仍能渲染（无 NaN/undefined）", () => {
    seedAppData(
      legacyBase({
        huntResults: [
          {
            id: "hr_ghost",
            caseId: "case-that-no-longer-exists",
            found: 1,
            total: 1,
            misses: 0,
            stars: 3,
            durationMs: 1000,
            finishedAt: LEGACY_ISO
          }
        ],
        huntAttempts: [
          { id: "ha_ghost", caseId: "case-that-no-longer-exists", tokenIndex: 0, guessedTag: null, hit: false, createdAt: LEGACY_ISO }
        ]
      }) as never
    );
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    expect(PLACEHOLDER_PATTERN.test(page.text()), "未知 caseId 记录不该污染页面文本").toBe(false);
    page.unmount();
  });
});

describe("MG7-C 词卡没有 wordDetails（fillMissingDetails 补齐）", () => {
  beforeEach(() => resetStorage());

  const seedWordWithoutDetails = () =>
    seedAppData(
      legacyBase({
        cards: [
          legacyCard({ id: "w1", front: "apple", back: "苹果", unitId: "unit-1", status: "review" }),
          legacyCard({ id: "w2", front: "pear", back: "梨", unitId: "unit-1", status: "new" })
        ],
        units: [
          {
            id: "unit-1",
            title: "我的词书",
            description: "",
            order: 1,
            color: "#2563eb",
            createdAt: LEGACY_ISO,
            updatedAt: LEGACY_ISO
          }
        ],
        schedules: [legacySchedule("w1")]
        // 故意不写 wordDetails
      }) as never
    );

  it("迁移补齐 wordDetails：字段齐全、无 undefined 值", () => {
    const data = seedWordWithoutDetails();
    expect(data.wordDetails.length, "每张词卡都应有一条详情（storage.ts:380-403）").toBe(2);
    for (const details of data.wordDetails) {
      const card = data.cards.find((item) => item.id === details.cardId)!;
      expect(details.word, "word 取卡面前端小写").toBe(card.front.toLowerCase());
      expect(details.chineseDefinition, "中文释义回退到卡背").toBe(card.back);
      for (const key of ["phonetic", "partOfSpeech", "englishDefinition", "collocations"] as const) {
        expect(typeof details[key], `${key} 应是字符串（空串而非 undefined）`).toBe("string");
      }
    }
  });

  it("拼写页在补齐的空详情上显示回退文案，不出现 undefined", () => {
    seedWordWithoutDetails();
    const page = mountPage(<SpellingPage />, "/spelling", "/spelling");
    const text = page.text();
    expect(text, "音标为空时应显示占位文案「无音标」").toContain("无音标");
    expect(PLACEHOLDER_PATTERN.test(text), `拼写页出现占位词：${text.slice(0, 200)}`).toBe(false);
    page.unmount();
  });

  it("词库页：补出来的空详情词卡在详情面板里不渲染空字段块，且无占位词", () => {
    seedWordWithoutDetails();
    const page = mountPage(<LibraryPage />, "/library", "/library");
    // 列表项本身是 div（不是 button）：点它选中并打开右侧详情面板
    const items = Array.from(page.container.querySelectorAll(".library-item"));
    const apple = items.find((node) => (node.textContent ?? "").includes("apple"));
    expect(apple, "词库里应能列出 apple").toBeTruthy();
    clickElement(apple);
    const panel = page.container.querySelector(".library-detail-panel");
    expect(panel, "选中后应渲染详情面板").toBeTruthy();
    const panelText = (panel?.textContent ?? "").replace(/\s+/g, " ");
    expect(panelText, "详情面板应显示卡面").toContain("apple");
    expect(PLACEHOLDER_PATTERN.test(panelText), `词库详情面板出现占位词：${panelText.slice(0, 200)}`).toBe(false);
    // LibraryPage.tsx:1100 的条件渲染：phonetic 与 partOfSpeech 都为空 → 整块不渲染
    expect(
      page.container.querySelectorAll(".library-detail-fields").length,
      "补出来的空详情不该渲染「音标/词性」字段块"
    ).toBe(0);
    page.unmount();
  });

  it("词库搜索：无详情老卡仍可按卡面与卡背搜到", () => {
    seedWordWithoutDetails();
    const page = mountPage(<LibraryPage />, "/library", "/library");
    const input = page.container.querySelector(
      "input[aria-label*='搜索词库内容']"
    ) as HTMLInputElement | null;
    expect(input, "词库应有搜索框").toBeTruthy();
    const labels = () =>
      Array.from(page.container.querySelectorAll(".library-item")).map((node) =>
        (node.textContent ?? "").replace(/\s+/g, " ")
      );
    setInputValue(input!, "apple");
    expect(labels().some((label) => label.includes("apple")), "按卡面能搜到").toBe(true);
    expect(labels().length, "搜索应过滤掉不匹配项").toBe(1);
    setInputValue(input!, "梨");
    expect(labels().some((label) => label.includes("梨")), "按卡背（中文释义）能搜到").toBe(true);
    page.unmount();
  });

  it("拼写队列在「无详情 + 有新词」的老数据上正常出词", () => {
    const data = seedWordWithoutDetails();
    const queue = buildSpellingQueue(data, "unit-1", "standard", 30);
    expect(queue.map((card) => card.id), "到期词在前、新词补足").toEqual(["w1", "w2"]);
    const stats = getLearningStats(data);
    expect(stats.missingScheduleCards, "所有卡都有计划（迁移补齐）").toBe(0);
  });

  it("【语义收紧 2026-09-23】无 unitId 的老词卡保持未分配（不再静默编入内置书）", () => {
    /**
     * 修复前：`ensureDefaultUnits` 把 word 卡按「下标 / 20」静默塞进 `core-100-unit-N`。
     * 这与产品的「未分配」设计冲突——删除词书时 UI 明确承诺
     * 「单词会保留，并变成**未分配**」，并有常驻的「收纳未分配词（N）」入口。
     * 自动编入会让「用户删完书、重启又回来」。
     * 现在无归属词卡保持未分配，由用户主动收纳。
     */
    const data = seedAppData(
      legacyBase({
        cards: [
          legacyCard({ id: "w_orphan", front: "apple", back: "苹果", status: "new" }),
          legacyCard({ id: "w_orphan2", front: "pear", back: "梨", status: "new" })
        ]
      }) as never
    );
    expect(
      data.cards.map((card) => card.unitId),
      "两张无归属的老词卡保持未分配"
    ).toEqual([undefined, undefined]);
    expect(
      data.units.some((unit) => unit.id === "core-100-unit-1"),
      "内置词书本体也会被一并创建"
    ).toBe(true);
    expect(
      data.cards.every((card) => Boolean(card.unitId)),
      "不再为无归属词卡编造归属（它们会出现在「未分配词」列表里，由用户主动收纳）"
    ).toBe(false);
  });
});

describe("MG7-D 全站文本红线：老数据下 15 个页面不出现占位词", () => {
  beforeEach(() => resetStorage());

  /** 一份「最残缺的老数据」：只有卡片与一个已完成的课，其余字段全缺。 */
  const seedBarest = () =>
    seedAppData(
      legacyBase({
        cards: [
          legacyCard({ id: "w1", front: "apple", back: "苹果", status: "review" }),
          legacyCard({ id: "w2", front: "pear", back: "梨", status: "new" }),
          legacyCard({ id: "s1", type: "sentence", front: "I am drawing a picture.", tags: ["语法"], status: "review" })
        ],
        grammarLessonsDone: [LESSON_ID]
      }) as never
    );

  const pages: Array<[string, React.ReactElement, string, string]> = [
    ["课程地图", <GrammarPathPage />, "/grammar", "/grammar"],
    ["语法复习", <GrammarReviewPage />, "/grammar/review", "/grammar/review"],
    ["语法课", <GrammarLessonPage />, `/grammar/lesson/${LESSON_ID}`, "/grammar/lesson/:lessonId"],
    ["次日回访", <GrammarRevisitPage />, `/grammar/lesson/${LESSON_ID}/revisit`, "/grammar/lesson/:lessonId/revisit"],
    ["日记", <GrammarDiaryPage />, "/grammar/diary", "/grammar/diary"],
    ["侦探", <GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt"],
    ["拼写", <SpellingPage />, "/spelling", "/spelling"],
    ["词库", <LibraryPage />, "/library", "/library"],
    ["首页", <TodayPage />, "/today", "/today"],
    ["复习", <ReviewPage />, "/review", "/review"],
    ["句子", <SentencesPage />, "/sentences", "/sentences"],
    ["单词", <WordsPage />, "/words", "/words"],
    ["词书", <UnitsPage />, "/units", "/units"],
    ["统计", <StatsPage />, "/stats", "/stats"],
    ["错词本", <MistakeBookPage />, "/mistakes", "/mistakes"]
  ];

  for (const [name, element, path, routePath] of pages) {
    it(`${name}：整页文本无 NaN / undefined / null / Invalid Date`, () => {
      seedBarest();
      const page = mountPage(element, path, routePath);
      const text = page.text();
      const hit = PLACEHOLDER_PATTERN.exec(text);
      expect(hit, `${name} 出现占位词「${hit?.[0]}」：…${text.slice(Math.max(0, (hit?.index ?? 0) - 60), (hit?.index ?? 0) + 60)}…`).toBeNull();
      page.unmount();
    });
  }

  it("负向对照：检测逻辑确实能抓到占位词", () => {
    expect(PLACEHOLDER_PATTERN.test("共 NaN 句")).toBe(true);
    expect(PLACEHOLDER_PATTERN.test("已掌握 undefined / 共 3 句")).toBe(true);
    expect(PLACEHOLDER_PATTERN.test("null 条记录")).toBe(true);
    expect(PLACEHOLDER_PATTERN.test("Invalid Date")).toBe(true);
    expect(PLACEHOLDER_PATTERN.test("共 3 句，全部完成")).toBe(false);
  });
});
